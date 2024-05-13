import { SSHService } from "./SSHService";
import { StringUtils } from "./StringUtils";
import { nodeOS } from "./NodeOS";
import { ServiceVolume } from "./ethereum-services/ServiceVolume";
import net from "net";
import YAML from "yaml";
import { NodeUpdates } from "./NodeUpdates";
const log = require("electron-log");
const electron = require("electron");
const Evilscan = require("evilscan");
const os = require("os");

async function Sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
    this.osv = null;
    this.nodeUpdates = new NodeUpdates(this);
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
    let osName = null;
    let osVersion = null;
    const uname = await this.sshService.exec("cat /etc/*-release", null, false);
    log.debug("result uname: ", uname);
    if (uname.rc == 0 && uname.stdout) {
      const regex = /VERSION_ID="([^"]+)"/;
      const match = uname.stdout.match(regex);
      const versionId = match ? match[1] : null;
      if (uname.stdout.toLowerCase().search("centos") >= 0) {
        log.debug(`setting centos, version ${versionId}`);
        osName = nodeOS.centos;
        osVersion = versionId;
      } else if (uname.stdout.toLowerCase().search("ubuntu") >= 0) {
        log.debug(`setting ubuntu, version ${versionId}`);
        osName = nodeOS.ubuntu;
        osVersion = versionId;
      }
    }
    this.os = osName;
    this.osv = osVersion;
    return { name: osName, version: osVersion };
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
      msg=$(sudo hostname 2>&1)
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
      throw new Error("not implemented yet");
    } else if (this.os == nodeOS.ubuntu) {
      log.debug("proceed on ubuntu");
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
            "This error might occur because of a missing interaction. Running this command manually may fix this problem: apt update && apt install -y software-properties-common && add-apt-repository --yes --update ppa:ansible/ansible && apt install -y pip ansible tar gzip wget git \n\n\nError: " +
            installPkgResult.stderr,
        });
        this.taskManager.finishedOtherTasks.push({ otherRunRef: ref });
        throw new Error("Can't install os packages: " + SSHService.extractExecError(installPkgResult));
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
      throw new Error("unsupported OS");
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
      versions = await this.nodeUpdates.checkUpdates();
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
      throw new Error("Can't install ansible roles: " + err);
    }

    if (SSHService.checkExecError(installResult)) {
      this.taskManager.otherSubTasks.push({
        name: "install ansible roles",
        otherRunRef: ref,
        status: false,
      });
      this.taskManager.finishedOtherTasks.push({ otherRunRef: ref });
      throw new Error("Can't install ansible role: " + SSHService.extractExecError(installResult));
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
      log.error("Can't run setup playbook: ", err);
      throw new Error("Can't run setup playbook: " + err);
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
      log.error("Can't run configure-firewall playbook: ", err);
      throw new Error("Can't run configure-firewall playbook: " + err);
    }

    return playbookRuns;
  }

  /**
   * start a playbook
   */
  async runPlaybook(playbook, extraVars) {
    if (!this.settings) {
      throw new Error("Settings not loaded! Run findStereumSettings() first.");
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
      throw new Error("Can't run playbook: " + err);
    }

    if (SSHService.checkExecError(ansibleResult)) {
      throw new Error("Failed running '" + playbook + "': " + SSHService.extractExecError(ansibleResult));
    }
    this.taskManager.finishedPlaybooks.push(playbookRunRef);
    return {
      playbook: playbook,
      playbookRunRef: playbookRunRef,
    };
  }

  /**
   * get the logs of a playbook started via runPlayboook(...)
   */
  async playbookStatus(playbookRunRef) {
    log.debug("playbook status of ref ", playbookRunRef);

    let statusResult;
    try {
      statusResult = await this.sshService.exec("cat /tmp/" + playbookRunRef + "/localhost");
    } catch (err) {
      log.error("Can't read playbook status '" + playbookRunRef + "'", err);
      throw new Error("Can't read playbook status '" + playbookRunRef + "': " + err);
    }

    if (SSHService.checkExecError(statusResult)) {
      throw new Error(
        "Failed reading status of ref '" + playbookRunRef + "': " + SSHService.extractExecError(statusResult)
      );
    }

    return statusResult.stdout;
  }

  /**
   * list services configurations
   */
  async listServicesConfigurations() {
    let services;
    try {
      services = await this.sshService.exec("ls -1 /etc/stereum/services 2>/dev/null");
    } catch (err) {
      log.error("Can't read services configurations", err);
      throw new Error("Can't read services configurations: " + err);
    }

    if (SSHService.checkExecError(services)) {
      throw new Error("Failed reading services configurations: " + SSHService.extractExecError(services));
    }

    return services.stdout.split("\n").filter((i) => i);
  }

  /**
   * read a specific service configuration
   */
  async readServiceConfiguration(serviceId) {
    let serviceConfig;
    try {
      const suffix = serviceId.endsWith(".yaml") ? "" : ".yaml";
      serviceConfig = await this.sshService.exec("cat /etc/stereum/services/" + serviceId + suffix);
    } catch (err) {
      log.error("Can't read service configuration of " + serviceId, err);
      throw new Error("Can't read service configuration of " + serviceId + ": " + err);
    }

    if (SSHService.checkExecError(serviceConfig)) {
      throw new Error(
        "Failed reading service configuration " + serviceId + ": " + SSHService.extractExecError(serviceConfig)
      );
    }

    return YAML.parse(serviceConfig.stdout);
  }

  /**
   * read a specific service configuration
   */
  async readServiceYAML(serviceId) {
    let serviceYAML;
    try {
      const suffix = serviceId.endsWith(".yaml") ? "" : ".yaml";
      serviceYAML = await this.sshService.exec("cat /etc/stereum/services/" + serviceId + suffix);
    } catch (err) {
      log.error("Can't read service yaml of " + serviceId, err);
      throw new Error("Can't read service yaml of " + serviceId + ": " + err);
    }

    if (SSHService.checkExecError(serviceYAML)) {
      throw new Error("Failed reading service yaml " + serviceId + ": " + SSHService.extractExecError(serviceYAML));
    }

    return serviceYAML.stdout;
  }

  // <-------- NEW SSVMODAL START --------->

  async forwardSSVCommand(args) {
    try {
      if (typeof this[args.command] === "function") {
        return await this[args.command].apply(this, args.arguments);
      } else {
        throw new Error(`Method ${args.command} does not exist`);
      }
    } catch (err) {
      log.error("Can't forward SSV command ", err);
      throw new Error("Can't forward SSV command: " + err);
    }
  }

  async getSSVLastBackedPublicKeyFilePath(serviceID, getSsvServiceCfg = null, getSsvNetworkCfg = null) {
    try {
      const getSSVNetworkConfig = getSsvNetworkCfg
        ? getSsvNetworkCfg
        : await this.getSSVNetworkConfig(serviceID, getSsvServiceCfg);
      const ssvNetworkConfigDir = getSSVNetworkConfig.ssvNetworkConfigDir;
      return ssvNetworkConfigDir + "/last_backed_public_key";
    } catch (err) {
      log.error("Can't get SSV last backed public key file path from service " + serviceID, err);
      throw new Error("Can't get SSV last backed public key file path from service " + serviceID + ": " + err);
    }
  }

  async setSSVLastBackedPublicKey(
    serviceID,
    strPublicKey,
    return_details = false,
    getSsvServiceCfg = null,
    getSsvNetworkCfg = null
  ) {
    try {
      const lastBackedPublicKeyFilePath = await this.getSSVLastBackedPublicKeyFilePath(
        serviceID,
        getSsvServiceCfg,
        getSsvNetworkCfg
      );
      const lastBackedPublicKeyFileData = strPublicKey.trim();
      const result = await this.sshService.exec(
        `echo -n "${lastBackedPublicKeyFileData}" > "${lastBackedPublicKeyFilePath}"`
      );
      if (SSHService.checkExecError(result, true)) {
        throw new Error(SSHService.extractExecError(result));
      }
      if (!return_details) return lastBackedPublicKeyFileData;
      return {
        lastBackedPublicKeyFilePath: lastBackedPublicKeyFilePath,
        lastBackedPublicKeyFileData: lastBackedPublicKeyFileData,
      };
    } catch (err) {
      log.error("Can't write SSV last backed public key for service " + serviceID, err);
      throw new Error("Can't write SSV last backed public key for for service " + serviceID + ": " + err);
    }
  }

  async getSSVLastBackedPublicKey(serviceID, return_details = false, getSsvServiceCfg = null, getSsvNetworkCfg = null) {
    try {
      const lastBackedPublicKeyFilePath = await this.getSSVLastBackedPublicKeyFilePath(
        serviceID,
        getSsvServiceCfg,
        getSsvNetworkCfg
      );
      let lastBackedPublicKeyFileContent = "";
      if (lastBackedPublicKeyFilePath) {
        let lastBackedPublicKeyFileRequest = await this.sshService.exec(
          `if [ -f "${lastBackedPublicKeyFilePath}" ]; then cat "${lastBackedPublicKeyFilePath}"; else echo ""; fi`
        );
        if (SSHService.checkExecError(lastBackedPublicKeyFileRequest, true)) {
          throw new Error(lastBackedPublicKeyFileRequest.stderr);
        } else {
          lastBackedPublicKeyFileContent = lastBackedPublicKeyFileRequest.stdout;
        }
      }
      if (!return_details) return lastBackedPublicKeyFileContent.trim();
      return {
        lastBackedPublicKeyFilePath: lastBackedPublicKeyFilePath,
        lastBackedPublicKeyFileData: lastBackedPublicKeyFileContent.trim(),
      };
    } catch (err) {
      log.error("Can't read SSV last backed public key from service " + serviceID, err);
      throw new Error("Can't read SSV last backed public key from service " + serviceID + ": " + err);
    }
  }

  async importSSVEncryptedKeys(serviceID, encrypted_ssv_private_key, password) {
    try {
      const totalConfig = await this.getSSVTotalConfig(serviceID);
      const user = totalConfig.ssvServiceConfig.user;
      const service_config_dir = totalConfig.ssvServiceConfigDir;
      const service_config_file = service_config_dir + "/" + totalConfig.serviceID + ".yaml";
      const network_config_dir = totalConfig.ssvNetworkConfigDir;
      const network_config_file = network_config_dir + "/config.yaml";
      const secrets_dir = totalConfig.ssvSecretsDir;
      const keystore_file = secrets_dir + "/encrypted_private_key.json";
      const password_file = secrets_dir + "/password";
      const keystore_file_cfg = "/" + secrets_dir.split("/").pop() + "/encrypted_private_key.json";
      const password_file_cfg = "/" + secrets_dir.split("/").pop() + "/password";
      const private_key = encrypted_ssv_private_key;

      // Check encrypted SSV private_key (keystore) and get public key
      if (!private_key) {
        throw new Error("Given encrypted SSV private_key (keystore) is invalid");
      }
      let private_key_data;
      try {
        private_key_data = JSON.parse(private_key);
      } catch (e) {
        throw new Error("Given encrypted SSV private_key (keystore) is invalid (not JSON format)");
      }
      // SSV generated keystore uses "pubKey" since v1.3.3, previously it was "publicKey"
      if (!private_key_data?.publicKey && !private_key_data?.pubKey) {
        throw new Error("Given encrypted SSV private_key (keystore) is invalid (no public key available)");
      }
      private_key_data.publicKey = private_key_data?.publicKey ? private_key_data.publicKey : private_key_data?.pubKey;
      const newPubKey = private_key_data.publicKey;

      // Add password_file and keystore_file to secrets dir
      const escapedPassword = StringUtils.escapeStringForShell(password);
      const escapedPrivateKey = StringUtils.escapeStringForShell(private_key);
      const keystore_password_write = await this.sshService.exec(`
        mkdir -p ${secrets_dir} &&
        echo ${escapedPassword} > ${password_file} &&
        chown ${user}:${user} ${password_file} &&
        chmod 0600 ${password_file} &&
        echo ${escapedPrivateKey} > ${keystore_file} &&
        chown ${user}:${user} ${keystore_file} &&
        chmod 0600 ${keystore_file}
      `);
      if (SSHService.checkExecError(keystore_password_write, true)) {
        throw new Error(SSHService.extractExecError(keystore_password_write));
      }

      // Write network config
      const network_config_read = await this.sshService.exec(`cat ${network_config_file}`);
      if (SSHService.checkExecError(network_config_read)) {
        throw new Error(SSHService.extractExecError(network_config_read));
      }
      let network_config_content = network_config_read.stdout;
      let replacementString = `KeyStore:\n  PrivateKeyFile: ${keystore_file_cfg}\n  PasswordFile: ${password_file_cfg}`;
      network_config_content = network_config_content.replace(/^\s*(PrivateKeyFile|PasswordFile).*/gm, "");
      network_config_content = network_config_content.replace(/^(KeyStore|OperatorPrivateKey).*/gm, replacementString);
      const escapedNetworkConfigFile = StringUtils.escapeStringForShell(network_config_content.trim());
      const network_config_write = await this.sshService.exec(`
        mkdir -p ${network_config_dir} &&
        echo ${escapedNetworkConfigFile} > ${network_config_file} &&
        chown ${user}:${user} ${network_config_file} &&
        chmod 0644 ${network_config_file}
      `);
      if (SSHService.checkExecError(network_config_write, true)) {
        throw new Error(SSHService.extractExecError(network_config_write));
      }

      // Remove sk/pk from service config (if exists)
      if (totalConfig.ssvServiceConfig?.ssv_pk || totalConfig.ssvServiceConfig?.ssv_sk) {
        const service_config_read = await this.sshService.exec(`cat ${service_config_file}`);
        if (SSHService.checkExecError(service_config_read)) {
          throw new Error(SSHService.extractExecError(service_config_read));
        }
        const escapedServiceConfigFile = StringUtils.escapeStringForShell(
          service_config_read.stdout
            .replace(/^(ssv_pk|ssv_sk|# BEGIN ANSIBLE MANAGED BLOCK|# END ANSIBLE MANAGED BLOCK).*/gm, "")
            .trim()
        );
        const service_config_write = await this.sshService.exec(`
          mkdir -p ${service_config_dir} &&
          echo ${escapedServiceConfigFile} > ${service_config_file} &&
          chown ${user}:${user} ${service_config_file} &&
          chmod 0644 ${service_config_file}
        `);
        if (SSHService.checkExecError(service_config_write, true)) {
          throw new Error(SSHService.extractExecError(service_config_write));
        }
      }

      // Set last backed public key
      await this.setSSVLastBackedPublicKey(totalConfig.serviceID, newPubKey);

      // Write last known public key file
      return await this.writeSSVLastKnownPublicKeyFile(
        totalConfig.serviceID,
        newPubKey,
        totalConfig.getSsvServiceConfig,
        totalConfig.getSsvNetworkConfig
      );
    } catch (err) {
      log.error("Can't import encrypted SSV keys for service " + serviceID, err);
      throw new Error("Can't import encrypted SSV keys for service " + serviceID + ": " + err);
    }
  }

  async importSSVUnencryptedKeys(serviceID, unencrypted_secret_key) {
    try {
      const totalConfig = await this.getSSVTotalConfig(serviceID);
      const user = totalConfig.ssvServiceConfig.user;
      const service_config_dir = totalConfig.ssvServiceConfigDir;
      const service_config_file = service_config_dir + "/" + totalConfig.serviceID + ".yaml";
      const network_config_dir = totalConfig.ssvNetworkConfigDir;
      const network_config_file = network_config_dir + "/config.yaml";
      const secrets_dir = totalConfig.ssvSecretsDir;
      const keystore_file = secrets_dir + "/encrypted_private_key.json";
      const password_file = secrets_dir + "/password";
      const private_key = unencrypted_secret_key;

      // Check (unencrypted) SSV secret key (private_key)
      if (!private_key) {
        throw new Error("Given unencrypted SSV secret key (private key) is invalid");
      }
      if (!StringUtils.isBase64(private_key)) {
        throw new Error("Given unencrypted SSV secret key (private key) is invalid (not base 64 encoded)");
      }
      if (!StringUtils.isValidRsaPrivateKey(StringUtils.base64decode(private_key))) {
        throw new Error("Given unencrypted SSV secret key is no valid RSA private key");
      }

      // Get new public key from secret key (private_key)
      const newPubKey = StringUtils.getSSVPublicKeyFromSecretKey(private_key);

      // Remove password file and keystore_file from secrets dir

      const clean_secrets_dir = await this.sshService.exec(`
        rm -f "${password_file}" &>/dev/null ;
        rm -f "${keystore_file}" &>/dev/null
      `);
      if (SSHService.checkExecError(clean_secrets_dir, true)) {
        throw new Error(SSHService.extractExecError(clean_secrets_dir));
      }

      // Write network config
      const network_config_read = await this.sshService.exec(`cat ${network_config_file}`);
      if (SSHService.checkExecError(network_config_read)) {
        throw new Error(SSHService.extractExecError(network_config_read));
      }
      let network_config_content = network_config_read.stdout;
      let replacementString = `OperatorPrivateKey: ${unencrypted_secret_key}`;
      network_config_content = network_config_content.replace(/^(KeyStore|OperatorPrivateKey).*/gm, replacementString);
      network_config_content = network_config_content.replace(/^\s*(PrivateKeyFile|PasswordFile).*/gm, "");
      const escapedNetworkConfigFile = StringUtils.escapeStringForShell(network_config_content.trim());
      const network_config_write = await this.sshService.exec(`
        mkdir -p ${network_config_dir} &&
        echo ${escapedNetworkConfigFile} > ${network_config_file} &&
        chown ${user}:${user} ${network_config_file} &&
        chmod 0644 ${network_config_file}
      `);
      if (SSHService.checkExecError(network_config_write, true)) {
        throw new Error(SSHService.extractExecError(network_config_write));
      }

      // Remove sk/pk from service config (if exists) and add new sk/pk to service config
      const service_config_read = await this.sshService.exec(`cat ${service_config_file}`);
      if (SSHService.checkExecError(service_config_read)) {
        throw new Error(SSHService.extractExecError(service_config_read));
      }
      let service_config_content = service_config_read.stdout;
      if (totalConfig.ssvServiceConfig?.ssv_pk || totalConfig.ssvServiceConfig?.ssv_sk) {
        service_config_content = service_config_content.replace(
          /^(ssv_pk|ssv_sk|# BEGIN ANSIBLE MANAGED BLOCK|# END ANSIBLE MANAGED BLOCK).*/gm,
          ""
        );
      }
      service_config_content = service_config_content.trim();
      service_config_content += `\n\n`;
      service_config_content += `# BEGIN ANSIBLE MANAGED BLOCK\n`;
      service_config_content += `ssv_pk: "${newPubKey}"\n`;
      service_config_content += `ssv_sk: "${private_key}"\n`;
      service_config_content += `# END ANSIBLE MANAGED BLOCK\n`;
      const escapedServiceConfigFile = StringUtils.escapeStringForShell(service_config_content.trim());
      const service_config_write = await this.sshService.exec(`
        mkdir -p ${service_config_dir} &&
        echo ${escapedServiceConfigFile} > ${service_config_file} &&
        chown ${user}:${user} ${service_config_file} &&
        chmod 0644 ${service_config_file}
      `);
      if (SSHService.checkExecError(service_config_write, true)) {
        throw new Error(SSHService.extractExecError(service_config_write));
      }

      // Set last backed public key
      await this.setSSVLastBackedPublicKey(totalConfig.serviceID, newPubKey);

      // Write last known public key file
      return await this.writeSSVLastKnownPublicKeyFile(
        totalConfig.serviceID,
        newPubKey,
        totalConfig.getSsvServiceConfig,
        totalConfig.getSsvNetworkConfig
      );
    } catch (err) {
      log.error("Can't import unencrypted SSV keys for service " + serviceID, err);
      throw new Error("Can't import unencrypted SSV keys for service " + serviceID + ": " + err);
    }
  }

  async migrateToSSVEncryptedKeys(serviceID, password, unencrypted_secret_key = null) {
    try {
      const totalConfig = await this.getSSVTotalConfig(serviceID);
      const docker_image = totalConfig.ssvServiceConfig.image;
      const user = totalConfig.ssvServiceConfig.user;
      const service_config_dir = totalConfig.ssvServiceConfigDir;
      const service_config_file = service_config_dir + "/" + totalConfig.serviceID + ".yaml";
      const network_config_dir = totalConfig.ssvNetworkConfigDir;
      const network_config_file = network_config_dir + "/config.yaml";
      const secrets_dir = totalConfig.ssvSecretsDir;
      const keystore_file = secrets_dir + "/encrypted_private_key.json";
      const password_file = secrets_dir + "/password";
      const private_key = unencrypted_secret_key ? unencrypted_secret_key : totalConfig.deprecatedSecretKey;
      const private_key_file = secrets_dir + "/private-key";
      const keystore_file_cfg = "/" + secrets_dir.split("/").pop() + "/encrypted_private_key.json";
      const password_file_cfg = "/" + secrets_dir.split("/").pop() + "/password";

      // Check (unencrypted) SSV secret key (private_key)
      if (!private_key) {
        throw new Error(
          "Unencrypted SSV secret key (private key) is invalid (neither given as argument nor found on the server)"
        );
      }
      if (!StringUtils.isBase64(private_key)) {
        throw new Error("Unencrypted SSV secret key (private key) is invalid (not base 64 encoded)");
      }
      if (!StringUtils.isValidRsaPrivateKey(StringUtils.base64decode(private_key))) {
        throw new Error("Unencrypted SSV secret key is no valid RSA private key");
      }

      // Create secrets dir, password file and private_key_file
      const escapedPassword = StringUtils.escapeStringForShell(password);
      const escapedPrivateKey = StringUtils.escapeStringForShell(private_key);
      const password_write = await this.sshService.exec(`
        mkdir -p ${secrets_dir} &&
        chown ${user}:${user} ${secrets_dir} &&
        chmod 0755 ${secrets_dir} &&
        echo ${escapedPassword} > ${password_file} &&
        chown ${user}:${user} ${password_file} &&
        chmod 0600 ${password_file} &&
        echo ${escapedPrivateKey} > ${private_key_file} &&
        chown ${user}:${user} ${private_key_file} &&
        chmod 0600 ${private_key_file}
      `);
      if (SSHService.checkExecError(password_write, true)) {
        throw new Error(SSHService.extractExecError(password_write));
      }

      // Create keystore from unencrypted secret key
      // Without "-it" https://stackoverflow.com/a/43099210
      const keystore_write = await this.sshService.exec(`
        docker run --name ssv-node-key-generation -v '${password_file}':/password -v '${private_key_file}':/private-key '${docker_image}' /go/bin/ssvnode generate-operator-keys --password-file=/password  --operator-key-file=/private-key &&
        docker cp ssv-node-key-generation:/encrypted_private_key.json '${keystore_file}' &&
        docker rm ssv-node-key-generation &&
        rm '${private_key_file}' &&
        chown ${user}:${user} ${keystore_file} &&
        chmod 0600 ${keystore_file}
      `);
      if (SSHService.checkExecError(keystore_write)) {
        throw new Error(SSHService.extractExecError(keystore_write));
      }

      // Get new public key from keystore
      const keystore_read = await this.sshService.exec(`cat ${keystore_file}`);
      if (SSHService.checkExecError(keystore_read)) {
        throw new Error(SSHService.extractExecError(keystore_read));
      }
      const keystore_content = keystore_read.stdout;
      const keystore_data = JSON.parse(keystore_content);
      keystore_data.publicKey = keystore_data?.publicKey ? keystore_data.publicKey : keystore_data?.pubKey;
      const newPubKey = keystore_data.publicKey;

      // Write network config
      const network_config_read = await this.sshService.exec(`cat ${network_config_file}`);
      if (SSHService.checkExecError(network_config_read)) {
        throw new Error(SSHService.extractExecError(network_config_read));
      }
      const network_config_content = network_config_read.stdout;
      let replacementString = `KeyStore:\n  PrivateKeyFile: ${keystore_file_cfg}\n  PasswordFile: ${password_file_cfg}`;
      const escapedNetworkConfigFile = StringUtils.escapeStringForShell(
        network_config_content.replace(/^OperatorPrivateKey.*/gm, replacementString).trim()
      );
      const network_config_write = await this.sshService.exec(`
        mkdir -p ${network_config_dir} &&
        echo ${escapedNetworkConfigFile} > ${network_config_file} &&
        chown ${user}:${user} ${network_config_file} &&
        chmod 0644 ${network_config_file}
      `);
      if (SSHService.checkExecError(network_config_write, true)) {
        throw new Error(SSHService.extractExecError(network_config_write));
      }

      // Remove sk/pk from service config (if exists)
      if (totalConfig.ssvServiceConfig?.ssv_pk || totalConfig.ssvServiceConfig?.ssv_sk) {
        const service_config_read = await this.sshService.exec(`cat ${service_config_file}`);
        if (SSHService.checkExecError(service_config_read)) {
          throw new Error(SSHService.extractExecError(service_config_read));
        }
        const service_config_content = service_config_read.stdout;
        const escapedServiceConfigFile = StringUtils.escapeStringForShell(
          service_config_content
            .replace(/^(ssv_pk|ssv_sk|# BEGIN ANSIBLE MANAGED BLOCK|# END ANSIBLE MANAGED BLOCK).*/gm, "")
            .trim()
        );
        const service_config_write = await this.sshService.exec(
          `mkdir -p ${service_config_dir} && echo ${escapedServiceConfigFile} > ${service_config_file} &&
           chown ${user}:${user} ${service_config_file} &&
           chmod 0644 ${service_config_file}`
        );
        if (SSHService.checkExecError(service_config_write, true)) {
          throw new Error(SSHService.extractExecError(service_config_write));
        }
      }

      // Write last known public key file
      return await this.writeSSVLastKnownPublicKeyFile(
        totalConfig.serviceID,
        newPubKey,
        totalConfig.getSsvServiceConfig,
        totalConfig.getSsvNetworkConfig
      );
    } catch (err) {
      log.error("Can't migrate unencrypted keys to SSV encrypted keys for service " + serviceID, err);
      throw new Error("Can't migrate unencrypted keys to SSV encrypted keys for service " + serviceID + ": " + err);
    }
  }

  async createSSVEncryptedKeys(serviceID, password) {
    try {
      const totalConfig = await this.getSSVTotalConfig(serviceID);
      const docker_image = totalConfig.ssvServiceConfig.image;
      const user = totalConfig.ssvServiceConfig.user;
      const service_config_dir = totalConfig.ssvServiceConfigDir;
      const service_config_file = service_config_dir + "/" + totalConfig.serviceID + ".yaml";
      const network_config_dir = totalConfig.ssvNetworkConfigDir;
      const network_config_file = network_config_dir + "/config.yaml";
      const secrets_dir = totalConfig.ssvSecretsDir;
      const keystore_file = secrets_dir + "/encrypted_private_key.json";
      const password_file = secrets_dir + "/password";
      const keystore_file_cfg = "/" + secrets_dir.split("/").pop() + "/encrypted_private_key.json";
      const password_file_cfg = "/" + secrets_dir.split("/").pop() + "/password";

      // Create secrets dir and password file
      const escapedPassword = StringUtils.escapeStringForShell(password);
      const password_write = await this.sshService.exec(`
        mkdir -p ${secrets_dir} &&
        chown ${user}:${user} ${secrets_dir} &&
        chmod 0755 ${secrets_dir} &&
        echo ${escapedPassword} > ${password_file} &&
        chown ${user}:${user} ${password_file} &&
        chmod 0600 ${password_file}
      `);
      if (SSHService.checkExecError(password_write, true)) {
        throw new Error(SSHService.extractExecError(password_write));
      }

      // Create keystore
      const keystore_write = await this.sshService.exec(`
        docker run -d --name=ssv_node_op_key -v '${password_file}':/password -it '${docker_image}' /go/bin/ssvnode generate-operator-keys --password-file=/password &&
        docker logs ssv_node_op_key --follow &&
        docker cp ssv_node_op_key:/encrypted_private_key.json ${keystore_file} &&
        docker stop ssv_node_op_key &&
        docker rm ssv_node_op_key
      `);
      if (SSHService.checkExecError(keystore_write)) {
        throw new Error(SSHService.extractExecError(keystore_write));
      }

      // Get new public key from keystore
      const keystore_read = await this.sshService.exec(`cat ${keystore_file}`);
      if (SSHService.checkExecError(keystore_read)) {
        throw new Error(SSHService.extractExecError(keystore_read));
      }
      const keystore_content = keystore_read.stdout;
      const keystore_data = JSON.parse(keystore_content);
      keystore_data.publicKey = keystore_data?.publicKey ? keystore_data.publicKey : keystore_data?.pubKey;
      const newPubKey = keystore_data.publicKey;

      // Write network config
      const network_config_read = await this.sshService.exec(`cat ${network_config_file}`);
      if (SSHService.checkExecError(network_config_read)) {
        throw new Error(SSHService.extractExecError(network_config_read));
      }
      let network_config_content = network_config_read.stdout;
      let replacementString = `KeyStore:\n  PrivateKeyFile: ${keystore_file_cfg}\n  PasswordFile: ${password_file_cfg}`;
      network_config_content = network_config_content.replace(/^\s*(PrivateKeyFile|PasswordFile).*/gm, "");
      network_config_content = network_config_content.replace(/^(KeyStore|OperatorPrivateKey).*/gm, replacementString);
      const escapedNetworkConfigFile = StringUtils.escapeStringForShell(network_config_content.trim());
      const network_config_write = await this.sshService.exec(`
        mkdir -p ${network_config_dir} &&
        echo ${escapedNetworkConfigFile} > ${network_config_file} &&
        chown ${user}:${user} ${network_config_file} &&
        chmod 0644 ${network_config_file}
      `);
      if (SSHService.checkExecError(network_config_write, true)) {
        throw new Error(SSHService.extractExecError(network_config_write));
      }

      // Remove sk/pk from service config (if exists)
      if (totalConfig.ssvServiceConfig?.ssv_pk || totalConfig.ssvServiceConfig?.ssv_sk) {
        const service_config_read = await this.sshService.exec(`cat ${service_config_file}`);
        if (SSHService.checkExecError(service_config_read)) {
          throw new Error(SSHService.extractExecError(service_config_read));
        }
        const escapedServiceConfigFile = StringUtils.escapeStringForShell(
          service_config_read.stdout
            .replace(/^(ssv_pk|ssv_sk|# BEGIN ANSIBLE MANAGED BLOCK|# END ANSIBLE MANAGED BLOCK).*/gm, "")
            .trim()
        );
        const service_config_write = await this.sshService.exec(`
          mkdir -p ${service_config_dir} &&
          echo ${escapedServiceConfigFile} > ${service_config_file} &&
          chown ${user}:${user} ${service_config_file} &&
          chmod 0644 ${service_config_file}
        `);
        if (SSHService.checkExecError(service_config_write, true)) {
          throw new Error(SSHService.extractExecError(service_config_write));
        }
      }

      // Write last known public key file
      return await this.writeSSVLastKnownPublicKeyFile(
        serviceID,
        newPubKey,
        totalConfig.getSsvServiceConfig,
        totalConfig.getSsvNetworkConfig
      );
    } catch (err) {
      log.error("Can't create SSV encrypted keys for service " + serviceID, err);
      throw new Error("Can't create SSV encrypted keys for service " + serviceID + ": " + err);
    }
  }

  // <-------- NEW SSVMODAL CONFIG STUFF --------->

  async getSSVServiceConfig(serviceID) {
    try {
      const ssvServiceConfig = await this.readServiceConfiguration(serviceID);
      return {
        ssvServiceConfig: ssvServiceConfig,
        ssvServiceConfigDir: "/etc/stereum/services",
      };
    } catch (err) {
      log.error("Can't read SSV service config from service " + serviceID, err);
      throw new Error("Can't read SSV service config from service " + serviceID + ": " + err);
    }
  }

  async getSSVNetworkConfig(serviceID, getSsvServiceCfg = null) {
    try {
      const getSsvServiceConfig = getSsvServiceCfg ? getSsvServiceCfg : await this.getSSVServiceConfig(serviceID);
      const ssvServiceConfig = getSsvServiceConfig.ssvServiceConfig;
      const ssvServiceConfigDir = getSsvServiceConfig.ssvServiceConfigDir;
      let ssvNetworkConfigDir = ".";
      try {
        ssvNetworkConfigDir = ServiceVolume.buildByConfig(
          ssvServiceConfig.volumes.find((v) => v.split(":").slice(-1) == "/data")
        ).destinationPath;
        if (ssvNetworkConfigDir.endsWith("/")) ssvNetworkConfigDir = ssvNetworkConfigDir.slice(0, -1, ""); //if path ends with '/' remove it
      } catch (e) {}
      const ssvNetworkConfigContent = await this.sshService.exec(`cat ${ssvNetworkConfigDir}/config.yaml`);
      if (SSHService.checkExecError(ssvNetworkConfigContent)) {
        throw new Error(SSHService.extractExecError(ssvNetworkConfigContent));
      }
      const ssvNetworkConfig = YAML.parse(ssvNetworkConfigContent.stdout);
      return {
        getSsvServiceConfig: getSsvServiceConfig,
        ssvServiceConfig: ssvServiceConfig,
        ssvNetworkConfig: ssvNetworkConfig,
        ssvServiceConfigDir: ssvServiceConfigDir,
        ssvNetworkConfigDir: ssvNetworkConfigDir,
      };
    } catch (err) {
      log.error("Can't read SSV network config from service " + serviceID, err);
      throw new Error("Can't read SSV network config from service " + serviceID + ": " + err);
    }
  }

  async getSSVLastKnownPublicKeyFilePath(serviceID, getSsvServiceCfg = null, getSsvNetworkCfg = null) {
    try {
      const getSSVNetworkConfig = getSsvNetworkCfg
        ? getSsvNetworkCfg
        : await this.getSSVNetworkConfig(serviceID, getSsvServiceCfg);
      const ssvNetworkConfigDir = getSSVNetworkConfig.ssvNetworkConfigDir;
      return ssvNetworkConfigDir + "/last_known_public_key";
    } catch (err) {
      log.error("Can't get SSV last known public key file path from service " + serviceID, err);
      throw new Error("Can't get SSV last known public key file path from service " + serviceID + ": " + err);
    }
  }

  async writeSSVLastKnownPublicKeyFile(serviceID, strPublicKey, getSsvServiceCfg = null, getSsvNetworkCfg = null) {
    try {
      const lastKnownPublicKeyFilePath = await this.getSSVLastKnownPublicKeyFilePath(
        serviceID,
        getSsvServiceCfg,
        getSsvNetworkCfg
      );
      const lastKnownPublicKeyFileData = strPublicKey.trim();
      const result = await this.sshService.exec(
        `echo -n "${lastKnownPublicKeyFileData}" > "${lastKnownPublicKeyFilePath}"`
      );
      if (SSHService.checkExecError(result, true)) {
        throw new Error(SSHService.extractExecError(result));
      }
      return {
        lastKnownPublicKeyFilePath: lastKnownPublicKeyFilePath,
        lastKnownPublicKeyFileData: lastKnownPublicKeyFileData,
      };
    } catch (err) {
      log.error("Can't write SSV last known public key file for service " + serviceID, err);
      throw new Error("Can't write SSV last known public key for for service " + serviceID + ": " + err);
    }
  }

  async getSSVLastKnownPublicKeyFile(serviceID, getSsvServiceCfg = null, getSsvNetworkCfg = null) {
    try {
      const lastKnownPublicKeyFilePath = await this.getSSVLastKnownPublicKeyFilePath(
        serviceID,
        getSsvServiceCfg,
        getSsvNetworkCfg
      );
      let lastKnownPublicKeyFileContent = "";
      if (lastKnownPublicKeyFilePath) {
        let lastKnownPublicKeyFileRequest = await this.sshService.exec(
          `if [ -f "${lastKnownPublicKeyFilePath}" ]; then cat "${lastKnownPublicKeyFilePath}"; else echo ""; fi`
        );
        if (SSHService.checkExecError(lastKnownPublicKeyFileRequest, true)) {
          throw new Error(lastKnownPublicKeyFileRequest.stderr);
        } else {
          lastKnownPublicKeyFileContent = lastKnownPublicKeyFileRequest.stdout;
        }
      }
      return {
        lastKnownPublicKeyFilePath: lastKnownPublicKeyFilePath,
        lastKnownPublicKeyFileData: lastKnownPublicKeyFileContent.trim(),
      };
    } catch (err) {
      log.error("Can't read SSV last known public key file from service " + serviceID, err);
      throw new Error("Can't read SSV last known public key file from service " + serviceID + ": " + err);
    }
  }

  async getSSVTotalConfig(serviceID, getSsvServiceCfg = null, getSsvNetworkCfg = null) {
    try {
      const getSsvNetworkConfig = getSsvNetworkCfg
        ? getSsvNetworkCfg
        : await this.getSSVNetworkConfig(serviceID, getSsvServiceCfg);
      const getSsvServiceConfig = getSsvNetworkConfig.getSsvServiceConfig;
      const ssvServiceConfig = getSsvNetworkConfig.ssvServiceConfig;
      const ssvServiceConfigDir = getSsvNetworkConfig.ssvServiceConfigDir;
      const ssvNetworkConfig = getSsvNetworkConfig.ssvNetworkConfig;
      const ssvNetworkConfigDir = getSsvNetworkConfig.ssvNetworkConfigDir;

      let ssvSecretsDir = ssvNetworkConfigDir; // ssvSecretsDir does not exist on old configurations, fallback to ssvNetworkConfigDir in such case
      let ssvSecretsDirFallback = true; // expect fallback by default
      try {
        ssvSecretsDir = ServiceVolume.buildByConfig(
          ssvServiceConfig.volumes.find((v) => v.split(":").slice(-1) == "/secrets")
        ).destinationPath;
        if (ssvSecretsDir.endsWith("/")) ssvSecretsDir = ssvSecretsDir.slice(0, -1, ""); //if path ends with '/' remove it
        ssvSecretsDirFallback = false; // secrets dir exists (created by ansible; no fallback)
      } catch (e) {}

      const regexC = /^(?:\.\/|\/?)data\//; // string starts with "./data/" or "data/" or "/data/"
      const regexS = /^(?:\.\/|\/?)secrets\//; // string starts with "./secrets/" or "secrets/" or "/secrets/"
      let keyStorePasswordFile = ssvNetworkConfig?.KeyStore?.PasswordFile ? ssvNetworkConfig.KeyStore.PasswordFile : "";
      if (regexC.test(keyStorePasswordFile)) {
        keyStorePasswordFile = ssvNetworkConfigDir + "/" + keyStorePasswordFile.replace(regexC, ""); // password file found in config dir
      } else if (regexS.test(keyStorePasswordFile)) {
        keyStorePasswordFile = ssvSecretsDir + "/" + keyStorePasswordFile.replace(regexS, ""); // password file found in secrets dir
      }
      let keyStorePrivateKeyFile = ssvNetworkConfig?.KeyStore?.PrivateKeyFile
        ? ssvNetworkConfig.KeyStore.PrivateKeyFile
        : "";
      if (regexC.test(keyStorePrivateKeyFile)) {
        keyStorePrivateKeyFile = ssvNetworkConfigDir + "/" + keyStorePrivateKeyFile.replace(regexC, ""); // keystore file found in config dir
      } else if (regexS.test(keyStorePrivateKeyFile)) {
        keyStorePrivateKeyFile = ssvSecretsDir + "/" + keyStorePrivateKeyFile.replace(regexS, ""); // keystore file found in secrets dir
      }

      let keyStorePasswordFileContent = "";
      if (keyStorePasswordFile) {
        let keyStorePasswordFileRequest = await this.sshService.exec(
          `if [ -f "${keyStorePasswordFile}" ]; then cat "${keyStorePasswordFile}"; else echo ""; fi`
        );
        if (SSHService.checkExecError(keyStorePasswordFileRequest, true)) {
          log.error(
            "Can't read SSV keystore password file content from service " + serviceID,
            keyStorePasswordFileRequest.stderr
          );
        } else {
          keyStorePasswordFileContent = keyStorePasswordFileRequest.stdout;
        }
      }

      let keyStorePrivateKeyFileContent = "";
      if (keyStorePrivateKeyFile) {
        let keyStorePrivateKeyFileRequest = await this.sshService.exec(
          `if [ -f "${keyStorePrivateKeyFile}" ]; then cat "${keyStorePrivateKeyFile}"; else echo ""; fi`
        );
        if (SSHService.checkExecError(keyStorePrivateKeyFileRequest, true)) {
          log.error(
            "Can't read SSV keystore private key file content from service " + serviceID,
            keyStorePrivateKeyFileRequest.stderr
          );
        } else {
          keyStorePrivateKeyFileContent = keyStorePrivateKeyFileRequest.stdout;
        }
      }

      let operatorPrivateKey = ssvNetworkConfig?.OperatorPrivateKey ? ssvNetworkConfig.OperatorPrivateKey : "";

      // Last known public key that was generated or imported by the end-user via ssv modal generate/import buttons
      const getSSVLastKnownPublicKeyFile = await this.getSSVLastKnownPublicKeyFile(
        serviceID,
        getSsvServiceConfig,
        getSsvNetworkConfig
      );
      const lastKnownPublicKeyFilePath = getSSVLastKnownPublicKeyFile.lastKnownPublicKeyFilePath;
      const lastKnownPublicKeyFileData = getSSVLastKnownPublicKeyFile.lastKnownPublicKeyFileData;

      return {
        serviceID: serviceID,
        getSsvServiceConfig: getSsvServiceConfig,
        getSsvNetworkConfig: getSsvNetworkConfig,
        ssvServiceConfig: ssvServiceConfig,
        ssvNetworkConfig: ssvNetworkConfig,
        ssvServiceConfigDir: ssvServiceConfigDir,
        ssvNetworkConfigDir: ssvNetworkConfigDir,
        ssvSecretsDir: ssvSecretsDir,
        ssvSecretsDirFallback: ssvSecretsDirFallback,
        deprecatedPublicKey: ssvServiceConfig?.ssv_pk ? ssvServiceConfig.ssv_pk : null,
        deprecatedSecretKey: ssvServiceConfig?.ssv_sk ? ssvServiceConfig.ssv_sk : null,
        deprecatedOperatorPrivateKey: operatorPrivateKey, // normally same as deprecatedSecretKey but tells us that the config var exists
        lastKnownPublicKeyFilePath: lastKnownPublicKeyFilePath,
        lastKnownPublicKeyFileData: lastKnownPublicKeyFileData,
        passwordFilePath: keyStorePasswordFile,
        passwordFileData: keyStorePasswordFileContent.trim(),
        privateKeyFilePath: keyStorePrivateKeyFile,
        privateKeyFileData: (() => {
          try {
            let pkfdata = JSON.parse(keyStorePrivateKeyFileContent);
            pkfdata.publicKey = pkfdata?.publicKey ? pkfdata.publicKey : pkfdata?.pubKey;
            return pkfdata;
          } catch (e) {
            return keyStorePrivateKeyFileContent;
          }
        })(),
      };
    } catch (err) {
      log.error("Can't read SSV total config from service " + serviceID, err);
      throw new Error("Can't read SSV total config from service " + serviceID + ": " + err);
    }
  }
  // <-------- NEW SSVMODAL END --------->

  async readSSVNetworkConfig(serviceID) {
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
      throw new Error("Can't read SSV config " + serviceID + ": " + err);
    }

    if (SSHService.checkExecError(SSVNetworkConfig)) {
      throw new Error("Failed reading SSV config " + serviceID + ": " + SSHService.extractExecError(SSVNetworkConfig));
    }

    return SSVNetworkConfig.stdout;
  }

  async writeSSVNetworkConfig(serviceID, config) {
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
      throw new Error("Can't write SSV config: " + err);
    }

    if (SSHService.checkExecError(configStatus)) {
      this.taskManager.otherSubTasks.push({
        name: "write SSV config yaml",
        otherRunRef: ref,
        status: false,
      });
      this.taskManager.finishedOtherTasks.push({ otherRunRef: ref });
      throw new Error("Can't write SSV config: " + SSHService.extractExecError(configStatus));
    }
    this.taskManager.otherSubTasks.push({
      name: "write SSV config yaml",
      otherRunRef: ref,
      status: true,
    });
    this.taskManager.finishedOtherTasks.push({ otherRunRef: ref });
    return;
  }

  async readPrometheusConfig(serviceID) {
    let prometheusConfig;
    try {
      const service = await this.readServiceConfiguration(serviceID);
      let configPath = ServiceVolume.buildByConfig(
        service.volumes.find((v) => v.split(":").slice(-1) == "/etc/prometheus")
      ).destinationPath;
      if (configPath.endsWith("/")) configPath = configPath.slice(0, -1, ""); //if path ends with '/' remove it

      prometheusConfig = await this.sshService.exec(`cat ${configPath}/prometheus.yml`);
    } catch (err) {
      log.error("Can't read Prometheus config " + serviceID, err);
      throw new Error("Can't read Prometheus config " + serviceID + ": " + err);
    }

    if (SSHService.checkExecError(prometheusConfig)) {
      throw new Error(
        "Failed reading Prometheus config " + serviceID + ": " + SSHService.extractExecError(prometheusConfig)
      );
    }

    return prometheusConfig.stdout;
  }

  async writePrometheusConfig(serviceID, config) {
    let configStatus;
    const ref = StringUtils.createRandomString();
    this.taskManager.tasks.push({ name: "write Prometheus config", otherRunRef: ref });
    const service = await this.readServiceConfiguration(serviceID);
    try {
      let configPath = ServiceVolume.buildByConfig(
        service.volumes.find((v) => v.split(":").slice(-1) == "/etc/prometheus")
      ).destinationPath;
      if (configPath.endsWith("/")) configPath = configPath.slice(0, -1, ""); //if path ends with '/' remove it
      configStatus = await this.sshService.exec(
        "echo -e " + StringUtils.escapeStringForShell(config.trim()) + ` > ${configPath}/prometheus.yml`
      );
    } catch (err) {
      this.taskManager.otherSubTasks.push({
        name: "write Prometheus config yaml",
        otherRunRef: ref,
        status: false,
      });
      this.taskManager.finishedOtherTasks.push({ otherRunRef: ref });
      log.error("Can't write Prometheus config", err);
      throw new Error("Can't write Prometheus config: " + err);
    }

    if (SSHService.checkExecError(configStatus)) {
      this.taskManager.otherSubTasks.push({
        name: "write Prometheus config yaml",
        otherRunRef: ref,
        status: false,
      });
      this.taskManager.finishedOtherTasks.push({ otherRunRef: ref });
      throw new Error("Can't write Prometheus config: " + SSHService.extractExecError(configStatus));
    }
    this.taskManager.otherSubTasks.push({
      name: "write Prometheus config yaml",
      otherRunRef: ref,
      status: true,
    });
    this.taskManager.finishedOtherTasks.push({ otherRunRef: ref });
    return;
  }

  /**
   * write a specific service YAML
   *
   * @param service object {id,data,service} id: serviceID, data: plain YAML, service: Service Name
   */
  async writeServiceYAML(service) {
    let configStatus;
    const ref = StringUtils.createRandomString();
    this.taskManager.tasks.push({ name: "write yaml", otherRunRef: ref });
    try {
      if (!this.checkServiceYamlFormat(service.data.trim())) {
        throw new Error("Config is not in the right format!");
      }
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
        data: err,
      });
      this.taskManager.finishedOtherTasks.push({ otherRunRef: ref });
      log.error("Can't write service yaml of " + service.id, err);
      throw new Error("Can't write service configuration of " + service.id + ": " + err);
    }

    if (SSHService.checkExecError(configStatus)) {
      this.taskManager.otherSubTasks.push({
        name: "write " + service.service + " config",
        otherRunRef: ref,
        status: false,
      });
      this.taskManager.finishedOtherTasks.push({ otherRunRef: ref });
      throw new Error(
        "Failed writing service configuration " + service.id + ": " + SSHService.extractExecError(configStatus)
      );
    }
    this.taskManager.otherSubTasks.push({
      name: "write " + service.service + " config",
      otherRunRef: ref,
      status: true,
    });
    this.taskManager.finishedOtherTasks.push({ otherRunRef: ref });
    return;
  }

  /**
   * write a specific service configuration
   *
   * @param serviceConfiguration servicd configuration to write to the node
   */
  async writeServiceConfiguration(serviceConfiguration) {
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
      throw new Error("Can't write service configuration of " + serviceConfiguration.id + ": " + err);
    }

    if (SSHService.checkExecError(configStatus)) {
      this.taskManager.otherSubTasks.push({
        name: "write " + serviceConfiguration.service + " config",
        otherRunRef: ref,
        status: false,
      });
      this.taskManager.finishedOtherTasks.push({ otherRunRef: ref });
      throw new Error(
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
    return;
  }

  /**
   * list docker services
   */
  async listServices() {
    let serviceJsons;
    try {
      serviceJsons = await this.sshService.exec("docker ps --format '{{json .}}' --no-trunc");
    } catch (err) {
      log.error("Can't list services: ", err);
      throw new Error("Can't list services: " + err);
    }

    if (SSHService.checkExecError(serviceJsons)) {
      throw new Error("Failed listing services: " + SSHService.extractExecError(serviceJsons));
    }

    return serviceJsons.stdout
      .split(/\n/)
      .slice(0, -1)
      .map((json) => {
        return JSON.parse(json);
      });
  }

  /**
   * get details of docker service
   *
   * @param serviceId either <docker-container-id> or <'stereum-' + stereum-service-id>
   */
  async getServiceDetails(serviceId) {
    let serviceJson;
    try {
      serviceJson = await this.sshService.exec("docker inspect " + serviceId);
    } catch (err) {
      log.error("Can't get service details of '" + serviceId + "': ", err);
      throw new Error("Can't get service details of '" + serviceId + "': " + err);
    }

    if (SSHService.checkExecError(serviceJson)) {
      throw new Error(
        "Failed getting service details of '" + serviceId + "': " + SSHService.extractExecError(serviceJson)
      );
    }

    return JSON.parse(serviceJson.stdout);
  }

  async getServiceLogs(serviceID) {
    let logs;
    try {
      logs = await this.sshService.exec("docker logs --tail=100 stereum-" + serviceID);
    } catch (err) {
      log.error("Can't get service logs of '" + serviceID + "': ", err);
      throw new Error("Can't get service logs of '" + serviceID + "': " + err);
    }

    if (logs.stdout.length > 0) {
      return logs.stdout;
    }
    return logs.stderr;
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
    await this.nukeServiceVolumes(serviceConfigs, ref);

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

  async nukeServiceVolumes(serviceConfigs, ref) {
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

  async getCurrentStereumVersion() {
    let response;
    try {
      response = await this.sshService.exec(
        `cd ${this.settings.stereum.settings.controls_install_path}/ansible && git rev-parse HEAD`
      );
    } catch (err) {
      log.error("Couldn't get Stereum Version:", err);
      throw new Error("Couldn't get Stereum Version:\n" + err);
    }

    if (SSHService.checkExecError(response)) {
      throw new Error("Failed reading Stereum Version:\n" + SSHService.extractExecError(response));
    }
    return response.stdout.trim();
  }

  async getCurrentLauncherVersion() {
    const app = electron.app || electron.remote.app;
    return app ? app.getVersion() : "N/A";
  }

  async getLargestVolumePath() {
    try {
      const dfOutput = await this.sshService.exec(
        "df | grep -wv /var/lib/docker | tail -n +2 | sort -k 4 -rn | head -n 1"
      );

      if (SSHService.checkExecError(dfOutput)) {
        throw new Error("Failed reading df command: " + SSHService.extractExecError(dfOutput));
      }

      const path = dfOutput.stdout.split(" ").pop().trim();

      return path;
    } catch (err) {
      log.error("Can't read df", err);
      throw new Error("Can't read df: " + err);
    }
  }

  async setStereumSettings(settings) {
    let value = { stereum_settings: settings.stereum };
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
      throw new Error("Can't write stereum config: " + err);
    }

    if (SSHService.checkExecError(result)) {
      this.taskManager.otherSubTasks.push({
        name: "write stereum config",
        otherRunRef: ref,
        status: false,
      });
      this.taskManager.finishedOtherTasks.push({ otherRunRef: ref });
      throw new Error("Can't write stereum config: " + SSHService.extractExecError(result));
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
      throw new Error("Can't run setup playbook: " + err);
    }

    return settings;
  }

  async logout() {
    this.sshService.stopShell();
    await this.sshService.disconnect();
    this.settings = undefined;
    await this.closeTunnels();
    this.os = null;
    this.osv = null;
    console.log("logged out");
  }

  async restartServer() {
    let status = await this.sshService.exec("cat /var/run/reboot-required");
    if (status.rc == 0) {
      const ref = StringUtils.createRandomString();
      this.taskManager.otherTasksHandler(ref, "Restarting Server");
      await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait for the TaskManager to pick up the task
      await this.sshService.exec("/sbin/shutdown -r now");
      this.taskManager.otherTasksHandler(ref, "trigger restart", true);
      await this.sshService.disconnect();
      await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait for the disconnect to be fully done
      const retry = { connected: false, counter: 0, maxTries: 300 };
      log.info("Connecting via SSH");

      while (!retry.connected && retry.counter < retry.maxTries) {
        try {
          retry.counter++;
          log.info(`Trying to connect (${retry.counter})`);
          retry.connected = await this.sshService.checkSSHConnection(this.nodeConnectionParams, 5000);
        } catch (err) {
          if (retry.counter == retry.maxTries) {
            this.taskManager.otherTasksHandler(ref, "Could not connect " + (retry.maxTries - retry.counter), false);
            this.taskManager.otherTasksHandler(ref);
            throw err;
          }
          this.taskManager.otherTasksHandler(
            ref,
            "Could not connect " + (retry.maxTries - retry.counter),
            true,
            err + "\n\n" + (retry.maxTries - retry.counter) + " tries left."
          );
          log.info(" Could not connect.\n" + (retry.maxTries - retry.counter) + " tries left.");
        }
      }
      log.info("OUT OF WHILE LOOP");
      if (retry.connected) {
        await this.establish(this.taskManager);
        this.taskManager.otherTasksHandler(ref, "Connected", true);
        this.taskManager.otherTasksHandler(ref);
      } else {
        this.taskManager.otherTasksHandler(ref, "Could not connect not tries left.", false);
        this.taskManager.otherTasksHandler(ref);
        throw "Could not connect";
      }
      return true;
    }
    return false;
  }

  async getCPUArchitecture() {
    try {
      const result = await this.sshService.exec("uname -m");
      if (SSHService.checkExecError(result)) {
        throw new Error("Failed reading uname command: " + SSHService.extractExecError(result));
      }
      return result.stdout.trim();
    } catch (error) {
      log.error("Error getting CPU Architecture", error);
    }
  }

  checkServiceYamlFormat(string) {
    try {
      const properties = [
        "id",
        "service",
        "configVersion",
        "command",
        "entrypoint",
        "env",
        "image",
        "ports",
        "volumes",
        "user",
        "network",
        "dependencies",
      ];
      const service = YAML.parse(string);
      for (const propertiesKey of properties) {
        if (!service[propertiesKey]) {
          throw new Error(service[propertiesKey] + " property is missing, empty or invalid");
        }
      }
      return true;
    } catch (err) {
      log.error(err);
      return false;
    }
  }

  async IpScanLan() {
    let localIpAddresses = "";
    const networkInterfaces = os.networkInterfaces();
    for (const interfaceName in networkInterfaces) {
      const interfaces = networkInterfaces[interfaceName];
      for (const iface of interfaces) {
        if (iface.family === "IPv4" && !iface.internal && iface.address.includes("192.168.")) {
          localIpAddresses = iface.address.substring(0, iface.address.lastIndexOf(".") + 1);
        }
      }
    }

    let avadoIPs = [];
    let target = [`${localIpAddresses}0/24`];

    for (let i = 0; i < target.length; i++) {
      const options = {
        target: target[i],
        port: "54321",
        status: "O", // Timeout(T), Refused(R), Open(O), Unreachable(U)
        banner: true,
      };
      const evilscan = new Evilscan(options);
      evilscan.on("result", (data) => {
        if (data.status.includes("open")) {
          avadoIPs.push({ ip: data.ip });
        }
      });
      evilscan.on("error", (err) => {
        throw new Error(err.toString());
      });
      evilscan.on("done", () => {
        console.log("DONE!");
      });
      evilscan.run();
    }
    await Sleep(5 * 1000);
    return avadoIPs;
  }

  async dumpDockerLogs() {
    try {
      const services = await this.listServices();
      log.info(services);
      const containerIds = services.map((service) => service.ID);

      const logsPromises = containerIds.map(async (containerId) => {
        try {
          let jsonFilePathsResult = await this.sshService.exec(
            `ls /var/lib/docker/containers/${containerId}/${containerId}*`
          );

          if (SSHService.checkExecError(jsonFilePathsResult)) {
            throw new Error("Failed reading docker logs: " + SSHService.extractExecError(jsonFilePathsResult));
          }

          const jsonFilePaths = jsonFilePathsResult.stdout.split("\n").filter((i) => i);

          for (const jsonFilePath of jsonFilePaths) {
            const logs = await this.sshService.exec(`cat ${jsonFilePath}`);

            return { containerId, logs };
          }
        } catch (err) {
          log.error("Failed to dump Docker Logs: ", err);
          return { containerId, logs: "" };
        }
      });

      const allLogs = await Promise.all(logsPromises);
      return allLogs;
    } catch (err) {
      log.error("Failed to dump Docker Logs: ", err);
      return [{ containerId: "ERROR", logs: err }];
    }
  }

  /**
   * Ensures a curl image is installed on the node.
   * Will use already installed curl image if latest is not installable.
   * Will pull latest curl image from docker hub if not already installed on the node
   * @returns {string} - The version of the latest curl image installed on the node
   */
  async ensureCurlImage() {
    // try pulling the latest curl image
    try {
      const result = await this.sshService.exec("docker pull curlimages/curl");

      if (SSHService.checkExecError(result)) {
        throw new Error(SSHService.extractExecError(result));
      }

      return "latest";
    } catch (error) {
      // if pulling the latest image fails, try fetching the latest installed image
      try {
        // get all installed curl images
        const fetchedImages = await this.sshService.exec("docker images curlimages/curl --format json");
        if (SSHService.checkExecError(fetchedImages)) {
          throw new Error(SSHService.extractExecError(fetchedImages));
        }

        const images = fetchedImages.stdout
          .split(/\n/)
          .slice(0, -1)
          .map((json) => {
            return JSON.parse(json);
          });
        log.info(`installed images: ${images}`);
        if (images.length === 0) return "latest";

        // get the latest installed image
        let latestImage = images[0];
        for (const image of images) {
          if (Date.parse(image.CreatedAt) > Date.parse(latestImage.CreatedAt)) {
            latestImage = image;
          }
        }

        return latestImage ? latestImage.Tag : "latest";
      } catch (error) {
        log.error("Error fetching installed curl images: ", error);
        return "latest";
      }
    }
  }
}
