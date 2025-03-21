import EventEmitter from "events";

let instance = null;
class ControlService extends EventEmitter {
  constructor() {
    super();
    this.promiseIpc = window.promiseIpc;
    this.addListener = window.promiseIpc.addListener;
    this.removeListener = window.promiseIpc.removeListener;
    this.webUtils = window.webUtils;
  }

  init(store) {
    this.promiseIpc.send("ready", "OK");
    instance.$store = store;
  }

  async connect(args) {
    return this.promiseIpc.send("connect", {
      host: args.host,
      port: args.port,
      user: args.user,
      password: args.password,
      sshKeyAuth: args.sshKeyAuth,
      keyfileLocation: args.keyfileLocation,
      passphrase: args.passphrase,
      stereumRelease: args.stereumRelease,
      authCode: args.authCode,
    });
  }

  async reconnect() {
    return this.promiseIpc.send("reconnect");
  }

  async checkConnection() {
    return this.promiseIpc.send("checkConnection");
  }

  async disconnect(args) {
    return this.promiseIpc.send("disconnect", args);
  }

  async inquire(args) {
    return this.promiseIpc.send("inquire", args);
  }

  async setup(args) {
    return this.promiseIpc.send("setup", args);
  }

  async destroy() {
    return await this.promiseIpc.send("destroy");
  }

  async watchSSVDKG() {
    return await this.promiseIpc.send("watchSSVDKG");
  }

  async openTunnels(args) {
    return await this.promiseIpc.send("tunnel", args);
  }

  async closeTunnels() {
    return await this.promiseIpc.send("closeTunnels");
  }

  async logout() {
    return await this.promiseIpc.send("logout");
  }

  async setApikey(args) {
    await this.promiseIpc.send("setApikey", args);
  }

  async idleTimerCheck(timerStop, win) {
    return await this.promiseIpc.send("idleTimerCheck", { timerStop, win });
  }

  async setIdleTime(args) {
    return await this.promiseIpc.send("setIdleTime", args);
  }

  async readConfig() {
    return await this.promiseIpc.send("readConfig");
  }

  async writeConfig(args) {
    await this.promiseIpc.send("writeConfig", args);
    return args;
  }

  async isCheckpointValid(cp_url) {
    return await this.promiseIpc.send("isCheckpointValid", cp_url);
  }

  async checkOS() {
    return await this.promiseIpc.send("checkOS");
  }

  async checkSudo() {
    return await this.promiseIpc.send("checkSudo");
  }

  async getOneClickConstellation(args) {
    return await this.promiseIpc.send("getOneClickConstellation", args);
  }

  async prepareOneClickInstallation(args) {
    return await this.promiseIpc.send("prepareOneClickInstallation", args);
  }

  async writeOneClickConfiguration(args) {
    let buffer = [];
    args.services.forEach((service) => {
      buffer.push({
        id: service.id,
        name: service.name,
        service: service.service,
        category: service.category,
        displayCategory: service.displayCategory,
        path: service.path,
        icon: service.icon,
        sIcon: service.sIcon,
      });
    });
    return await this.promiseIpc.send("writeOneClickConfiguration", {
      array: buffer,
      checkpointURL: args.checkpointURL,
      relayURL: args.relayURL,
      selectedPreset: args.selectedPreset,
    });
  }

  async startOneClickServices() {
    return await this.promiseIpc.send("startOneClickServices");
  }

  async openRpcTunnel(args) {
    return await this.promiseIpc.send("openRpcTunnel", args);
  }

  async closeRpcTunnel() {
    return await this.promiseIpc.send("closeRpcTunnel");
  }

  async openWsTunnel(args) {
    return await this.promiseIpc.send("openWsTunnel", args);
  }

  async closeWsTunnel() {
    return await this.promiseIpc.send("closeWsTunnel");
  }

  async openBeaconTunnel(args) {
    return await this.promiseIpc.send("openBeaconTunnel", args);
  }

  async closeBeaconTunnel() {
    return await this.promiseIpc.send("closeBeaconTunnel");
  }

  async getNodeStats() {
    return await this.promiseIpc.send("getNodeStats");
  }

  async getServerVitals() {
    return await this.promiseIpc.send("getServerVitals");
  }

