const Store = require("electron-store");

export class StorageService {
  constructor() {
    this.store = new Store();
  }

  async writeConfig(config) {
    this.store.set("config-v2", config);
  }

  async readConfig() {
    return new Promise((resolve) => {
      resolve(this.store.get("config-v2"));
    });
  }
}
