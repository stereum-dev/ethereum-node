import { SSHService } from "./SSHService";
import { StringUtils } from "./StringUtils";
import { nodeOS } from "./NodeOS";
import { ServiceVolume } from "./ethereum-services/ServiceVolume";
import axios from "axios";
import net from "net";
import YAML from "yaml";
const log = require("electron-log");
const electron = require("electron");

if (process.env.IS_DEV === "true" || process.env.NODE_ENV === "test") {
  global.branch = "main";
  log.info("pulling from main branch");
} else {
  global.branch = undefined;
}

export class NodeConnection {
  constructor(nodeConnectionParams) {
    this.sshService = new SSHService();
    this.nodeConnectionParams = nodeConnectionParams;
    this.os = null;
  }

  async establish(taskManager) {
    await this.sshService.connect(this.nodeConnectionParams);
    await this.findStereumSettings();
    this.taskManager = taskManager;
  }

  /**
   * identify the operating system of the connected node
   */
  async findOS() {
    // Run the command without sudo wrapper
    const uname = await this.sshService.exec("cat /etc/*-release", null, false);
    log.debug("result uname: ", uname);
    if (uname.rc == 0) {
      if (uname.stdout && uname.stdout.toLowerCase().search("centos") >= 0) {
        this.os = nodeOS.centos;
      } else if (uname.stdout && uname.stdout.toLowerCase().search("ubuntu") >= 0) {
        log.debug("setting ubuntu");
        this.os = nodeOS.ubuntu;
      }
    }
  }

  /**
   * identify the sudo permission of the connected node
   */
  async checkSudo() {
    // Create the command that will be executed on the node to check sudo perms
    let cmd = `
      # Check if user is root
      if [ $(id -u -n) == "root" ]; then
        echo "SUCCESS: user can sudo without password because he is root"
        exit 0
      fi
      # Check if users needs a password for sudo
      msg=$(sudo -l 2>&1)
      if [[ "$msg" == *"sudo: a password is required"* ]]; then
        echo "FAIL: user can not sudo without password!"
        exit 1
      fi
      # Success
      echo "SUCCESS: user can sudo without password"
      exit 0
    `;

    // Run the command (without sudo wrapper!)
    let result = await this.sshService.exec(cmd, null, false);

    // No data in stdout or data in stderr? Executed code above failed to run!
    if (result.stdout == "" || result.stderr != "") {
      result.rc = 2;
      result.stdout = "ERROR: Executed code failed to run";
      if (result.stderr != "") {
        result.stdout += " (" + result.stderr + ")";
      } else if (result.stdout == "") {
        result.stdout += " (syntax error)";
      }
    }

    // Return the result
    return result;
  }

  /**
   * read stereum settings and make them accessible
   */
  async findStereumSettings() {
    const stereumConfig = await this.sshService.exec("cat /etc/stereum/stereum.yaml");
    if (stereumConfig.rc == 0) {
      this.settings = {
        stereum: YAML.parse(stereumConfig.stdout).stereum_settings,
      };
    }
  }

