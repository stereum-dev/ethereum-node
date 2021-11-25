const Store = require('electron-store');

export class StorageService {

    constructor() {
        this.store = new Store();
    }

    async writeConfig(config) {
        this.store.set("config", config);
    }

    async readConfig() {
        return new Promise((resolve, reject) => {
            resolve(this.store.get("config"));
        });
    }
}