  async getStorageStatus() {
    return await this.promiseIpc.send("getStorageStatus");
  }

  async getBalanceStatus() {
    return await this.promiseIpc.send("getBalanceStatus");
  }

  async getConnectionStats() {
    return await this.promiseIpc.send("getConnectionStats");
  }

  async getAvailablePort(args) {
    return await this.promiseIpc.send("getAvailablePort", args);
  }

  async checkStereumInstallation() {
    return await this.promiseIpc.send("checkStereumInstallation");
  }

  async getServices() {
    return await this.promiseIpc.send("getServices");
  }

  async getServiceLogs(args) {
    return await this.promiseIpc.send("getServiceLogs", args);
  }

  async getAllServiceLogs(args) {
    return await this.promiseIpc.send("getAllServiceLogs", args);
  }

  async getServiceConfig(args) {
    return await this.promiseIpc.send("getServiceConfig", args);
  }

  async writeServiceConfig(args) {
    return await this.promiseIpc.send("writeServiceConfig", args);
  }

  async getServiceYAML(args) {
    return await this.promiseIpc.send("getServiceYAML", args);
  }

  async writeServiceYAML(args) {
    return await this.promiseIpc.send("writeServiceYAML", args);
  }

  async importKey(args) {
    return await this.promiseIpc.send("importKey", args);
  }

  async deleteValidators(args) {
    return await this.promiseIpc.send("deleteValidators", args);
  }

  async listValidators(args) {
    return await this.promiseIpc.send("listValidators", args);
  }

  async listServices() {
    return await this.promiseIpc.send("listServices");
  }

  async manageServiceState(args) {
    return await this.promiseIpc.send("manageServiceState", args);
  }

  async runAllUpdates(args) {
    return await this.promiseIpc.send("runAllUpdates", args);
  }

  async updateServices(args) {
    return await this.promiseIpc.send("updateServices", args);
  }

  async updateStereum(args) {
    return await this.promiseIpc.send("updateStereum", args);
  }

  async getCurrentOsVersion(args) {
    return await this.promiseIpc.send("getCurrentOsVersion", args);
  }

  async getCountOfUpdatableOSUpdate(args) {
    return await this.promiseIpc.send("getCountOfUpdatableOSUpdate", args);
  }

  async updatePackage(args) {
    return await this.promiseIpc.send("updatePackage", args);
  }

  async getUpgradeablePackages(args) {
    return await this.promiseIpc.send("getUpgradeablePackages", args);
  }

  async updateOS(args) {
    return await this.promiseIpc.send("updateOS", args);
  }

  async restartServices(args) {
    return await this.promiseIpc.send("restartServices", args);
  }

  async restartService(args) {
    return await this.promiseIpc.send("restartService", args);
  }

  async checkUpdates() {
    return await this.promiseIpc.send("checkUpdates");
  }

  async getCurrentStereumVersion() {
    return await this.promiseIpc.send("getCurrentStereumVersion");
  }

  async getCurrentLauncherVersion() {
    return await this.promiseIpc.send("getCurrentLauncherVersion");
  }

  async getLargestVolumePath() {
    return await this.promiseIpc.send("getLargestVolumePath");
  }

  async getTasks() {
    return await this.promiseIpc.send("getTasks"); // gets the current available Data
  }

  async clearTasks() {
    return await this.promiseIpc.send("clearTasks"); // clears all data
  }

  async updateTasks() {
    return await this.promiseIpc.send("updateTasks"); // updates task progression
  }

  async insertSSVNetworkKeys(args) {
    return await this.promiseIpc.send("insertSSVNetworkKeys", args); // insert existing operator keys
  }

  async refreshServiceInfos() {
    return await this.promiseIpc.send("refreshServiceInfos"); // insert existing operator keys
  }

  async getFeeRecipient(args) {
    return await this.promiseIpc.send("getFeeRecipient", args); //
  }

  async setFeeRecipient(args) {
    return await this.promiseIpc.send("setFeeRecipient", args); //
  }

  async deleteFeeRecipient(args) {
    return await this.promiseIpc.send("deleteFeeRecipient", args); //
  }

  async setGraffitis(args) {
    return await this.promiseIpc.send("setGraffitis", args);
  }