  /**
   * Prepare a fresh server to run stereum services on it
   */
  async prepareStereumNode(installationDirectory) {
    this.installationDirectory = installationDirectory;
    return new Promise(async (resolve, reject) => {
      if (!this.os) {
        log.debug("os not found yet");
        await this.findOS();
      }

      /**
       * install necessary OS packages
       */
      log.info("installing necessary os packages");
      const ref = StringUtils.createRandomString();
      this.taskManager.tasks.push({
        name: "install os packages",
        otherRunRef: ref,
      });

      log.debug("this.os: ", this.os);
      log.debug("nodeOS.ubuntu: ", nodeOS.ubuntu);
      if (this.os == nodeOS.centos) {
        this.taskManager.otherSubTasks.push({
          name: "Check OS",
          otherRunRef: ref,
          status: false,
        });
        this.taskManager.finishedOtherTasks.push({ otherRunRef: ref });
        return reject("not implemented yet");
      } else if (this.os == nodeOS.ubuntu) {
        log.debug("procede on ubuntu");
        this.taskManager.otherSubTasks.push({
          name: "Check OS",
          otherRunRef: ref,
          status: true,
        });
        let installPkgResult;
        try {
          installPkgResult = await this.sshService.exec(
            "apt update &&\
                    apt install -y software-properties-common &&\
                    add-apt-repository --yes --update ppa:ansible/ansible &&\
                    apt install -y pip ansible tar gzip wget git"
          );
        } catch (err) {
          log.error(err);
          installPkgResult = { rc: 1, stderr: err };
        }
        if (SSHService.checkExecError(installPkgResult)) {
          this.taskManager.otherSubTasks.push({
            name: "installing packages",
            otherRunRef: ref,
            status: false,
            data:
              "This error might occur beacuse of a missing interaction. Running this command manually may fix this problem: apt update && apt install -y software-properties-common && add-apt-repository --yes --update ppa:ansible/ansible && apt install -y pip ansible tar gzip wget git \n\n\nError: " +
              installPkgResult.stderr,
          });
          this.taskManager.finishedOtherTasks.push({ otherRunRef: ref });
          return reject("Can't install os packages: " + SSHService.extractExecError(installPkgResult));
        }
        this.taskManager.otherSubTasks.push({
          name: "installing packages",
          otherRunRef: ref,
          status: true,
        });
      } else {
        this.taskManager.otherSubTasks.push({
          name: "Check OS",
          otherRunRef: ref,
          status: false,
        });
        this.taskManager.finishedOtherTasks.push({ otherRunRef: ref });
        return reject("unsupported OS");
      }

      /**
       * remove stereum ansible playbooks & roles if exist
       */
      await this.sshService.exec(`rm -rf ${this.installationDirectory}/ansible`);

      /**
       * fetch stereum version
       */
      let versions;
      let commit;
      try {
        versions = await this.checkUpdates();
        this.taskManager.otherSubTasks.push({
          name: "Get Version Information",
          otherRunRef: ref,
          status: true,
        });
      } catch (err) {
        this.taskManager.otherSubTasks.push({
          name: "Get Version Information",
          otherRunRef: ref,
          status: false,
        });
        log.error(`Couldn't fetch versions in PrepareStereumNode...
        Installing with predefined Versions...
        ${err.name}: ${err.message}
        url: ${err.config.url}
        method: ${err.config.method}
        headers: ${err.config.headers}
        timeout: ${err.config.timeout}
        `);
      }
      if (versions) {
        commit = versions["stereum"].slice(-1).pop().commit;
      } else {
        commit = "main";
      }
      log.info("CommitHash:", commit);

      /**
       * install stereum ansible playbooks & roles
       */
      log.info("installing stereum ansible roles");

      let installResult;
      try {
        installResult = await this.sshService.exec(
          `mkdir -p "${this.installationDirectory}/ansible" &&
          cd "${this.installationDirectory}/ansible" &&
          git init &&
          git remote add -f ethereum-node https://github.com/stereum-dev/ethereum-node.git &&
          git config core.sparseCheckout true &&
          echo 'controls' >> .git/info/sparse-checkout &&
          git checkout ${global.branch ? global.branch : commit}`
        );
      } catch (err) {
        log.error("can't install ansible roles", err);
        this.taskManager.otherSubTasks.push({
          name: "install ansible roles",
          otherRunRef: ref,
          status: false,
        });
        this.taskManager.finishedOtherTasks.push({ otherRunRef: ref });
        return reject("Can't install ansible roles: " + err);
      }

      if (SSHService.checkExecError(installResult)) {
        this.taskManager.otherSubTasks.push({
          name: "install ansible roles",
          otherRunRef: ref,
          status: false,
        });
        this.taskManager.finishedOtherTasks.push({ otherRunRef: ref });
        return reject("Can't install ansible role: " + SSHService.extractExecError(installResult));
      }
      this.taskManager.otherSubTasks.push({
        name: "install ansible roles",
        otherRunRef: ref,
        status: true,
      });
      this.taskManager.finishedOtherTasks.push({ otherRunRef: ref });
      /**
       * run stereum ansible playbook "setup"
       */
      log.info("run stereum ansible playbook 'setup'");
      let playbookRuns = [];
      try {
        playbookRuns.push(
          await this.runPlaybook("setup", {
            stereum_role: "setup",
            stereum_args: {
              settings: {
                controls_install_path: this.installationDirectory,
              },
            },
          })
        );
      } catch (err) {
        log.error("foo", err);
        reject("Can't run setup playbook: " + err);
      }

      /*
       *  run stereum ansible playbook "configure-firewall"
       */
      log.info("run stereum ansible playbook 'configure-firewall'");
      try {
        playbookRuns.push(
          await this.runPlaybook("configure-firewall", {
            stereum_role: "configure-firewall",
          })
        );
      } catch (err) {
        log.error("foo", err);
        reject("Can't run configure-firewall playbook: " + err);
      }

      return resolve(playbookRuns);
    });
  }

