import { SSHService } from "./SSHService";
import { StringUtils } from "./StringUtils";
import { NodeConnectionParams } from "./NodeConnectionParams";
import { nodeOS } from "./NodeOS";
import axios from "axios";
import net from "net";
import YAML from "yaml";
const log = require("electron-log");
if (process.env.IS_DEV === "true") {
  global.branch = "main";
  log.info("pulling from main branch");
} else {
  global.branch = "stable";
  log.info("pulling from stable branch");
}

export class NodeConnection {
  constructor(nodeConnectionParams) {
    this.sshService = new SSHService();
    this.nodeConnectionParams = nodeConnectionParams;
    this.os = null;
  }

  async establish(taskManager) {
    await this.sshService.connect(this.nodeConnectionParams);
    this.taskManager = taskManager;
  }

  /**
   * identify the operating system of the connected node
   */
  async findOS() {
    const uname = await this.sshService.exec("cat /etc/*-release");
    log.debug("result uname: ", uname);
    if (uname.rc == 0) {
      if (uname.stdout && uname.stdout.toLowerCase().search("centos") >= 0) {
        this.os = nodeOS.centos;
      } else if (
        uname.stdout &&
        uname.stdout.toLowerCase().search("ubuntu") >= 0
      ) {
        log.debug("setting ubuntu");
        this.os = nodeOS.ubuntu;
      }
    }
  }