  async chooseServiceAction(args) {
    return await this.promiseIpc.send("chooseServiceAction", args);
  }

  async handleServiceChanges(args) {
    return await this.promiseIpc.send("handleServiceChanges", args);
  }

  async getStereumSettings() {
    return await this.promiseIpc.send("getStereumSettings");
  }

  async setStereumSettings(args) {
    return await this.promiseIpc.send("setStereumSettings", args);
  }

  async writeKeys(args) {
    return await this.promiseIpc.send("writeKeys", args);
  }

  async readKeys() {
    return await this.promiseIpc.send("readKeys");
  }

  async getValidatorStats(args) {
    return await this.promiseIpc.send("getValidatorStats", args);
  }

  async getValidatorState(args) {
    return await this.promiseIpc.send("getValidatorState", args);
  }

  async prepareStereumNode(args) {
    return await this.promiseIpc.send("prepareStereumNode", args);
  }

  async restartServer() {
    return await this.promiseIpc.send("restartServer");
  }

  async forwardSSVCommand(args) {
    return await this.promiseIpc.send("forwardSSVCommand", args);
  }

  async getSSVTotalConfig(args) {
    return await this.promiseIpc.send("getSSVTotalConfig", args);
  }

  async readSSVNetworkConfig(args) {
    return await this.promiseIpc.send("readSSVNetworkConfig", args);
  }

  async writeSSVNetworkConfig(args) {
    return await this.promiseIpc.send("writeSSVNetworkConfig", args);
  }

  async getSSVDKGTotalConfig(args) {
    return await this.promiseIpc.send("getSSVDKGTotalConfig", args);
  }

  async readSSVDKGConfig(args) {
    return await this.promiseIpc.send("readSSVDKGConfig", args);
  }

  async writeSSVDKGConfig(args) {
    return await this.promiseIpc.send("writeSSVDKGConfig", args);
  }

  async readPrometheusConfig(args) {
    return await this.promiseIpc.send("readPrometheusConfig", args);
  }

  async writePrometheusConfig(args) {
    return await this.promiseIpc.send("writePrometheusConfig", args);
  }

  async getQRCode() {
    return await this.promiseIpc.send("getQRCode");
  }

  async getCPUTemperature() {
    return await this.promiseIpc.send("getCPUTemperature");
  }

  async importRemoteKeys(args) {
    return await this.promiseIpc.send("importRemoteKeys", args);
  }

  async listRemoteKeys(args) {
    return await this.promiseIpc.send("listRemoteKeys", args);
  }

  async deleteRemoteKeys(args) {
    return await this.promiseIpc.send("deleteRemoteKeys", args);
  }

  async checkRemoteKeys(args) {
    return await this.promiseIpc.send("checkRemoteKeys", args);
  }

  async checkActiveValidators(args) {
    //resolve proxy
    let files = [];
    let passwordFiles = [];
    if (args.isRemote) {
      files = args.files;
    } else {
      args.files.forEach((file) => {
        files.push({ name: file.name, path: this.webUtils.getPathForFile(file) });
      });
    }
    if (args.passwordFiles && Array.isArray(args.passwordFiles)) {
      args.passwordFiles.forEach((file) => {
        passwordFiles.push({ name: file.name, path: this.webUtils.getPathForFile(file) });
      });
    }
    return await this.promiseIpc.send("checkActiveValidators", {
      files: files,
      passwordFiles: passwordFiles,
      password: args.password,
      serviceID: args.serviceID,
      slashingDB: args.slashingDB,
      isRemote: args.isRemote,
    });
  }

  async exitValidatorAccount(args) {
    return await this.promiseIpc.send("exitValidatorAccount", {
      pubkey: args.pubkey,
      serviceID: args.serviceID,
    });
  }

  async getExitValidatorMessage(args) {
    return await this.promiseIpc.send("getExitValidatorMessage", {
      pubkey: args.pubkey,
      serviceID: args.serviceID,
    });
  }

  async exportConfig() {
    return await this.promiseIpc.send("exportConfig");
  }

  async importConfig(args) {
    return await this.promiseIpc.send("importConfig", args);
  }