  /**
   * start a playbook
   */
  async runPlaybook(playbook, extraVars) {
    return new Promise(async (resolve, reject) => {
      if (!this.settings) {
        reject("Settings not loaded! Run findStereumSettings() first.");
      }

      log.info("starting playbook " + playbook + " with extra vars", extraVars);

      const playbookRunRef = StringUtils.createRandomString();

      log.info("using playbookRunRef: ", playbookRunRef);
      let extraVarsJson = "";
      if (extraVars) {
        extraVarsJson = JSON.stringify(extraVars);
      }

      let ansibleResult;
      this.taskManager.tasks.push({ name: playbook, ref: playbookRunRef });
      try {
        ansibleResult = await this.sshService.exec(
          "             ANSIBLE_LOAD_CALLBACK_PLUGINS=1\
                        ANSIBLE_STDOUT_CALLBACK=stereumjson\
                        ANSIBLE_LOG_FOLDER=/tmp/" +
          playbookRunRef +
          "\
                        ansible-playbook\
                        --connection=local\
                        --inventory 127.0.0.1,\
                        --extra-vars " +
          StringUtils.escapeStringForShell(extraVarsJson) +
          "\
                        " +
          this.settings.stereum.settings.controls_install_path +
          "/ansible/controls/genericPlaybook.yaml\
                        "
        );
      } catch (err) {
        log.error("Can't run playbook '" + playbook + "'", err);
        return reject("Can't run playbook: " + err);
      }

      if (SSHService.checkExecError(ansibleResult)) {
        return reject("Failed running '" + playbook + "': " + SSHService.extractExecError(ansibleResult));
      }
      this.taskManager.finishedPlaybooks.push(playbookRunRef);
      return resolve({
        playbook: playbook,
        playbookRunRef: playbookRunRef,
      });
    });
  }

  /**
   * get the logs of a playbook started via runPlayboook(...)
   */
  async playbookStatus(playbookRunRef) {
    return new Promise(async (resolve, reject) => {
      log.debug("playbook status of ref ", playbookRunRef);

      let statusResult;
      try {
        statusResult = await this.sshService.exec("cat /tmp/" + playbookRunRef + "/localhost");
      } catch (err) {
        log.error("Can't read playbook status '" + playbookRunRef + "'", err);
        return reject("Can't read playbook status '" + playbookRunRef + "': " + err);
      }

      if (SSHService.checkExecError(statusResult)) {
        return reject(
          "Failed reading status of ref '" + playbookRunRef + "': " + SSHService.extractExecError(statusResult)
        );
      }

      return resolve(statusResult.stdout);
    });
  }

  /**
   * list services configurations
   */
  async listServicesConfigurations() {
    return new Promise(async (resolve, reject) => {
      let services;
      try {
        services = await this.sshService.exec("ls -1 /etc/stereum/services");
      } catch (err) {
        log.error("Can't read services configurations", err);
        return reject("Can't read services configurations: " + err);
      }

      if (SSHService.checkExecError(services)) {
        return reject("Failed reading services configurations: " + SSHService.extractExecError(services));
      }

      return resolve(services.stdout.split("\n").filter((i) => i));
    });
  }

  /**
   * read a specific service configuration
   */
  async readServiceConfiguration(serviceId) {
    return new Promise(async (resolve, reject) => {
      let serviceConfig;
      try {
        const suffix = serviceId.endsWith(".yaml") ? "" : ".yaml";
        serviceConfig = await this.sshService.exec("cat /etc/stereum/services/" + serviceId + suffix);
      } catch (err) {
        log.error("Can't read service configuration of " + serviceId, err);
        return reject("Can't read service configuration of " + serviceId + ": " + err);
      }

      if (SSHService.checkExecError(serviceConfig)) {
        return reject(
          "Failed reading service configuration " + serviceId + ": " + SSHService.extractExecError(serviceConfig)
        );
      }

      return resolve(YAML.parse(serviceConfig.stdout));
    });
  }

