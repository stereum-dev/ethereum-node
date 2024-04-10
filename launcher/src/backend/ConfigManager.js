const log = require("electron-log");
// import YAML from "yaml";

export class ConfigManager {
  constructor(nodeConnection) {
    this.nodeConnection = nodeConnection;
  }

  async readMultiConfigYaml() {
    let multiConfigYaml;
    try {
      multiConfigYaml = await this.nodeConnection.sshService.exec("cat /etc/stereum/multiconfig.yaml");
      console.log("Multi config output---------------------------", multiConfigYaml);
    } catch (err) {
      log.error("Can't read multiConfig file");
      throw new Error("Can't read multiConfig file " + err);
    }
    return multiConfigYaml.stdout;
  }
}
