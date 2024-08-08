export class TekuGasLimitConfig{
  constructor(nodeConnection) {
    this.nodeConnection = nodeConnection;
  }

  async createGasConfigFile(gasLimit, feeRecipient, configPath){
    await this.nodeConnection.sshService.exec(`cat > ${configPath}/gas_config.json`);
    await this.nodeConnection.sshService.exec(`echo '{\n\t"default_config":\n\t{\n\t\t"fee_recipient":"${feeRecipient}",\n\t\t"builder":\n\t\t{\n\t\t\t"enabled":true,\n\t\t\t"gas_limit":"${gasLimit}"\n\t\t}\n\t}\n}' > ${configPath}/gas_config.json`);
  }

  async removeGasConfigFile(configPath){
    await this.nodeConnection.sshService.exec(`rm -f ${configPath}/gas_config.json`);
  }

  async readGasConfigFile(configPath){
    let result = await this.nodeConnection.sshService.exec(`test -f ${configPath}/gas_config.json`)
    if(result.rc == 0){
      let gasLimit = await this.nodeConnection.sshService.exec(`cat ${configPath}/gas_config.json`)
      gasLimit = gasLimit.stdout.match(/^.*gas_limit.*$/gm)[0].split(':')[1];
      return gasLimit;
    }
  }
}