  /**
   * read a specific service configuration
   */
  async readServiceYAML(serviceId) {
    return new Promise(async (resolve, reject) => {
      let serviceYAML;
      try {
        const suffix = serviceId.endsWith(".yaml") ? "" : ".yaml";
        serviceYAML = await this.sshService.exec("cat /etc/stereum/services/" + serviceId + suffix);
      } catch (err) {
        log.error("Can't read service yaml of " + serviceId, err);
        return reject("Can't read service yaml of " + serviceId + ": " + err);
      }

      if (SSHService.checkExecError(serviceYAML)) {
        return reject("Failed reading service yaml " + serviceId + ": " + SSHService.extractExecError(serviceYAML));
      }

      return resolve(serviceYAML.stdout);
    });
  }

  async readSSVNetworkConfig(serviceID) {
    return new Promise(async (resolve, reject) => {
      let SSVNetworkConfig;
      try {
        const service = await this.readServiceConfiguration(serviceID);
        let configPath = ServiceVolume.buildByConfig(
          service.volumes.find((v) => v.split(":").slice(-1) == "/data")
        ).destinationPath;
        if (configPath.endsWith("/")) configPath = configPath.slice(0, -1, ""); //if path ends with '/' remove it

        SSVNetworkConfig = await this.sshService.exec(`cat ${configPath}/config.yaml`);
      } catch (err) {
        log.error("Can't read SSV config " + serviceID, err);
        return reject("Can't read SSV config " + serviceID + ": " + err);
      }

      if (SSHService.checkExecError(SSVNetworkConfig)) {
        return reject("Failed reading SSV config " + serviceID + ": " + SSHService.extractExecError(SSVNetworkConfig));
      }

      return resolve(SSVNetworkConfig.stdout);
    });
  }

  async writeSSVNetworkConfig(serviceID, config) {
    return new Promise(async (resolve, reject) => {
      let configStatus;
      const ref = StringUtils.createRandomString();
      this.taskManager.tasks.push({ name: "write SSV config", otherRunRef: ref });
      const service = await this.readServiceConfiguration(serviceID);
      try {
        let configPath = ServiceVolume.buildByConfig(
          service.volumes.find((v) => v.split(":").slice(-1) == "/data")
        ).destinationPath;
        if (configPath.endsWith("/")) configPath = configPath.slice(0, -1, ""); //if path ends with '/' remove it
        configStatus = await this.sshService.exec(
          "echo -e " + StringUtils.escapeStringForShell(config.trim()) + ` > ${configPath}/config.yaml`
        );
      } catch (err) {
        this.taskManager.otherSubTasks.push({
          name: "write SSV config yaml",
          otherRunRef: ref,
          status: false,
        });
        this.taskManager.finishedOtherTasks.push({ otherRunRef: ref });
        log.error("Can't write SSV config", err);
        return reject("Can't write SSV config: " + err);
      }

      if (SSHService.checkExecError(configStatus)) {
        this.taskManager.otherSubTasks.push({
          name: "write SSV config yaml",
          otherRunRef: ref,
          status: false,
        });
        this.taskManager.finishedOtherTasks.push({ otherRunRef: ref });
        return reject("Can't write SSV config: " + SSHService.extractExecError(configStatus));
      }
      this.taskManager.otherSubTasks.push({
        name: "write SSV config yaml",
        otherRunRef: ref,
        status: true,
      });
      this.taskManager.finishedOtherTasks.push({ otherRunRef: ref });
      return resolve();
    });
  }