  async getCurrentEpochSlot(args) {
    return await this.promiseIpc.send("getCurrentEpochSlot", args);
  }

  async beginAuthSetup(timeBased, increaseTimeLimit, enableRateLimit) {
    return await this.promiseIpc.send("beginAuthSetup", { timeBased, increaseTimeLimit, enableRateLimit });
  }

  async authenticatorVerification(args) {
    return await this.promiseIpc.send("authenticatorVerification", args);
  }

  async finishAuthSetup() {
    return await this.promiseIpc.send("finishAuthSetup");
  }

  async removeAuthenticator(args) {
    return await this.promiseIpc.send("removeAuthenticator", args);
  }

  async checkForAuthenticator(args) {
    return await this.promiseIpc.send("checkForAuthenticator", args);
  }

  async cancelVerification(args) {
    return await this.promiseIpc.send("cancelVerification", args);
  }

  async changePassword(args) {
    return await this.promiseIpc.send("changePassword", args);
  }

  async readSSHKeyFile(args) {
    return await this.promiseIpc.send("readSSHKeyFile", args);
  }

  async writeSSHKeyFile(args) {
    return await this.promiseIpc.send("writeSSHKeyFile", args);
  }

  async generateSSHKeyPair(args) {
    return await this.promiseIpc.send("generateSSHKeyPair", args);
  }

  async openDirectoryDialog(args) {
    return await this.promiseIpc.send("openDirectoryDialog", args);
  }

  async openFilePicker(dialog_options, read_content = false) {
    return await this.promiseIpc.send("openFilePicker", dialog_options, read_content);
  }

  async AddExistingSSHKey(args) {
    return await this.promiseIpc.send("AddExistingSSHKey", args);
  }

  async beaconchainMonitoringModification(args) {
    return await this.promiseIpc.send("beaconchainMonitoringModification", args);
  }

  async removeBeaconchainMonitoring(args) {
    return await this.promiseIpc.send("removeBeaconchainMonitoring", args);
  }

  async IpScanLan() {
    return await this.promiseIpc.send("IpScanLan");
  }
  async dumpDockerLogs() {
    return await this.promiseIpc.send("dumpDockerLogs");
  }
  async getCurrentEpochandSlot() {
    return await this.promiseIpc.send("getCurrentEpochandSlot");
  }
  async getValidatorDuties(args) {
    return await this.promiseIpc.send("getValidatorDuties", args);
  }

  async getAttestationRewards(args) {
    return await this.promiseIpc.send("getAttestationRewards", args);
  }

  async getBlockRewards(args) {
    return await this.promiseIpc.send("getBlockRewards", args);
  }

  async copyExecutionJWT(args) {
    return await this.promiseIpc.send("copyExecutionJWT", args);
  }

  async getSyncCommitteeRewards(validators, slot) {
    return await this.promiseIpc.send("getSyncCommitteeRewards", { validators, slot });
  }

  async createObolENR(privateKey) {
    return await this.promiseIpc.send("createObolENR", privateKey);
  }

  async getObolENRPrivateKey() {
    return await this.promiseIpc.send("getObolENRPrivateKey");
  }

  async checkObolContent() {
    return await this.promiseIpc.send("checkObolContent");
  }

  async getObolENRPublicKey() {
    return await this.promiseIpc.send("getObolENRPublicKey");
  }

  async removeObolENR() {
    return await this.promiseIpc.send("removeObolENR");
  }

  async removeObolCluster() {
    return await this.promiseIpc.send("removeObolCluster");
  }

  async startObolDKG(args) {
    return await this.promiseIpc.send("startObolDKG", args);
  }

  async checkObolDKG() {
    return await this.promiseIpc.send("checkObolDKG");
  }

  async getObolDKGLogs() {
    return await this.promiseIpc.send("getObolDKGLogs");
  }

  async downloadObolBackup(args) {
    return await this.promiseIpc.send("downloadObolBackup", args);
  }

  async fetchTranslators(args) {
    return await this.promiseIpc.send("fetchTranslators", args);
  }

  async fetchGitHubTesters(args) {
    return await this.promiseIpc.send("fetchGitHubTesters", args);
  }

  async importObolBackup(args) {
    return await this.promiseIpc.send("importObolBackup", args);
  }