  /**
   * read stereum settings and make them accessible
   */
  async findStereumSettings() {
    const stereumConfig = await this.sshService.exec(
      "cat /etc/stereum/stereum.yaml"
    );

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
                    apt install -y pip ansible tar gzip wget"
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
          });
          this.taskManager.finishedOtherTasks.push({ otherRunRef: ref });
          return reject(
            "Can't install os packages: " +
              SSHService.extractExecError(installPkgResult)
          );
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
      await this.sshService.exec(
        `rm -rf ${this.installationDirectory}/ansible`
      );
      /**
       * install stereum ansible playbooks & roles
       */
      log.info("installing stereum ansible roles");

      let installResult;
      try {
        installResult = await this.sshService.exec(
          `
                mkdir -p "` +
            this.installationDirectory +
            `/ansible" &&
                cd "` +
            this.installationDirectory +
            `/ansible" &&
                git init &&
                git remote add -f ethereum-node https://github.com/stereum-dev/ethereum-node.git &&
                git config core.sparseCheckout true &&
                echo 'controls' >> .git/info/sparse-checkout &&
                git checkout ${branch}
                `
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
        return reject(
          "Can't install ansible role: " +
            SSHService.extractExecError(installResult)
        );
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
        return reject(
          "Failed running '" +
            playbook +
            "': " +
            SSHService.extractExecError(ansibleResult)
        );
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
        statusResult = await this.sshService.exec(
          "cat /tmp/" + playbookRunRef + "/localhost"
        );
      } catch (err) {
        log.error("Can't read playbook status '" + playbookRunRef + "'", err);
        return reject(
          "Can't read playbook status '" + playbookRunRef + "': " + err
        );
      }

      if (SSHService.checkExecError(statusResult)) {
        return reject(
          "Failed reading status of ref '" +
            playbookRunRef +
            "': " +
            SSHService.extractExecError(statusResult)
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
        return reject(
          "Failed reading services configurations: " +
            SSHService.extractExecError(services)
        );
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
        serviceConfig = await this.sshService.exec(
          "cat /etc/stereum/services/" + serviceId + suffix
        );
      } catch (err) {
        log.error("Can't read service configuration of " + serviceId, err);
        return reject(
          "Can't read service configuration of " + serviceId + ": " + err
        );
      }

      if (SSHService.checkExecError(serviceConfig)) {
        return reject(
          "Failed reading service configuration " +
            serviceId +
            ": " +
            SSHService.extractExecError(serviceConfig)
        );
      }

      return resolve(YAML.parse(serviceConfig.stdout));
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
            StringUtils.escapeStringForShell(
              YAML.stringify(serviceConfiguration)
            ) +
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
        log.error(
          "Can't write service configuration of " + serviceConfiguration.id,
          err
        );
        return reject(
          "Can't write service configuration of " +
            serviceConfiguration.id +
            ": " +
            err
        );
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
        serviceJsons = await this.sshService.exec(
          "docker ps --format '{{json .}}' --no-trunc"
        );
      } catch (err) {
        log.error("Can't list services: ", err);
        return reject("Can't list services: " + err);
      }

      if (SSHService.checkExecError(serviceJsons)) {
        return reject(
          "Failed listing services: " +
            SSHService.extractExecError(serviceJsons)
        );
      }

      return resolve(
        serviceJsons.stdout
          .split(/\n/)
          .slice(0, -1)
          .map((json) => {
            log.debug("parsing json: ", json);
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
        return reject(
          "Can't get service details of '" + serviceId + "': " + err
        );
      }

      if (SSHService.checkExecError(serviceJson)) {
        return reject(
          "Failed getting service details of '" +
            serviceId +
            "': " +
            SSHService.extractExecError(serviceJson)
        );
      }

      return resolve(JSON.parse(serviceJson.stdout));
    });
  }
  
  async getServiceLogs(serviceID) {
    return new Promise(async (resolve,reject) => {
      let logs;
      try {
        logs = await this.sshService.exec("docker logs --tail=100 stereum-" + serviceID);
      } catch (err) {
        log.error("Can't get service logs of '" + serviceID + "': ", err);
        return reject(
          "Can't get service logs of '" + serviceID + "': " + err
        );
      }

      if(logs.stdout.length > 0){
        return resolve(logs.stdout);
      }
      return resolve(logs.stderr);

    })
  }

  async destroyNode() {
    const ref = StringUtils.createRandomString();
    this.taskManager.tasks.push({ name: "Delete Node", otherRunRef: ref });

    this.taskManager.otherSubTasks.push({
      name: "remove Docker-Container",
      otherRunRef: ref,
      status: !(await this.sshService.exec("docker rm -vf $(docker ps -aq)"))
        .rc,
    });

    this.taskManager.otherSubTasks.push({
      name: "remove Docker-Images",
      otherRunRef: ref,
      status: !(
        await this.sshService.exec("docker rmi -f $(docker images -aq)")
      ).rc,
    });

    this.taskManager.otherSubTasks.push({
      name: "clean up Docker-Volumes",
      otherRunRef: ref,
      status: !(await this.sshService.exec("docker volume prune -f")).rc,
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
        status: !(
          await this.sshService.exec(
            "rm -rf " + this.settings.stereum.settings.controls_install_path
          )
        ).rc,
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
    this.settings = undefined;
    return "Node destroyed";
  }

  // cpuUsage return values:
  // rc: 0 if everything went fine
  // stdout: console output normally CPU-Usage
  // stderr: console error output empty when rc is 0 else the occured error

  // use "import ControlService from '@/store/ControlService'"" in the file you need the data
  // you then can call it with "await ControlService.getServerVitals()"
  // use await or handle the promise with .then and .catch
  // the function needs to be async
  async getServerVitals() {
    let response = {};
    const serverVitals = await this.sshService.exec(`
    hostname &&
    free -m | sed -n '2p' | awk '{print $2" "$3}' &&
    df --total -m | tail -1 | awk '{print $5}' &&
    df --total -m | tail -1 | awk '{print $2" "$4}' &&
    sar -u 1 1 | awk '{if ($7 != "%idle") print 100.000-$NF}' | tail -1 &&
    sar -n DEV 1 1 | awk '{ if($2 == "eth0") print $5" "$6}' | sed -n '1p'
    `);

    response.serverVitals = serverVitals;
    return response;
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
      log.info(
        `Port ${port} is the next available in range ${option.min} - ${option.max}`
      );
      ports.push(port);
    }
    return ports;
  }

  async checkUpdates() {
    try{
      let response = await axios.get('https://stereum.net/downloads/updates.json')
      log.info(response)
      return response.data
    }catch(err){
      log.error("REST request failed:\n",err)
    }
  }

  async runAllUpdates() {
    const updateRunRef = StringUtils.createRandomString();
    this.taskManager.tasks.push({ name: "Update", updateRunRef: updateRunRef });
    const logs = await this.sshService.exec(
      `cd ${this.settings.stereum.settings.controls_install_path}/ansible/controls && ./unattended-update.sh`
    );
    this.taskManager.finishedUpdates.push({
      updateRunRef: updateRunRef,
      logs: logs,
    });
  }

  async updateServices(services) {
    try{
      await this.runPlaybook("Update Services", {
        stereum_role: 'update-services',
        services_to_update: services
      })
    }catch(err){
      log.error("Couldn't update services:\n",err)
    }
  }

  async updateStereum(commit) {
    let extraVars = {
      stereum_role: 'update-stereum',
      stereum_args: {
        override_gitcommit: commit ? commit : undefined
      }
    }
    try{
      await this.runPlaybook("Update Stereum", extraVars)
    }catch(err){
      log.error("Couldn't update Stereum:\n",err)
    }
  }

  async getCurrentStereumVersion(){
    return new Promise(async (resolve,reject) => {
      let response;
      try {
        response = await this.sshService.exec(`cd ${this.settings.stereum.settings.controls_install_path}/ansible && git rev-parse HEAD`)
      } catch (err) {
        log.error("Couldn't get Stereum Version:", err);
        return reject(
          "Couldn't get Stereum Version:\n" + err
        );
      }

      if (SSHService.checkExecError(response)) {
        return reject(
          "Failed reading Stereum Version:\n" +
            SSHService.extractExecError(response)
        );
      }
      return resolve(response.stdout)
    })

  }
}