  /**
   * write a specific service YAML
   *
   * @param service object {id,data,service} id: serviceID, data: plain YAML, service: Service Name
   */
  async writeServiceYAML(service) {
    return new Promise(async (resolve, reject) => {
      let configStatus;
      const ref = StringUtils.createRandomString();
      this.taskManager.tasks.push({ name: "write yaml", otherRunRef: ref });
      try {
        configStatus = await this.sshService.exec(
          "echo -e " +
          StringUtils.escapeStringForShell(service.data.trim()) +
          " > /etc/stereum/services/" +
          service.id +
          ".yaml"
        );
      } catch (err) {
        this.taskManager.otherSubTasks.push({
          name: "write " + service.service + " yaml",
          otherRunRef: ref,
          status: false,
        });
        this.taskManager.finishedOtherTasks.push({ otherRunRef: ref });
        log.error("Can't write service yaml of " + service.id, err);
        return reject("Can't write service configuration of " + service.id + ": " + err);
      }

      if (SSHService.checkExecError(configStatus)) {
        this.taskManager.otherSubTasks.push({
          name: "write " + service.service + " config",
          otherRunRef: ref,
          status: false,
        });
        this.taskManager.finishedOtherTasks.push({ otherRunRef: ref });
        return reject(
          "Failed writing service configuration " + service.id + ": " + SSHService.extractExecError(configStatus)
        );
      }
      this.taskManager.otherSubTasks.push({
        name: "write " + service.service + " config",
        otherRunRef: ref,
        status: true,
      });
      this.taskManager.finishedOtherTasks.push({ otherRunRef: ref });
      return resolve();
    });
  }

  /**
   * write a specific service configuration
   *
   * @param serviceConfiguration servicd configuration to write to the node
   */
  async writeServiceConfiguration(serviceConfiguration) {
    return new Promise(async (resolve, reject) => {
      let configStatus;
      const ref = StringUtils.createRandomString();
      this.taskManager.tasks.push({ name: "write config", otherRunRef: ref });
      try {
        configStatus = await this.sshService.exec(
          "echo -e " +
          StringUtils.escapeStringForShell(YAML.stringify(serviceConfiguration)) +
          " > /etc/stereum/services/" +
          serviceConfiguration.id +
          ".yaml"
        );
      } catch (err) {
        this.taskManager.otherSubTasks.push({
          name: "write " + serviceConfiguration.service + " config",
          otherRunRef: ref,
          status: false,
        });
        this.taskManager.finishedOtherTasks.push({ otherRunRef: ref });
        log.error("Can't write service configuration of " + serviceConfiguration.id, err);
        return reject("Can't write service configuration of " + serviceConfiguration.id + ": " + err);
      }

      if (SSHService.checkExecError(configStatus)) {
        this.taskManager.otherSubTasks.push({
          name: "write " + serviceConfiguration.service + " config",
          otherRunRef: ref,
          status: false,
        });
        this.taskManager.finishedOtherTasks.push({ otherRunRef: ref });
        return reject(
          "Failed writing service configuration " +
          serviceConfiguration.id +
          ": " +
          SSHService.extractExecError(configStatus)
        );
      }
      this.taskManager.otherSubTasks.push({
        name: "write " + serviceConfiguration.service + " config",
        otherRunRef: ref,
        status: true,
      });
      this.taskManager.finishedOtherTasks.push({ otherRunRef: ref });
      return resolve();
    });
  }

  /**
   * list docker services
   */
  async listServices() {
    return new Promise(async (resolve, reject) => {
      let serviceJsons;
      try {
        serviceJsons = await this.sshService.exec("docker ps --format '{{json .}}' --no-trunc");
      } catch (err) {
        log.error("Can't list services: ", err);
        return reject("Can't list services: " + err);
      }

      if (SSHService.checkExecError(serviceJsons)) {
        return reject("Failed listing services: " + SSHService.extractExecError(serviceJsons));
      }

      return resolve(
        serviceJsons.stdout
          .split(/\n/)
          .slice(0, -1)
          .map((json) => {
            return JSON.parse(json);
          })
      );
    });
  }

  /**
   * get details of docker service
   *
   * @param serviceId either <docker-container-id> or <'stereum-' + stereum-service-id>
   */
  async getServiceDetails(serviceId) {
    return new Promise(async (resolve, reject) => {
      let serviceJson;
      try {
        serviceJson = await this.sshService.exec("docker inspect " + serviceId);
      } catch (err) {
        log.error("Can't get service details of '" + serviceId + "': ", err);
        return reject("Can't get service details of '" + serviceId + "': " + err);
      }

      if (SSHService.checkExecError(serviceJson)) {
        return reject(
          "Failed getting service details of '" + serviceId + "': " + SSHService.extractExecError(serviceJson)
        );
      }

      return resolve(JSON.parse(serviceJson.stdout));
    });
  }

