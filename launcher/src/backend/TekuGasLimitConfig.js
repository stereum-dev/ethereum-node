export class TekuGasLimitConfig {
  constructor(nodeConnection) {
    this.nodeConnection = nodeConnection;
  }

  async createGasConfigFile(gasLimit, feeRecipient, configPath) {
    const configContent = `{
      "default_config": {
        "fee_recipient": "${feeRecipient}",
        "builder": {
          "enabled": true,
          "gas_limit": "${gasLimit}"
        }
      }
    }`;
    await this.nodeConnection.sshService.exec(`echo '${configContent}' > ${configPath}/gas_config.json`);
  }

  async removeGasConfigFile(configPath) {
    await this.nodeConnection.sshService.exec(`rm -f ${configPath}/gas_config.json`);
  }

  async readGasConfigFile(configPath) {
    let result = await this.nodeConnection.sshService.exec(`test -f ${configPath}/gas_config.json`);
    if (result.rc == 0) {
      let gasLimit = await this.nodeConnection.sshService.exec(`cat ${configPath}/gas_config.json`);
      if (gasLimit.includes("gas_limit")) {
        gasLimit = gasLimit.stdout.match(/^.*gas_limit.*$/gm)[0].split(":")[1];
        return gasLimit;
      } else {
        return "";
      }
    } else {
      return "";
    }
  }
}
