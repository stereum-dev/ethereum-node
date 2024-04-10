import { SSHService } from "./SSHService";
const log = require("electron-log");
// import YAML from "yaml";

export class ConfigManager {
  constructor() {
    this.sshService = new SSHService();
  }

  async readMultiConfigYaml() {
    let multiConfigYaml;
    try {
      multiConfigYaml = await this.sshService.exec("cat /etc/stereum/multiConfig.yaml");
      console.log("Multi config output---------------------------", multiConfigYaml);
    } catch (err) {
      log.error("Can't read multiConfig file");
      throw new Error("Can't read multiConfig file " + err);
    }

    if (this.sshService.checkExecError(multiConfigYaml)) {
      throw new Error("Failed reading service yaml " + this.sshService.extractExecError(multiConfigYaml));
    }
    return multiConfigYaml.stdout;
  }
}