  async getServiceLogs(serviceID) {
    return new Promise(async (resolve, reject) => {
      let logs;
      try {
        logs = await this.sshService.exec("docker logs --tail=100 stereum-" + serviceID);
      } catch (err) {
        log.error("Can't get service logs of '" + serviceID + "': ", err);
        return reject("Can't get service logs of '" + serviceID + "': " + err);
      }

      if (logs.stdout.length > 0) {
        return resolve(logs.stdout);
      }
      return resolve(logs.stderr);
    });
  }

  async destroyNode(serviceConfigs = []) {
    const ref = StringUtils.createRandomString();

    // FAKE2DEBUG: Set to true to fake destroy output for debugging purposes (IN YOUR LOCAL BRANCH ONLY!)
    const FAKE2DEBUG = false;
    if (FAKE2DEBUG) {
      this.taskManager.tasks.push({ name: "Task: Delete Node", otherRunRef: ref });
      await new Promise((resolve) => setTimeout(resolve, 1000)); // <- executed simulates operation

      var x = await new Promise((resolve) => setTimeout(resolve, 2000)); // <- executed simulates operation
      this.taskManager.otherSubTasks.push({ name: "SubTask: Step 1", otherRunRef: ref, status: !x });

      var y = await new Promise((resolve) => setTimeout(resolve, 2000)); // <- executed simulates operation
      this.taskManager.otherSubTasks.push({ name: "SubTask: Step 2", otherRunRef: ref, status: !y });

      var z = await new Promise((resolve) => setTimeout(resolve, 2000)); // <- executed simulates operation
      this.taskManager.otherSubTasks.push({ name: "SubTask: Step 3", otherRunRef: ref, status: !z });

      this.taskManager.finishedOtherTasks.push({ otherRunRef: ref });
      await this.logout();
      return "FAKE2DEBUG -> Node destroyed";
    }

    // Destroy
    this.taskManager.tasks.push({ name: "Delete Node", otherRunRef: ref });
    await this.nukeServiceValumes(serviceConfigs, ref);

    this.taskManager.otherSubTasks.push({
      name: "remove Docker-Container",
      otherRunRef: ref,
      status: !(await this.sshService.exec("docker rm -vf $(docker ps -aq)")).rc,
    });

    this.taskManager.otherSubTasks.push({
      name: "remove Docker-Images",
      otherRunRef: ref,
      status: !(await this.sshService.exec("docker rmi -f $(docker images -aq)")).rc,
    });

    this.taskManager.otherSubTasks.push({
      name: "clean up Docker-Volumes",
      otherRunRef: ref,
      status: !(await this.sshService.exec("docker volume prune -f")).rc,
    });

    this.taskManager.otherSubTasks.push({
      name: "clean up Docker-Networks",
      otherRunRef: ref,
      status: !(await this.sshService.exec("docker network prune -f")).rc,
    });

    this.taskManager.otherSubTasks.push({
      name: "clean up Docker",
      otherRunRef: ref,
      status: !(await this.sshService.exec("docker system prune -a -f")).rc,
    });

    if (this.settings) {
      this.taskManager.otherSubTasks.push({
        name: "remove Stereum Controls",
        otherRunRef: ref,
        status: !(await this.sshService.exec("rm -rf " + this.settings.stereum.settings.controls_install_path)).rc,
      });
    } else {
      this.taskManager.otherSubTasks.push({
        name: "remove Stereum Controls",
        otherRunRef: ref,
        status: true,
      });
    }

    this.taskManager.otherSubTasks.push({
      name: "remove Stereum Settings",
      otherRunRef: ref,
      status: !(await this.sshService.exec("rm -rf /etc/stereum")).rc,
    });

    this.taskManager.finishedOtherTasks.push({ otherRunRef: ref });
    await this.logout();
    return "Node destroyed";
  }

