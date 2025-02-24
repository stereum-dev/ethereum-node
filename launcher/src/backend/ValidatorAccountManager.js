import { readFileSync } from "fs";
import { StringUtils } from "./StringUtils.js";
import YAML from "yaml";
import { SSHService } from "./SSHService.js";
import { validatorPorts } from "./ethereum-services/ServicePort.js";
import { ServiceVolume } from "./ethereum-services/ServiceVolume.js";
import { networks } from "./ethereum-services/NodeService.js";

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

  createBatch(files, passwordFiles, password, slashingDB, chunkSize = 100) {
    // this function can be called both with or without "slashing_protection_content" ---> README & REMOVE ME!!!
    if (slashingDB) var slashing_protection_content = JSON.parse(readFileSync(slashingDB, { encoding: "utf8" }));
    let passwords = Array(files.length).fill(password);
    const content = files.map((file, index) => {
      const passwordFile = passwordFiles.find((p) => path.basename(p.name, ".txt") === path.basename(file.name, ".json"));
      if (passwordFile) {
        passwords[index] = readFileSync(passwordFile.path, { encoding: "utf8" });
      }
      return readFileSync(file.path, { encoding: "utf8" });
    });
    //escape all passwords for shell
    passwords = passwords.map((p) => {
      let pass = p;
      if (pass.includes("\\")) pass = pass.replaceAll(/\\/g, "\\\\");
      // eslint-disable-next-line no-useless-escape
      if (pass.includes('"')) pass = pass.replaceAll(/"/g, `\"`);
      if (pass.includes("'")) pass = pass.replaceAll(/'/g, `'\\''`); // yes i tried to escape with \'
      return pass;
    });
    for (let i = 0; i < content.length; i += chunkSize) {
      const contentChunk = content.slice(i, i + chunkSize);
      const passwordChunk = passwords.slice(i, i + chunkSize);

      this.batches.push({
        keystores: contentChunk,
        passwords: passwordChunk,
        ...(slashing_protection_content && { slashing_protection: slashing_protection_content }),
      });
    }
  }

  async checkActiveValidators(files, passwordFiles, password, serviceID, slashingDB, isRemote = false) {
    let services = await this.serviceManager.readServiceConfigurations();
    let client = services.find((service) => service.id === serviceID);
    let pubkeys = [];
    if (isRemote) {
      pubkeys = files;
    } else {
      this.batches = [];
      this.createBatch(files, passwordFiles, password, slashingDB, isRemote ? 20 : 100);
      pubkeys = this.batches.map((b) => b.keystores.map((c) => JSON.parse(c).pubkey)).flat();
    }

    let isActiveRunning = [];

    if (pubkeys && pubkeys.length < 11) {
      try {
        for (const pubkey of pubkeys) {
          let latestEpochsResponse = await axios.get(networks[client.network].dataEndpoint + "/validator/" + pubkey + "/attestations");

          if (latestEpochsResponse.status === 200 && latestEpochsResponse.data.data.length > 0) {
            for (let i = 0; i < 2; i++) {
              if (latestEpochsResponse.data.data[i].status === 1 && isActiveRunning.indexOf(pubkey) === -1) {
                isActiveRunning.push(pubkey);
              }
            }
          }
        }
      } catch (err) {
        log.error("checking validator key(s) is failed:\n", err);
        return "Validator check error:\n" + err;
      }
    }
    return isActiveRunning;
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

  async listValidators(serviceID) {
    const ref = StringUtils.createRandomString();
    this.nodeConnection.taskManager.otherTasksHandler(ref, `Listing Keys`);
    try {
      let client = await this.nodeConnection.readServiceConfiguration(serviceID);
      let data = {};
      if (client.service === "CharonService" || client.service === "SSVNetworkService") {
        const keys = await this.getDVTKeys(serviceID);
        data.data = keys.map((dv) => {
          return {
            validating_pubkey: client.service === "CharonService" ? dv.distributed_public_key : "0x" + dv.public_key,
            derivation_path: "",
            readonly: false,
            dvt: true,
          };
        });
        //Push successful task
        this.nodeConnection.taskManager.otherTasksHandler(ref, `Get Keys`, true, JSON.stringify(data.data, null, 2));
      } else {
        const result = await this.keymanagerAPI(client, "GET", "/eth/v1/keystores");

        //Error handling
        if (SSHService.checkExecError(result) && result.stderr) throw SSHService.extractExecError(result);
        if (!result.stdout)
          throw `ReturnCode: ${result.rc}\nStderr: ${result.stderr}\nStdout: ${result.stdout}\nIs Your Consensus Client Running?`;

        data = JSON.parse(result.stdout);
        if (data.data === undefined) {
          if (data.code === undefined || data.message === undefined) {
            throw "Undexpected Error: " + result;
          }
          throw data.code + " " + data.message;
        }

        //Push successful task
        this.nodeConnection.taskManager.otherTasksHandler(ref, `Get Keys`, true, result.stdout);
      }

      if (!data.data) data.data = [];
      this.writeKeys(data.data.map((key) => key.validating_pubkey));

      this.nodeConnection.taskManager.otherTasksHandler(ref, `Write Keys to keys.yaml`, true);
      this.nodeConnection.taskManager.otherTasksHandler(ref);
      return data;
    } catch (err) {
      this.nodeConnection.taskManager.otherTasksHandler(ref, `Listing Keys Failed`, false, "Listing Validators Failed:\n" + err);
      this.nodeConnection.taskManager.otherTasksHandler(ref);
      log.error("Listing Validators Failed:\n", err);
      return { data: [] };
    }
  }

  async deleteValidators(serviceID, keys, picked) {
    const ref = StringUtils.createRandomString();
    this.nodeConnection.taskManager.otherTasksHandler(ref, `Deleting Keys`);
    try {
      let client = await this.nodeConnection.readServiceConfiguration(serviceID);
      const result = await this.keymanagerAPI(client, "DELETE", "/eth/v1/keystores", { pubkeys: keys });

      //Error handling
      if (result.rc === 52) throw "service ran out of memory";
      if (SSHService.checkExecError(result) && result.stderr) throw SSHService.extractExecError(result);
      const data = JSON.parse(result.stdout);
      if (data.data === undefined) {
        if (data.code === undefined || data.message === undefined) {
          throw "Undexpected Error: " + result;
        }
        throw data.code + " " + data.message;
      }

      //Push successful task
      this.nodeConnection.taskManager.otherTasksHandler(ref, `Delete Keys`, true, result.stdout);

      this.nodeConnection.taskManager.otherTasksHandler(ref);
      //Return slashing protection data
      if (picked) return data.slashing_protection;
      return data;
    } catch (err) {
      this.nodeConnection.taskManager.otherTasksHandler(ref, `Deleting Keys Failed`, false, "Deleting Validators Failed:\n" + err);
      this.nodeConnection.taskManager.otherTasksHandler(ref);
      log.error("Deleting Validators Failed:\n", err);
      return err;
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

  //Returns the Fee Recipient for a given PubKey
  async getFeeRecipient(serviceID, pubKey) {
    const ref = StringUtils.createRandomString(); //Create a random string to identify the task
    this.nodeConnection.taskManager.otherTasksHandler(ref, `Getting Fee Recipient`); //Push the task to the task manager
    try {
      let client = await this.nodeConnection.readServiceConfiguration(serviceID);
      const result = await this.keymanagerAPI(client, "GET", `/eth/v1/validator/${pubKey}/feerecipient`);

      //Error handling
      if (SSHService.checkExecError(result) && result.stderr) throw SSHService.extractExecError(result);
      log.info(result);
      const data = JSON.parse(result.stdout);
      if (data.data === undefined) {
        if (data.code === undefined || data.message === undefined) {
          throw "Undexpected Error: " + result;
        }
        throw data.code + " " + data.message;
      }

      //Push successful task
      this.nodeConnection.taskManager.otherTasksHandler(ref, `Get Fee Recipient`, true, result.stdout);
      this.nodeConnection.taskManager.otherTasksHandler(ref);

      return data;
    } catch (err) {
      this.nodeConnection.taskManager.otherTasksHandler(
        ref,
        `Getting Fee Recipient Failed`,
        false,
        `Getting Fee Recipient for ${pubKey} Failed:\n` + err
      );
      this.nodeConnection.taskManager.otherTasksHandler(ref);
      log.error("Getting Fee Recipient Failed:\n", err);
      return err;
    }
  }

  async setFeeRecipient(serviceID, pubKey, address) {
    const ref = StringUtils.createRandomString(); //Create a random string to identify the task
    this.nodeConnection.taskManager.otherTasksHandler(ref, `Setting Fee Recipient`); //Push the task to the task manager
    try {
      let client = await this.nodeConnection.readServiceConfiguration(serviceID);
      const result = await this.keymanagerAPI(client, "POST", `/eth/v1/validator/${pubKey}/feerecipient`, { ethaddress: address }, ["-i"]);

      //Error handling
      if (SSHService.checkExecError(result) && result.stderr) throw SSHService.extractExecError(result);
      if (!result.stdout.includes("202 Accepted")) {
        throw "Undexpected Error: " + result;
      }
      const data = result.stdout;

      //Push successful task
      this.nodeConnection.taskManager.otherTasksHandler(ref, `Set Fee Recipient`, true, result.stdout);
      this.nodeConnection.taskManager.otherTasksHandler(ref);
      return data;
    } catch (err) {
      this.nodeConnection.taskManager.otherTasksHandler(
        ref,
        `Setting Fee Recipient Failed`,
        false,
        `Setting Fee Recipient for ${pubKey} Failed:\n` + err
      );
      this.nodeConnection.taskManager.otherTasksHandler(ref);
      log.error("Setting Fee Recipient Failed:\n", err);
      return err;
    }
  }

  async deleteFeeRecipient(serviceID, pubKey) {
    const ref = StringUtils.createRandomString(); //Create a random string to identify the task
    this.nodeConnection.taskManager.otherTasksHandler(ref, `Deleting Fee Recipient`); //Push the task to the task manager
    try {
      let client = await this.nodeConnection.readServiceConfiguration(serviceID);
      const result = await this.keymanagerAPI(client, "DELETE", `/eth/v1/validator/${pubKey}/feerecipient`, null, ["-i"]);

      //Error handling
      if (SSHService.checkExecError(result) && result.stderr) throw SSHService.extractExecError(result);
      if (!result.stdout.includes("204 No Content")) {
        throw "Undexpected Error: " + result;
      }
      const data = result.stdout;

      //Push successful task
      this.nodeConnection.taskManager.otherTasksHandler(ref, `Delete Fee Recipient`, true, result.stdout);
      this.nodeConnection.taskManager.otherTasksHandler(ref);
      return data;
    } catch (err) {
      this.nodeConnection.taskManager.otherTasksHandler(
        ref,
        `Deleting Fee Recipient Failed`,
        false,
        `Deleting Fee Recipient for ${pubKey} Failed:\n` + err
      );
      this.nodeConnection.taskManager.otherTasksHandler(ref);
      log.error("Deleting Fee Recipient Failed:\n", err);
      return err;
    }
  }

  async setGraffitis(id, graffiti) {
    let services = await this.serviceManager.readServiceConfigurations();
    let client = services.find((service) => service.id === id);

    if (client) {
      let service = client.service.replace(/(Beacon|Validator|Service)/gm, "").toLowerCase();

      const graffitiVolume = client.volumes.find((vol) => vol.servicePath === "/opt/app/graffitis");
      let graffitiDir = "";
      if (graffitiVolume) graffitiDir = graffitiVolume.destinationPath + "/graffitis.yaml";
      let config = "";
      switch (service) {
        case "lighthouse":
          config = `default: ${graffiti}`;
          await this.nodeConnection.sshService.exec("echo " + StringUtils.escapeStringForShell(config) + " > " + graffitiDir);
          break;

        case "prysm":
          config = `default: "${graffiti}"`;
          await this.nodeConnection.sshService.exec("echo " + StringUtils.escapeStringForShell(config) + " > " + graffitiDir);
          break;

        case "nimbus": {
          //Nimbus only supports Graffiti changes while running via their rest api
          let command = client.command.find((c) => c.includes("--rest-port="));
          let port = command.replace("--rest-port=", "");
          const curlTag = await this.nodeConnection.ensureCurlImage();
          let CurlCommand = [
            "docker run --rm --network=stereum curlimages/curl:" + curlTag,
            `curl http://stereum-${client.id}:${port}/nimbus/v1/graffiti`,
            `-X POST`,
            `-H 'Content-Type: text/plain'`,
            `-d '${graffiti}'`,
            `-s`,
          ];
          await this.nodeConnection.sshService.exec(CurlCommand.join(" "));
          break;
        }

        case "teku":
          config = graffiti;
          await this.nodeConnection.sshService.exec("echo " + StringUtils.escapeStringForShell(config) + " > " + graffitiDir);
          break;

        default:
          break;
      }
    }
  }

  async writeKeys(keys) {
    //get current keys in yaml file
    let currentKeys = await this.readKeys();
    if (!currentKeys) {
      currentKeys = {};
    }

    //if the argument is an array of keys, add them to the current keys if they don't exist
    if (Array.isArray(keys)) {
      keys.forEach((key) => {
        if (!currentKeys[key]) currentKeys[key] = { keyName: "", groupName: "", groupID: null, validatorClientID: null };
      });
      await this.nodeConnection.sshService.exec(
        "echo -e " + StringUtils.escapeStringForShell(YAML.stringify(currentKeys)) + " > /etc/stereum/keys.yaml"
      );

      //if the argument is an object of keys, overwrite the current keys
    } else if (keys) {
      if (!keys.overwrite) {
        keys = { ...currentKeys, ...keys };
      }
      delete keys.overwrite;
      await this.nodeConnection.sshService.exec(
        "echo -e " + StringUtils.escapeStringForShell(YAML.stringify(keys)) + " > /etc/stereum/keys.yaml"
      );
    } else {
      log.error("INVALID ARGUMENT: keys must be an array or an object");
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
        let walletPath = "";
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

  async getExitValidatorMessage(pubkey, serviceID) {
    const ref = StringUtils.createRandomString(); //Create a random string to identify the task
    this.nodeConnection.taskManager.otherTasksHandler(ref, `Exit msg for ${pubkey?.substring(0, 6)}..`);
    try {
      let service = await this.nodeConnection.readServiceConfiguration(serviceID);
      const result = await this.keymanagerAPI(service, "POST", `/eth/v1/validator/${pubkey}/voluntary_exit`, []);
      if (SSHService.checkExecError(result) && result.stderr) throw SSHService.extractExecError(result);

      log.info(result);
      const data = JSON.parse(result.stdout);
      if (data.data === undefined) {
        if (data.code === undefined || data.message === undefined) {
          throw "Undexpected Error: " + result.stdout;
        }
        throw data.code + " " + data.message;
      }

      //Push successful task
      this.nodeConnection.taskManager.otherTasksHandler(ref, `Get signed voluntary exit message`, true, JSON.stringify(data));
      this.nodeConnection.taskManager.otherTasksHandler(ref);
      return data;
    } catch (error) {
      this.nodeConnection.taskManager.otherTasksHandler(
        ref,
        `Getting signed voluntary exit message Failed`,
        false,
        `Getting signed voluntary exit message ${pubkey} Failed:\n` + error
      );
      this.nodeConnection.taskManager.otherTasksHandler(ref);
      log.error("Getting signed voluntary exit message Failed:\n", error);
      return error;
    }
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

  async importRemoteKeys(serviceID, pubkeys, url) {
    //Init Task in TaskManager
    const ref = StringUtils.createRandomString();
    this.nodeConnection.taskManager.otherTasksHandler(ref, `Importing ${pubkeys.length} Remote Keys`);

    let services = await this.serviceManager.readServiceConfigurations();

    let client = services.find((service) => service.id === serviceID);
    await this.initWallet(client, ref);
    await this.addRemoteSignerTags(client, url);

    try {
      const args = pubkeys.map((key) => {
        return { pubkey: key, url: url };
      });
      const result = await this.keymanagerAPI(client, "POST", "/eth/v1/remotekeys", { remote_keys: args });

      //Error Handling
      if (SSHService.checkExecError(result) && result.stderr) throw SSHService.extractExecError(result);
      const response = JSON.parse(result.stdout);
      if (response.data === undefined) {
        if (response.code === undefined || response.message === undefined) {
          throw "Undexpected Error: " + result;
        }
        throw response.code + " " + response.message;
      }

      if (response.data.map((k) => k.status).includes("error")) {
        this.nodeConnection.taskManager.otherTasksHandler(
          ref,
          `${pubkeys.length} Rremote Keys Imported with errors`,
          false,
          JSON.stringify(response.data)
        );
      } else {
        this.nodeConnection.taskManager.otherTasksHandler(
          ref,
          `Batch with ${pubkeys.length} Remote Keys Imported`,
          true,
          JSON.stringify(response.data)
        );
      }

      const message = this.formatImportResult(pubkeys, response.data);
      this.nodeConnection.taskManager.otherTasksHandler(ref);
      return message;
    } catch (err) {
      this.nodeConnection.taskManager.otherTasksHandler(ref, `Remote Import Failed`, false, "Remote Validator Import Failed:\n" + err);
      this.nodeConnection.taskManager.otherTasksHandler(ref);
      log.error("Remote Validator Import Failed:\n", err);
      return "Remote Validator Import Failed:\n" + err;
    }
  }

  async listRemoteKeys(serviceID) {
    const ref = StringUtils.createRandomString();
    this.nodeConnection.taskManager.otherTasksHandler(ref, `Listing Remote Keys`);
    try {
      let client = await this.nodeConnection.readServiceConfiguration(serviceID);
      const result = await this.keymanagerAPI(client, "GET", "/eth/v1/remotekeys");

      this.nodeConnection.taskManager.otherTasksHandler(ref, `Get Remote Keys`, true, result.stdout);

      //Error handling
      if (SSHService.checkExecError(result) && result.stderr) throw SSHService.extractExecError(result);
      if (!result.stdout)
        throw `ReturnCode: ${result.rc}\nStderr: ${result.stderr}\nStdout: ${result.stdout}\nIs Your Consensus Client Running?`;

      const data = JSON.parse(result.stdout);
      if (data.data === undefined) {
        if (data.code === undefined || data.message === undefined) {
          throw "Undexpected Error: " + result;
        }
        throw data.code + " " + data.message;
      }
      if (!data.data) data.data = [];

      this.nodeConnection.taskManager.otherTasksHandler(ref);
      return data;
    } catch (err) {
      this.nodeConnection.taskManager.otherTasksHandler(
        ref,
        `Listing Remote Keys Failed`,
        false,
        "Listing Remote Validators Failed:\n" + err
      );
      this.nodeConnection.taskManager.otherTasksHandler(ref);
      log.error("Listing Remote Validators Failed:\n", err);
      return { data: [] };
    }
  }

  async deleteRemoteKeys(serviceID, pubkeys) {
    const ref = StringUtils.createRandomString();
    this.nodeConnection.taskManager.otherTasksHandler(ref, `Deleting Remote Keys`);
    try {
      let client = await this.nodeConnection.readServiceConfiguration(serviceID);
      const result = await this.keymanagerAPI(client, "DELETE", "/eth/v1/remotekeys", { pubkeys: pubkeys });

      //Error handling
      if (SSHService.checkExecError(result) && result.stderr) throw SSHService.extractExecError(result);
      const data = JSON.parse(result.stdout);
      if (data.data === undefined) {
        if (data.code === undefined || data.message === undefined) {
          throw "Undexpected Error: " + result;
        }
        throw data.code + " " + data.message;
      }

      //Push successful task
      this.nodeConnection.taskManager.otherTasksHandler(ref, `Delete Remote Keys`, true, result.stdout);

      this.nodeConnection.taskManager.otherTasksHandler(ref);

      return data;
    } catch (err) {
      this.nodeConnection.taskManager.otherTasksHandler(
        ref,
        `Deleting Remote Keys Failed`,
        false,
        "Deleting Remote Validators Failed:\n" + err
      );
      this.nodeConnection.taskManager.otherTasksHandler(ref);
      log.error("Deleting Remote Validators Failed:\n", err);
      return err;
    }
  }

  async checkRemoteKeys(url, serviceID) {
    try {
      // For local Web3Singer Instances (url is undefined and serviceID is defined)
      if (serviceID) {
        let services = await this.serviceManager.readServiceConfigurations();

        let client = services.find((service) => service.id === serviceID);
        let result = await this.keymanagerAPI(client, "GET", "/api/v1/eth2/publicKeys"); //returns an array of pubkeys that the signer is hodlding

        //Error handling
        if (SSHService.checkExecError(result) && result.stderr) throw SSHService.extractExecError(result);
        const data = JSON.parse(result.stdout);
        if (!Array.isArray(data)) {
          if (data.code === undefined || data.message === undefined) {
            throw "Undexpected Error: " + result;
          }
          throw data.code + " " + data.message;
        }

        return { keys: data, url: client.buildWeb3SignerHttpEndpointUrl() };
      }

      // For remote Web3Singer Instances (url is defined and serviceID is undefined)
      if (url) {
        const curlTag = await this.nodeConnection.ensureCurlImage();
        let CurlCommand = [
          "docker run --rm --network=stereum curlimages/curl:" + curlTag,
          `curl ${url}/api/v1/eth2/publicKeys`,
          `-X GET`,
          `-H 'Content-Type: application/json'`,
          `-s`,
        ];
        let result = await this.nodeConnection.sshService.exec(CurlCommand.join(" "));

        //Error handling
        if (SSHService.checkExecError(result) && result.stderr) throw SSHService.extractExecError(result);
        const data = JSON.parse(result.stdout);
        if (!Array.isArray(data)) {
          if (data.code === undefined || data.message === undefined) {
            throw "Undexpected Error: " + result;
          }
          throw data.code + " " + data.message;
        }

        return { keys: data, url: url };
      }
    } catch (err) {
      log.error("Error checking remote keys: ", err);
      return { error: err };
    }
  }

  async addRemoteSignerTags(client, url) {
    switch (client.service.replace(/(Beacon|Validator|Service)/gm, "")) {
      case "Prysm": {
        let command = structuredClone(client.command);

        let isString = false;
        let changed = false;
        if (typeof command === "string") {
          isString = true;
          command = command.replaceAll(/\n/gm, "").replaceAll(/\s\s+/gm, " ").split(" ");
        }

        let urlCommand = command.find((arg) => arg.includes("--validators-external-signer-url="));

        if (!urlCommand) {
          command.push(`--validators-external-signer-url=${url}`);
          changed = true;
        } else if (urlCommand && urlCommand !== `--validators-external-signer-url=${url}`) {
          command = command.filter((arg) => !arg.includes("--validators-external-signer-url="));
          command.push(`--validators-external-signer-url=${url}`);
          changed = true;
        }
        if (changed) {
          if (isString) command = command.join(" ").trim();
          client.command = command;
          await this.nodeConnection.writeServiceConfiguration(client.buildConfiguration());
          await this.serviceManager.manageServiceState(client.id, "stopped");
          await this.serviceManager.manageServiceState(client.id, "started");
          await Sleep(30000);
        }
        break;
      }
      case "Teku": {
        let command = structuredClone(client.command);
        let urlCommand = command.find((arg) => arg.includes("--validators-external-signer-url="));
        let changed = false;
        if (!urlCommand) {
          command.push(`--validators-external-signer-url=${url}`);
          changed = true;
        } else if (urlCommand && urlCommand !== `--validators-external-signer-url=${url}`) {
          command = command.filter((arg) => !arg.includes("--validators-external-signer-url="));
          command.push(`--validators-external-signer-url=${url}`);
          changed = true;
        }
        if (changed) {
          client.command = command;
          await this.nodeConnection.writeServiceConfiguration(client.buildConfiguration());
          await this.serviceManager.manageServiceState(client.id, "stopped");
          await this.serviceManager.manageServiceState(client.id, "started");
          await Sleep(30000);
        }
        break;
      }
      default:
        break;
    }
  }

  async createObolENR(privateKey = "") {
    try {
      let services = await this.serviceManager.readServiceConfigurations();
      let charonClient = services.find((service) => service.service === "CharonService");
      if (!charonClient) throw "Couldn't find CharonService";
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
      let charonClient = services.find((service) => service.service === "CharonService");
      if (!charonClient) throw "Couldn't find CharonService";

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
      let charonClient = services.find((service) => service.service === "CharonService");
      if (!charonClient) throw "Couldn't find CharonService";

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
      let charonClient = services.find((service) => service.service === "CharonService");
      if (!charonClient) throw "Couldn't find CharonService";

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
      let charonClient = services.find((service) => service.service === "CharonService");
      if (!charonClient) throw "Couldn't find CharonService";

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
      let charonClient = services.find((service) => service.service === "CharonService");
      if (!charonClient) throw "Couldn't find CharonService";

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
    } catch (e) {} // eslint-disable-next-line no-empty

    try {
      let services = await this.serviceManager.readServiceConfigurations();
      let charonClient = services.find((service) => service.service === "CharonService");
      if (!charonClient) throw "Couldn't find CharonService";

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
      let charonClient = services.find((service) => service.service === "CharonService");
      if (!charonClient) throw "Couldn't find CharonService";
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
      let charonClient = services.find((service) => service.service === "CharonService");
      if (!charonClient) throw "Couldn't find CharonService";
      const dataDir = path.posix.join(charonClient.getDataDir(), ".charon");
      await this.nodeConnection.sshService.exec(`rm -rf ${dataDir}`);
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
      case "CharonService": {
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
        if (response.status !== 200 && !response?.data?.data?.id)
          throw new Error(`Couldn't get Operator ID from SSV Network ${response.status} ${response.statusText}`);
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