  async upgradeToNoble() {
    return await this.promiseIpc.send("upgradeToNoble");
  }

  async startShell() {
    return this.promiseIpc.send("startShell");
  }

  async stopShell() {
    return this.promiseIpc.send("stopShell");
  }

  async executeCommand(args) {
    return this.promiseIpc.send("executeCommand", args);
  }

  async readMultiSetup() {
    return this.promiseIpc.send("readMultiSetup");
  }

  async createSetup(args) {
    return this.promiseIpc.send("createSetup", args);
  }

  async deleteSetup(args) {
    return this.promiseIpc.send("deleteSetup", args);
  }

  async renameSetup(args) {
    return this.promiseIpc.send("renameSetup", args);
  }

  async exportSingleSetup(args) {
    return this.promiseIpc.send("exportSingleSetup", args);
  }

  async importSingleSetup(args) {
    return this.promiseIpc.send("importSingleSetup", args);
  }

  async switchSetupNetwork(args) {
    return this.promiseIpc.send("switchSetupNetwork", args);
  }

  async checkAndCreateMultiSetup(args) {
    return this.promiseIpc.send("checkAndCreateMultiSetup", args);
  }

  async checkConnectionQuality() {
    return this.promiseIpc.send("checkConnectionQuality");
  }

  async create2FAQRCode(args) {
    return this.promiseIpc.send("create2FAQRCode", args);
  }

  async createGasConfigFile(args) {
    return this.promiseIpc.send("createGasConfigFile", args);
  }

  async removeGasConfigFile(args) {
    return this.promiseIpc.send("removeGasConfigFile", args);
  }

  async readGasConfigFile(args) {
    return this.promiseIpc.send("readGasConfigFile", args);
  }

  async writeGenesisJsonDevnet(args) {
    return this.promiseIpc.send("writeGenesisJsonDevnet", args);
  }

  async writeConfigYamlDevnet(args) {
    return this.promiseIpc.send("writeConfigYamlDevnet", args);
  }

  async initGenesis() {
    return this.promiseIpc.send("initGenesis");
  }

  async removeConfigGenesisCopy() {
    return this.promiseIpc.send("removeConfigGenesisCopy");
  }

  async startServicesForSetup(args) {
    return this.promiseIpc.send("startServicesForSetup", args);
  }

  async handleOTPChange(args) {
    return this.promiseIpc.send("handleOTPChange", args);
  }

  async fetchObolCharonAlerts() {
    return this.promiseIpc.send("fetchObolCharonAlerts");
  }

  async fetchCsmMetrics() {
    return this.promiseIpc.send("fetchCsmMetrics");
  }

  async fetchCsmAlerts() {
    return this.promiseIpc.send("fetchCsmAlerts");
  }

  async ignoreUpdate() {
    return this.promiseIpc.send("ignoreUpdate");
  }

  async updateLauncher() {
    return this.promiseIpc.send("updateLauncher");
  }

  async getNewLauncherVersion() {
    return this.promiseIpc.send("getNewLauncherVersion");
  }

  async getSubnetSubs() {
    return this.promiseIpc.send("getSubnetSubs");
  }

  async deleteSlasherVolume(args) {
    return this.promiseIpc.send("deleteSlasherVolume", args);
  }

  async fetchCurrentTimeZone(args) {
    return this.promiseIpc.send("fetchCurrentTimeZone", args);
  }

  async getCSMQueue(keysArray) {
    return this.promiseIpc.send("getCSMQueue", { keysArray });
  }

  async getSigningKeysWithQueueInfo() {
    return this.promiseIpc.send("getSigningKeysWithQueueInfo");
  }

  async getObolClusterInformation(serviceID) {
    return this.promiseIpc.send("getObolClusterInformation", { serviceID });
  }

  async getSSVClusterInformation(serviceID) {
    return this.promiseIpc.send("getSSVClusterInformation", { serviceID });
  }

  onCustomUrl(callback) {
    this.addListener("handle-custom-url", (_, url) => {
      console.log("Custom URL received:", url);
      if (callback) callback(url);
    });
  }
}
if (!instance) {
  instance = new ControlService(window.electron);
}
export default instance;
