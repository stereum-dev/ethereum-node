import EventEmitter from "events";

let instance = null;
class ControlService extends EventEmitter {
  constructor() {
    super();
    this.promiseIpc = window.promiseIpc;
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
      stereumRelease: args.stereumRelease,
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

  async openTunnels(args) {
    await this.promiseIpc.send("tunnel", args);
    return args;
  }

  async setApikey(args) {
    await this.promiseIpc.send("setApikey", args);
  }

  async readConfig() {
    return await this.promiseIpc.send("readConfig");
  }

  async writeConfig(args) {
    await this.promiseIpc.send("writeConfig", args);
    return args;
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
    });
  }

  async startOneClickServices() {
    return await this.promiseIpc.send("startOneClickServices");
  }

  async getServerVitals() {
    return await this.promiseIpc.send("getServerVitals");
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

  async getServiceConfig(args) {
    return await this.promiseIpc.send("getServiceConfig", args);
  }

  async getServiceYAML(args) {
    return await this.promiseIpc.send("getServiceYAML", args);
  }

  async writeServiceYAML(args) {
    return await this.promiseIpc.send("writeServiceYAML", args);
  }

  async importKey(args) {
    //resolve proxy
    let files = [];
    args.files.forEach((file) => {
      files.push({ name: file.name, path: file.path });
    });
    return await this.promiseIpc.send("importKey", {
      files: files,
      password: args.password,
    });
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

  async runAllUpdates() {
    return await this.promiseIpc.send("runAllUpdates");
  }

  async updateServices(args) {
    return await this.promiseIpc.send("updateServices", args);
  }

  async updateStereum(args) {
    return await this.promiseIpc.send("updateStereum", args);
  }

  async checkUpdates() {
    return await this.promiseIpc.send("checkUpdates");
  }

  async getCurrentStereumVersion() {
    return await this.promiseIpc.send("getCurrentStereumVersion");
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

  async addFeeRecipient(args){
    return await this.promiseIpc.send("addFeeRecipient", args)  // 
  }

  async getOperatorPageURL(args) {
    return await this.promiseIpc.send("getOperatorPageURL", args); // insert existing operator keys
  }
}
if (!instance) {
  instance = new ControlService(window.electron);
}
export default instance;