  async nukeServiceValumes(serviceConfigs, ref) {
    let sPaths = [];
    let sIDs = [];
    for (let service of serviceConfigs) {
      let sID = service.id;
      for (let path of service.volumes) {
        let sPath = path.destinationPath;
        if (sPath.includes(sID) && !sPath.includes(this.settings.stereum.settings.controls_install_path)) {
          sPaths.push(sPath.substring(0, sPath.indexOf(sID)) + sID + "/");
          sIDs.push(sID);
        }
      }
    }
    let sPathsSet = [...new Set(sPaths)];
    let sIDSet = [...new Set(sIDs)];
    let serviceNumber = 0;
    for (let sPathSet of sPathsSet) {
      this.taskManager.otherSubTasks.push({
        name: "remove " + sPathSet.replace("-" + sIDSet[serviceNumber], ""),
        otherRunRef: ref,
        status: !(await this.sshService.exec("rm -rf " + sPathSet)).rc,
      });
      serviceNumber++;
    }
  }

  async openTunnels(tunnels) {
    if (tunnels[0] !== undefined) {
      await Promise.all(
        tunnels.map(async (tunnel) => {
          await this.sshService.tunnel(tunnel);
        })
      );
    }
  }

  async closeTunnels(onlySpecificPorts = []) {
    try {
      await this.sshService.closeTunnels(onlySpecificPorts);
    } catch (err) {
      log.error(err);
    }
  }

  async checkPort(port) {
    return new Promise((resolve, reject) => {
      const connection = net.connect(port);
      connection.on("error", (error) => {
        if (error.code === "ECONNREFUSED") {
          return resolve(true);
        }
        return reject(error);
      });
      connection.on("connect", () => {
        connection.destroy();
        return resolve(false);
      });
    });
  }

  async checkAvailablePorts(option) {
    const ports = [];
    for (let i = 0; i < option.amount; i++) {
      let available = false;
      let port = option.min;
      while ((!available && port < option.max) || ports.includes(port)) {
        available = await this.checkPort(port);
        if (!available || ports.includes(port)) {
          available = false;
          port++;
        }
      }
      log.info(`Port ${port} is the next available in range ${option.min} - ${option.max}`);
      ports.push(port);
    }
    return ports;
  }

  async checkUpdates() {
    let response = await axios.get("https://stereum.net/downloads/updates.json");
    if (global.branch === "main") response.data.stereum.push({ name: "HEAD", commit: "main" });
    log.debug(response.data);
    return response.data;
  }

  async runAllUpdates(commit) {
    //stereum and service updates
    let before = 0;
    let after = 0;
    try {
      before = this.getTimeStamp();
      await this.updateStereum(commit);
      await this.updateServices();
      after = this.getTimeStamp();
    } catch (err) {
      log.error("Error occurred running all updates:\n", err);
      return 30;
    }
    if (after != 0 && before != 0) return after - before;
    return 30;
  }

  async updateServices(services) {
    try {
      let before = this.getTimeStamp();
      await this.runPlaybook("Update Services", {
        stereum_role: "update-services",
        services_to_update: services ? services : undefined,
      });
      let after = this.getTimeStamp();
      return after - before;
    } catch (err) {
      log.error("Error occurred running service updates:\n", err);
      return 0;
    }
  }

  async updateStereum(commit) {
    let extraVars = {
      stereum_role: "update-stereum",
      stereum_args: {
        override_gitcommit: commit ? commit : undefined,
      },
    };
    try {
      let before = this.getTimeStamp();
      await this.runPlaybook("Update Stereum", extraVars);
      await this.runPlaybook("Update Changes", { stereum_role: "update-changes" });
      let after = this.getTimeStamp();
      return after - before;
    } catch (err) {
      log.error("Error occurred running stereum updates:\n", err);
      return 0;
    }
  }

  getTimeStamp() {
    return Math.ceil(Date.now() / 1000);
  }

  async restartServices(seconds) {
    try {
      await this.runPlaybook("Restart Services", {
        stereum_role: "restart-services",
        restart_time_scope: seconds + 10,
      });
    } catch (err) {
      log.error("Error occurred during restarting services:\n", err);
    }
  }

  async getCurrentStereumVersion() {
    return new Promise(async (resolve, reject) => {
      let response;
      try {
        response = await this.sshService.exec(
          `cd ${this.settings.stereum.settings.controls_install_path}/ansible && git rev-parse HEAD`
        );
      } catch (err) {
        log.error("Couldn't get Stereum Version:", err);
        return reject("Couldn't get Stereum Version:\n" + err);
      }

      if (SSHService.checkExecError(response)) {
        return reject("Failed reading Stereum Version:\n" + SSHService.extractExecError(response));
      }
      return resolve(response.stdout);
    });
  }

