import { StringUtils } from "./StringUtils.js";
import YAML from "yaml";
import { SSHService } from "./SSHService.js";
import { validatorPorts } from "./ethereum-services/ServicePort.js";
import { ServiceVolume } from "./ethereum-services/ServiceVolume.js";
import { isObolDVTService } from "@/share/ObolDVTServices";

import * as path from "path";
import axios from "axios";

const log = require("electron-log");

async function Sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class ValidatorAccountManager {
  constructor(nodeConnection, serviceManager) {
    this.nodeConnection = nodeConnection;
    this.serviceManager = serviceManager;
    this.batches = [];
  }

  async initWallet(client, ref) {
    let service = client.service.replace(/(Beacon|Validator|Service)/gm, "").toLowerCase();
    switch (service) {
      case "prysm": {
        const wallet_path = client
          .buildConfiguration()
          .volumes.find((volume) => volume.includes("wallets"))
          .split(":")[0];
        const passwords_path = client
          .buildConfiguration()
          .volumes.find((volume) => volume.includes("passwords"))
          .split(":")[0];

        const walletPassword = await this.nodeConnection.sshService.exec(`cat ${passwords_path}/wallet-password`);
        const walletDir = await this.nodeConnection.sshService.exec(`ls ${wallet_path}/direct/accounts`);

        if (walletPassword.rc != 0 || walletDir.rc != 0) {
          log.error("No Wallet found");
          log.info("Generating one");
          this.nodeConnection.taskManager.otherTasksHandler(ref, `Check Wallet`, true, "No Wallet found, generating one");
          //generate wallet password
          await this.nodeConnection.sshService.exec(`echo ${StringUtils.createRandomString()} > ${passwords_path}/wallet-password`);
          await this.nodeConnection.sshService.exec(`chmod 700 ${passwords_path}/wallet-password`);
          await this.nodeConnection.sshService.exec(`chown 2000:2000 ${passwords_path}/wallet-password`);
          //Prysm - Create wallet for account(s)
          await this.nodeConnection.sshService.exec(
            `docker exec stereum-${client.id} /app/cmd/validator/validator wallet create --wallet-dir=/opt/app/data/wallets --wallet-password-file=/opt/app/data/passwords/wallet-password --accept-terms-of-use --keymanager-kind=direct --${client.network}`
          );

          await this.nodeConnection.sshService.exec(`chown -R 2000:2000 ${wallet_path}`);

          await Promise.all([this.serviceManager.manageServiceState(client.id, "stopped")]);

          await Promise.all([this.serviceManager.manageServiceState(client.id, "started")]);
          await this.nodeConnection.sshService.exec(`chmod 600 ${wallet_path}/direct/accounts/all-accounts.keystore.json`);
          this.nodeConnection.taskManager.otherTasksHandler(ref, `Generated Wallet`, true, "Waiting 30 Seconds for Client");
          await Sleep(30000);
        }
        break;
      }

      case "nimbus": {
        //generate validator api-token
        const validator_path = client
          .buildConfiguration()
          .volumes.find((volume) => volume.includes("validators"))
          .split(":")[0];

        if ((await this.nodeConnection.sshService.exec(`cat ${validator_path}/api-token.txt`)).rc === 1) {
          log.error("Couldn't read API-Token");
          log.info("Generating one");
          await this.nodeConnection.sshService.exec(`echo ${StringUtils.createRandomString()} > ${validator_path}/api-token.txt`);
          await this.serviceManager.manageServiceState(client.id, "stopped");
          await this.serviceManager.manageServiceState(client.id, "started");
          await Sleep(30000);
        }
        break;
      }

      case "teku": {
        const dataDir = client.volumes.find((vol) => vol.servicePath === "/opt/app/data").destinationPath;
        if ((await this.nodeConnection.sshService.exec(`cat ${dataDir}/teku_api_password.txt`)).rc === 1) {
          log.error("Couldn't read API-Token");
          log.info("Generating one");
          const password = StringUtils.createRandomString();
          await this.nodeConnection.sshService.exec("apt install -y openjdk-8-jre-headless");
          await this.nodeConnection.sshService.exec(`echo ${password} > ${dataDir}/teku_api_password.txt`);
          await this.nodeConnection.sshService.exec(
            `cd ${dataDir} && keytool -genkeypair -keystore teku_api_keystore -storetype PKCS12 -storepass ${password} -keyalg RSA -keysize 2048 -validity 109500 -dname "CN=teku, OU=MyCompanyUnit, O=MyCompany, L=MyCity, ST=MyState, C=AU" -ext "SAN=DNS:stereum-${client.id}"`
          );
          await this.serviceManager.manageServiceState(client.id, "stopped");
          await this.serviceManager.manageServiceState(client.id, "started");
          await Sleep(30000);
        }
        break;
      }
    }
  }

  async importKey(serviceID) {
    const ref = StringUtils.createRandomString();
    this.nodeConnection.taskManager.otherTasksHandler(ref, `Importing ${this.batches.map((b) => b.keystores).flat().length} Keys`);
    let services = await this.serviceManager.readServiceConfigurations();

    let client = services.find((service) => service.id === serviceID);
    await this.initWallet(client, ref);

    try {
      let data = [];
      const apiToken = await this.getApiToken(client);
      this.nodeConnection.taskManager.otherTasksHandler(ref, `Get API Token`, true);
      for (const batch of this.batches) {
        const returnVal = await this.keymanagerAPI(client, "POST", "/eth/v1/keystores", batch, [], apiToken);

        //Error Handling
        if (returnVal.rc === 52) throw "service ran out of memory";
        if (SSHService.checkExecError(returnVal) && returnVal.stderr) throw SSHService.extractExecError(returnVal);
        const response = JSON.parse(returnVal.stdout);
        if (response.data === undefined) {
          if (response.code === undefined || response.message === undefined) {
            throw "Undexpected Error: " + returnVal;
          }
          throw response.code + " " + response.message;
        }

        if (response.data.map((k) => k.status).includes("error")) {
          this.nodeConnection.taskManager.otherTasksHandler(
            ref,
            `${batch.keystores.length} Keys Imported with errors`,
            false,
            JSON.stringify(response.data)
          );
        } else {
          this.nodeConnection.taskManager.otherTasksHandler(
            ref,
            `Batch with ${batch.keystores.length} Keys Imported`,
            true,
            JSON.stringify(response.data)
          );
        }
        data = data.concat(response.data);
      }

      let pubkeys = this.batches.map((b) => b.keystores.map((c) => JSON.parse(c).pubkey)).flat();
      const message = this.formatImportResult(pubkeys, data);
      this.nodeConnection.taskManager.otherTasksHandler(ref);
      return message;
    } catch (err) {
      this.nodeConnection.taskManager.otherTasksHandler(ref, `Import Failed`, false, "Validator Import Failed:\n" + err);
      this.nodeConnection.taskManager.otherTasksHandler(ref);
      log.error("Validator Import Failed:\n", err);
      return "Validator Import Failed:\n" + err;
    }
  }

  async keymanagerAPI(service, method = "GET", apiPath, data, args = [], apiToken) {
    if (!apiPath.startsWith("/")) apiPath = "/" + apiPath;
    if (!apiToken) apiToken = await this.getApiToken(service);
    const curlTag = await this.nodeConnection.ensureCurlImage();
    let command = [
      "docker run --rm --network=stereum curlimages/curl:" + curlTag,
      `curl ${service.service.includes("Teku") ? "--insecure https" : "http"}://stereum-${service.id}:${
        validatorPorts[service.service]
      }${apiPath}`,
      `-X ${method.toUpperCase()}`,
      `-H 'Content-Type: application/json'`,
      apiToken ? `-H 'Authorization: Bearer ${apiToken}'` : "",
      `-s`,
    ];
    if (data) command.push(`-d '${JSON.stringify(data).replaceAll(/\\\\/g, "\\")}'`);
    command = command.concat(args);
    return await this.nodeConnection.sshService.exec(command.join(" "));
  }

  async insertSSVNetworkKeys(service, sk) {
    try {
      const dataDir = service.config.volumes.find((vol) => vol.servicePath === "/data").destinationPath;
      let ssvConfig = (await this.nodeConnection.sshService.exec(`cat ${dataDir}/config.yaml`)).stdout;
      if (ssvConfig) {
        const escapedConfigFile = StringUtils.escapeStringForShell(
          ssvConfig.replace(/^OperatorPrivateKey.*/gm, "OperatorPrivateKey: " + sk)
        );
        await this.nodeConnection.sshService.exec(`echo ${escapedConfigFile} > ${dataDir}/config.yaml`);

        await this.serviceManager.manageServiceState(service.config.serviceID, "stopped");
        await this.serviceManager.manageServiceState(service.config.serviceID, "started");

        let pk = undefined;
        let tries = 0;
        while (pk === undefined) {
          let logs = await this.nodeConnection.getServiceLogs(service.config.serviceID);
          if (new RegExp(/"public-key": "(.*)"/gm).test(logs)) {
            pk = new RegExp(/"public-key": "(.*)"/gm).exec(logs)[1];
          }
          tries++;
          if (tries === 20) {
            throw new Error('"public-key" was not found in service logs');
          }
        }
        let serviceConfig = await this.nodeConnection.readServiceConfiguration(service.config.serviceID);
        serviceConfig.ssv_pk = pk;
        await this.nodeConnection.writeServiceConfiguration(serviceConfig);
        return serviceConfig.ssv_pk;
      } else {
        throw new Error("no ssv config.yaml");
      }
    } catch (err) {
      log.error("Inserting Keys failed:\n", err);
      return err;
    }
  }

  async readKeys() {
    const result = await this.nodeConnection.sshService.exec("cat /etc/stereum/keys.yaml");
    if (result.rc == 0) return YAML.parse(result.stdout);
    log.error(result.stderr);
    return undefined;
  }

  async getApiToken(service) {
    let result = { rc: 1, stderr: "default" };
    switch (service.service) {
      case "PrysmValidatorService": {
        let walletPath;
        if (typeof service.volumes[0] == "string") {
          walletPath = ServiceVolume.buildByConfig(service.volumes.find((v) => v.includes("/opt/app/data/wallets"))).destinationPath;
        } else {
          walletPath = service.volumes.find((v) => v.servicePath == "/opt/app/data/wallets").destinationPath;
        }
        //Make sure keystores have correct permissions
        await this.nodeConnection.sshService.exec("chmod -Rv 600 " + walletPath + "/direct/accounts/*");
        if (walletPath) {
          result = await this.nodeConnection.sshService.exec("cat " + walletPath + "/auth-token");
          result.stdout = result.stdout
            .split("\n")
            .filter((e) => e)
            .pop();
          break;
        }
        result.stderr = "Couldn't find path";
        break;
      }
      case "LighthouseValidatorService":
        result = await this.nodeConnection.sshService.exec(
          `docker exec -u 0 -w /opt/app/validator/validators stereum-${service.id} cat api-token.txt`
        );
        break;
      case "NimbusBeaconService":
      case "NimbusValidatorService":
        result = await this.nodeConnection.sshService.exec(
          `docker exec -u 0 -w /opt/app/validators stereum-${service.id} cat api-token.txt`
        );
        break;
      case "TekuBeaconService":
      case "TekuValidatorService":
        result = await this.nodeConnection.sshService.exec(
          `docker exec -u 0 -w /opt/app/data/validator/key-manager stereum-${service.id} cat validator-api-bearer`
        );
        break;
      case "LodestarValidatorService":
        result = await this.nodeConnection.sshService.exec(
          `docker exec -u 0 -w /opt/app/validator/validator-db stereum-${service.id} cat api-token.txt`
        );
        break;
      case "Web3SignerService":
        result = await this.nodeConnection.sshService.exec(`docker exec stereum-${service.id} curl -X POST http://localhost:9000/reload`);
        result.stdout = "";
        break;
    }

    if (SSHService.checkExecError(result)) {
      log.error(`Couldn't get API token for ${service.service}: ${SSHService.extractExecError(result)}`);
      throw `Couldn't get API token for ${service.service}: ${SSHService.extractExecError(result)}`;
    }
    return result.stdout.trim();
  }

  formatImportResult(pubkeys, data) {
    let imported = 0;
    let duplicate = 0;
    let error = 0;

    let message = data
      .map((key, index) => {
        if (key.status === "imported") imported++;
        if (key.status === "duplicate") duplicate++;
        if (key.status === "error") error++;
        return (
          `${pubkeys[index].substring(0, 20)}...${pubkeys[index].substring(pubkeys[index].length - 6, pubkeys[index].length)}:\t${
            key.status
          }` + (key.status == "error" ? `:\n${key.message}\n` : "")
        );
      })
      .join("\n");

    return message + `\n${imported} key(s) imported...\n${duplicate} duplicate(s)...\n${error} import(s) failed...`;
  }

  async createObolENR(privateKey = "") {
    try {
      let services = await this.serviceManager.readServiceConfigurations();
      let charonClient = services.find((service) => isObolDVTService(service.service));
      if (!charonClient) throw "Couldn't find an Obol DV middleware service";
      if (privateKey) {
        let result = await this.nodeConnection.sshService.exec(charonClient.getCreateCharonFolderCommand());
        if (SSHService.checkExecError(result) && result.stderr) throw SSHService.extractExecError(result);

        result = await this.nodeConnection.sshService.exec(charonClient.getWriteENRPrivateKeyCommand(privateKey));
        if (SSHService.checkExecError(result) && result.stderr) throw SSHService.extractExecError(result);

        let enr = await this.getObolENRPublicKey();
        return enr;
      } else {
        let result = await this.nodeConnection.sshService.exec(charonClient.getCreateEnrCommand());
        if (SSHService.checkExecError(result) && result.stderr) throw SSHService.extractExecError(result);
        const data = result.stdout.split("\n");
        const enr = data.find((line) => line.includes("enr:-"));
        return enr;
      }
    } catch (err) {
      log.error("Error creating Obol ENR: ", err);
      return err;
    }
  }

  async checkObolContent() {
    try {
      let services = await this.serviceManager.readServiceConfigurations();
      let charonClient = services.find((service) => isObolDVTService(service.service));
      if (!charonClient) throw "Couldn't find an Obol DV middleware service";

      let result = await this.nodeConnection.sshService.exec(charonClient.getListCharonFolderContentsCommand());
      if (SSHService.checkExecError(result) && result.stderr) throw SSHService.extractExecError(result);
      const data = result.stdout;
      return {
        privateKey: data.includes("charon-enr-private-key"), //ENR Created
        clusterDefinition: data.includes("cluster-definition.json"), //Cluster Definition Created / Successfull DKG
        depositData: data.includes("deposit-data.json"), //Successfull DKG
        clusterLock: data.includes("cluster-lock.json"), //Successfull DKG
        validatorKeys: data.includes("validator_keys"), //Successfull DKG
      };
    } catch (err) {
      log.error("Error checking Obol ENR: ", err);
      return {
        privateKey: false,
        clusterDefinition: false,
        depositData: false,
        clusterLock: false,
        validatorKeys: false,
        error: err,
      };
    }
  }

  async getObolENRPrivateKey() {
    try {
      let services = await this.serviceManager.readServiceConfigurations();
      let charonClient = services.find((service) => isObolDVTService(service.service));
      if (!charonClient) throw "Couldn't find an Obol DV middleware service";

      let result = await this.nodeConnection.sshService.exec(charonClient.getReadENRPrivateKeyCommand());
      if (SSHService.checkExecError(result) && result.stderr) throw SSHService.extractExecError(result);
      return result.stdout;
    } catch (err) {
      log.error("Error getting Obol ENR private key: ", err);
      return err;
    }
  }

  async getObolENRPublicKey() {
    try {
      let services = await this.serviceManager.readServiceConfigurations();
      let charonClient = services.find((service) => isObolDVTService(service.service));
      if (!charonClient) throw "Couldn't find an Obol DV middleware service";

      let result = await this.nodeConnection.sshService.exec(charonClient.getReadEnrCommand());
      if (SSHService.checkExecError(result) && result.stderr) throw SSHService.extractExecError(result);
      return result.stdout;
    } catch (err) {
      log.error("Error getting Obol ENR public key: ", err);
      return "";
    }
  }

  // removes the ENR Private Key and therefore also the Public one
  async removeObolENR() {
    try {
      let services = await this.serviceManager.readServiceConfigurations();
      let charonClient = services.find((service) => isObolDVTService(service.service));
      if (!charonClient) throw "Couldn't find an Obol DV middleware service";

      let result = await this.nodeConnection.sshService.exec(charonClient.getRemoveEnrCommand());
      if (SSHService.checkExecError(result) && result.stderr) throw SSHService.extractExecError(result);
      return true;
    } catch (err) {
      log.error("Error removing Obol ENR: ", err);
      return false;
    }
  }

  async removeObolCluster() {
    try {
      let services = await this.serviceManager.readServiceConfigurations();
      let charonClient = services.find((service) => isObolDVTService(service.service));
      if (!charonClient) throw "Couldn't find an Obol DV middleware service";

      let result = await this.nodeConnection.sshService.exec(charonClient.getNukeObolCommand());
      if (SSHService.checkExecError(result) && result.stderr) throw SSHService.extractExecError(result);
      return true;
    } catch (err) {
      log.error("Error removing all Obol Files: ", err);
      return false;
    }
  }

  async startObolDKG(input) {
    try {
      await this.nodeConnection.sshService.exec("docker rm -f dkg-container");
    } catch (e) {}

    try {
      let services = await this.serviceManager.readServiceConfigurations();
      let charonClient = services.find((service) => isObolDVTService(service.service));
      if (!charonClient) throw "Couldn't find an Obol DV middleware service";

      let contentResult = await this.nodeConnection.sshService.exec(charonClient.getListCharonFolderContentsCommand());
      if (SSHService.checkExecError(contentResult) && contentResult.stderr) throw SSHService.extractExecError(contentResult);
      const content = contentResult.stdout;
      const dkgCommand = charonClient.getDKGCommand(
        content.includes("cluster-definition.json") ? "" : input.match(/http(s)?:.*\/[0-9a-zA-z]*/)[0]
      );

      let result = await this.nodeConnection.sshService.exec(dkgCommand);
      if (SSHService.checkExecError(result) && result.stderr) throw SSHService.extractExecError(result);
      return true;
    } catch (err) {
      log.error("Error starting Obol DKG: ", err);
      return false;
    }
  }

  async checkObolDKG() {
    try {
      //get all names of running docker containers
      const result = await this.nodeConnection.sshService.exec("docker ps --format '{{.Names}}'");
      const containerNames = result.stdout.split("\n");
      if (containerNames.includes("dkg-container")) return true;
      return false;
    } catch (error) {
      log.error("Error checking Status of Obol DKG: ", error);
      return false;
    }
  }

  async getObolDKGLogs() {
    try {
      const result = await this.nodeConnection.sshService.exec("docker logs dkg-container");
      return result.stdout + result.stderr;
    } catch (error) {
      log.error("Error getting Obol DKG Logs: ", error);
      return "";
    }
  }

  async downloadObolBackup(localPath) {
    try {
      let services = await this.serviceManager.readServiceConfigurations();
      let charonClient = services.find((service) => isObolDVTService(service.service));
      if (!charonClient) throw "Couldn't find an Obol DV middleware service";
      const dataDir = path.posix.join(charonClient.getDataDir(), ".charon");
      const result = await this.nodeConnection.sshService.downloadDirectorySSH(dataDir, localPath);
      if (result) {
        log.info("Obol Backup downloaded to: ", localPath);
      }
    } catch (err) {
      log.error("Error downloading Obol Backup: ", err);
    }
  }

  async importObolBackup(localPath) {
    try {
      let services = await this.serviceManager.readServiceConfigurations();
      let charonClient = services.find((service) => isObolDVTService(service.service));
      if (!charonClient) throw "Couldn't find an Obol DV middleware service";
      const dataDir = path.posix.join(charonClient.getDataDir(), ".charon");
      await this.nodeConnection.sshService.exec(`rm -rf ${charonClient.getDataDir()}`);
      const result = await this.nodeConnection.sshService.uploadDirectorySSH(path.normalize(localPath), dataDir);
      if (result) {
        log.info("Obol Backup uploaded from: ", localPath);
      }
    } catch (err) {
      log.error("Error uploading Obol Backup: ", err);
    }
  }

  async getDVTKeys(serviceID) {
    const service = (await this.serviceManager.readServiceConfigurations()).find((s) => s.id === serviceID);
    if (!service) throw new Error(`Service with id ${serviceID} not found`);
    switch (service.service) {
      case "CharonService":
      case "PlutoService": {
        const result = await this.nodeConnection.sshService.exec(service.getReadClusterLockCommand());
        const clusterLock = JSON.parse(result.stdout);
        return clusterLock.distributed_validators;
      }
      case "SSVNetworkService": {
        const ssvConfig = await this.nodeConnection.getSSVTotalConfig(serviceID);
        //Get Operator ID
        const response = await axios.get(
          `https://api.ssv.network/api/v4/${service.network}/operators/public_key/` + ssvConfig.privateKeyFileData.publicKey
        );

        if (response.status !== 200 || !response?.data?.data?.id)
          throw new Error(
            `Couldn't get Operator ID from SSV Network ${response.status} ${response.statusText}${response?.data ? "\n" + JSON.stringify(response.data) : ""}`
          );
        const operatorID = response.data.data.id;

        //get pagination info
        let result = await axios.get(
          `https://api.ssv.network/api/v4/${service.network}/validators/in_operator/${operatorID}?page=${1}&perPage=100`
        );
        if (result.status !== 200) throw new Error(`Couldn't get Validator Keys from SSV Network ${result.status} ${result.statusText}`);

        //get all pages and concat them
        for (let i = 2; i <= result.data.pagination.pages; i++) {
          const page = await axios.get(
            `https://api.ssv.network/api/v4/${service.network}/validators/in_operator/${operatorID}?page=${i}&perPage=100`
          );
          if (page.status !== 200) throw new Error(`Couldn't get Validator Keys from SSV Network ${page.status} ${page.statusText}`);
          result.data.validators = result.data.validators.concat(page.data.validators);
        }

        return result.data.validators;
      }
      default:
        throw new Error(`Service ${service.service} not supported`);
    }
  }
}
