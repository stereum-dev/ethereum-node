import { SSHService } from "./SSHService";
import { StringUtils } from "./StringUtils";
import { NodeConnectionParams } from "./NodeConnectionParams";
import { nodeOS } from "./NodeOS";
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

  async establish() {
    await this.sshService.connect(this.nodeConnectionParams);
  }

  /**
   * identify the operating system of the connected node
   */
  async findOS() {
    const uname = await this.sshService.exec("sudo cat /etc/*-release");
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
      "sudo cat /etc/stereum/stereum.yaml"
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

      log.debug("this.os: ", this.os);
      log.debug("nodeOS.ubuntu: ", nodeOS.ubuntu);
      if (this.os == nodeOS.centos) {
        return reject("not implemented yet");
      } else if (this.os == nodeOS.ubuntu) {
        log.debug("procede on ubuntu");
        let installPkgResult;
        try {
          installPkgResult = await this.sshService.exec(
            "sudo apt update &&\
                    sudo apt install -y software-properties-common &&\
                    sudo add-apt-repository --yes --update ppa:ansible/ansible &&\
                    sudo apt install -y pip ansible tar gzip wget"
          );
        } catch (err) {
          log.error(err);
          installPkgResult = { rc: 1, stderr: err };
        }
        if (SSHService.checkExecError(installPkgResult)) {
          return reject(
            "Can't install os packages: " +
              SSHService.extractExecError(installPkgResult)
          );
        }
      } else {
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
                sudo mkdir -p "` +
            this.installationDirectory +
            `/ansible" &&
                cd "` +
            this.installationDirectory +
            `/ansible" &&
                sudo git init &&
                sudo git remote add -f ethereum-node https://github.com/stereum-dev/ethereum-node.git &&
                sudo git config core.sparseCheckout true &&
                sudo echo 'controls' >> .git/info/sparse-checkout &&
                sudo git checkout ${branch}
                `
        );
      } catch (err) {
        log.error("can't install ansible roles", err);
        return reject("Can't install ansible roles: " + err);
      }

      if (SSHService.checkExecError(installResult)) {
        return reject(
          "Can't install ansible role: " +
            SSHService.extractExecError(installResult)
        );
      }

      /**
       * run stereum ansible playbook "setup"
       */
      log.info("run stereum ansible playbook 'setup'");
      let playbookRuns = [];
      try {
        playbookRuns.push(
          await this.runPlaybook("setup", { stereum_role: "setup" })
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
      try {
        ansibleResult = await this.sshService.exec(
          "sudo\
                        ANSIBLE_LOAD_CALLBACK_PLUGINS=1\
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
      log.info("playbook status of ref ", playbookRunRef);

      let statusResult;
      try {
        statusResult = await this.sshService.exec(
          "sudo cat /tmp/" + playbookRunRef + "/localhost"
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
        services = await this.sshService.exec(
          "sudo ls -1 /etc/stereum/services"
        );
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
          "sudo cat /etc/stereum/services/" + serviceId + suffix
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
      try {
        configStatus = await this.sshService.exec(
          "sudo echo -e " +
            StringUtils.escapeStringForShell(
              YAML.stringify(serviceConfiguration)
            ) +
            " > /etc/stereum/services/" +
            serviceConfiguration.id +
            ".yaml"
        );
      } catch (err) {
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
        return reject(
          "Failed writing service configuration " +
            serviceConfiguration.id +
            ": " +
            SSHService.extractExecError(configStatus)
        );
      }

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

  async destroyNode() {
    await this.sshService.exec("docker rm -vf $(docker ps -aq)");
    await this.sshService.exec("docker rmi -f $(docker images -aq)");
    await this.sshService.exec(`\
                docker volume prune -f &&\
                docker system prune -a -f &&\
                rm -rf ${this.settings.stereum.settings.controls_install_path} &&\
                rm -rf /etc/stereum`);
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
    const cpuUsage = await this.sshService.exec(
      `sar -u 1 1 | awk '{if ($7 != "%idle") print 100.000-$NF}' | tail -1`
    ); //CPU usage
    response.cpuUsage = cpuUsage;
    return response;
  }

  async getHostName() {
    let response = {};
    const hostname = await this.sshService.exec(`hostname`); //machine name
    response.hostname = hostname;
    return response;
  }

  async getEntireRam() {
    let response = {};
    const entireRam = await this.sshService.exec(
      `free -m | sed -n '2p' | awk '{print $2}'`
    ); //Entire Ram
    response.entireRam = entireRam;
    return response;
  }

  async getUsedRam() {
    let response = {};
    const usedRam = await this.sshService.exec(
      `free -m | sed -n '2p' | awk '{print $3}'`
    ); //Used Ram
    response.usedRam = usedRam;
    return response;
  }

  async getUsedStoragePer() {
    let response = {};
    const usedStoragePer = await this.sshService.exec(
      `df --total -m | tail -1 | awk '{print 100-$3/$2*100}'`
    ); //used storage per %
    response.usedStoragePer = usedStoragePer;
    return response;
  }

  async getEntireStorage() {
    let response = {};
    const entireStorage = await this.sshService.exec(
      `df --total -m | tail -1 | awk '{print $2}'`
    );//Entire storage
    response.entireStorage = entireStorage;
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
}