  async getCurrentLauncherVersion() {
    const app = electron.app || electron.remote.app;
    return app ? app.getVersion() : "N/A";
  }

  async getLargestVolumePath() {
    return new Promise(async (resolve, reject) => {
      try {
        const dfOutput = await this.sshService.exec("df | grep -wv /var/lib/docker | tail -n +2 | sort -k 4 -rn | head -n 1");

        if (SSHService.checkExecError(dfOutput)) {
          return reject("Failed reading df command: " + SSHService.extractExecError(dfOutput));
        }

        const path = dfOutput.stdout.split(" ").pop().trim();

        return resolve(path);
      } catch (err) {
        log.error("Can't read df", err);
        return reject("Can't read df: " + err);
      }
    });
  }

  async setStereumSettings(settings) {
    let value = { stereum_settings: settings.stereum };
    return new Promise(async (resolve, reject) => {
      let result;
      const ref = StringUtils.createRandomString();
      this.taskManager.tasks.push({ name: "write config", otherRunRef: ref });
      try {
        result = await this.sshService.exec(
          "echo -e " + StringUtils.escapeStringForShell(YAML.stringify(value)) + " > /etc/stereum/stereum.yaml"
        );
      } catch (err) {
        this.taskManager.otherSubTasks.push({
          name: "write stereum config",
          otherRunRef: ref,
          status: false,
        });
        this.taskManager.finishedOtherTasks.push({ otherRunRef: ref });
        log.error("Can't write stereum config", err);
        return reject("Can't write stereum config: " + err);
      }

      if (SSHService.checkExecError(result)) {
        this.taskManager.otherSubTasks.push({
          name: "write stereum config",
          otherRunRef: ref,
          status: false,
        });
        this.taskManager.finishedOtherTasks.push({ otherRunRef: ref });
        return reject("Can't write stereum config: " + SSHService.extractExecError(result));
      }
      this.taskManager.otherSubTasks.push({
        name: "write stereum config",
        otherRunRef: ref,
        status: true,
      });
      this.taskManager.finishedOtherTasks.push({ otherRunRef: ref });
      try {
        await this.runPlaybook("configure-updates", {
          stereum_role: "configure-updates",
          stereum_args: settings.stereum.settings,
        });
      } catch (err) {
        log.error("foo", err);
        return reject("Can't run setup playbook: " + err);
      }

      return resolve(settings);
    });
  }

  async logout() {
    this.settings = undefined;
    await this.closeTunnels();
  }

  async restartServer() {
    let status = await this.sshService.exec("cat /var/run/reboot-required");
    if (status.rc == 0) {
      const ref = StringUtils.createRandomString();
      this.taskManager.otherTasksHandler(ref, "Restarting Server");
      await new Promise((resolve) => setTimeout(resolve, 10000));
      await this.sshService.exec("/sbin/shutdown -r now");
      this.taskManager.otherTasksHandler(ref, "trigger restart", true);
      const retry = { connected: false, counter: 0, maxTries: 300 };
      log.info("Connecting via SSH");
      while (!retry.connected) {
        try {
          await this.sshService.connect(this.nodeConnectionParams);
          retry.connected = true;
          this.taskManager.otherTasksHandler(ref, "Connected", true);
          log.info("Connected!");
        } catch (e) {
          if (++retry.counter == retry.maxTries) {
            this.taskManager.otherTasksHandler(ref, "Could not connect " + (retry.maxTries - retry.counter), false);
            this.taskManager.otherTasksHandler(ref);
            throw e;
          }
          this.taskManager.otherTasksHandler(
            ref,
            "Could not connect " + (retry.maxTries - retry.counter),
            true,
            e + "\n\n" + (retry.maxTries - retry.counter) + " tries left."
          );
          log.info(" Could not connect.\n" + (retry.maxTries - retry.counter) + " tries left.");
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
      }
      this.taskManager.otherTasksHandler(ref);
      return true;
    }
    return false;
  }
}
