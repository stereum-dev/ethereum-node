const Store = require("electron-store");
const log = require("electron-log");

export class StorageService {
  constructor() {
    this.store = new Store();
    log.info("StorageService initialized. Config file path:", this.store.path);
  }

  async writeConfig(config) {
    try {
      this.store.set("config-v2", config);
      log.info("Config written:", config);
    } catch (error) {
      log.error("Error writing config:", error);
    }
  }

  async readConfig() {
    try {
      const config = this.store.get("config-v2");
      log.info("Config read:", config);
      return new Promise((resolve) => resolve(config));
    } catch (error) {
      log.error("Error reading config:", error);
      return new Promise((resolve) => resolve(null));
    }
  }
}
