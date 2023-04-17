import { readFileSync } from "fs";
import { StringUtils } from "./StringUtils.js";
import YAML from "yaml";
import * as crypto from "crypto";
import { SSHService } from "./SSHService.js";
import { validatorPorts } from "./ethereum-services/ServicePort.js";
import { ServiceVolume } from "./ethereum-services/ServiceVolume.js";
import { networks } from "./ethereum-services/NodeService.js";

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

  createBatch(files, password, slashingDB) {
    // this function can be called both with or without "slashing_protection_content" ---> README & REMOVE ME!!!
    if (slashingDB) var slashing_protection_content = JSON.parse(readFileSync(slashingDB, { encoding: "utf8" }));
    const content = files.map((file) => {
      return readFileSync(file.path, { encoding: "utf8" });
    });
    const chunkSize = 100;
    for (let i = 0; i < content.length; i += chunkSize) {
      const contentChunk = content.slice(i, i + chunkSize);
      const passwords = Array(contentChunk.length).fill(password);
      this.batches.push({
        keystores: contentChunk,
        passwords: passwords,
        ...(slashing_protection_content && { slashing_protection: slashing_protection_content }),
      });
    }
  }

  async checkActiveValidators(files, password, serviceID, slashingDB) {
    this.batches = [];
    this.createBatch(files, password, slashingDB);
    let services = await this.serviceManager.readServiceConfigurations();
    let client = services.find((service) => service.id === serviceID);

    let pubkeys = this.batches.map((b) => b.keystores.map((c) => JSON.parse(c).pubkey)).flat();
    let isActiveRunning = [];

    if (pubkeys.length < 11) {
      try {
        for (const pubkey of pubkeys) {
          let latestEpochsResponse = await axios.get(
            networks[client.network].dataEndpoint + "/validator/" + pubkey + "/attestations"
          );
          if (
            latestEpochsResponse.status === 200 &&
            latestEpochsResponse.data.data.length > 0 &&
            latestEpochsResponse.data.status !== /ERROR:*/
          ) {
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

  async importKey(serviceID) {
    const ref = StringUtils.createRandomString();
    this.nodeConnection.taskManager.otherTasksHandler(
      ref,
      `Importing ${this.batches.map((b) => b.keystores).flat().length} Keys`
    );
    let services = await this.serviceManager.readServiceConfigurations();

    let client = services.find((service) => service.id === serviceID);
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

        if ((await this.nodeConnection.sshService.exec(`cat ${passwords_path}/wallet-password`)).rc === 1) {
          log.error("No Wallet found");
          log.info("Generating one");
          this.nodeConnection.taskManager.otherTasksHandler(
            ref,
            `Check Wallet`,
            true,
            "No Wallet found, generating one"
          );
          //generate wallet password
          await this.nodeConnection.sshService.exec(
            `echo ${StringUtils.createRandomString()} > ${passwords_path}/wallet-password`
          );
          await this.nodeConnection.sshService.exec(`chmod 700 ${passwords_path}/wallet-password`);
          await this.nodeConnection.sshService.exec(`chown 2000:2000 ${passwords_path}/wallet-password`);
          //Prysm - Create wallet for account(s)
          await this.nodeConnection.sshService.exec(
            `docker exec stereum-${client.id} /app/cmd/validator/validator wallet create --wallet-dir=/opt/app/data/wallets --wallet-password-file=/opt/app/data/passwords/wallet-password --accept-terms-of-use --keymanager-kind=direct --prater`
          );

          await this.nodeConnection.sshService.exec(`chown -R 2000:2000 ${wallet_path}`);

          await Promise.all([this.serviceManager.manageServiceState(client.id, "stopped")]);

          await Promise.all([this.serviceManager.manageServiceState(client.id, "started")]);
          await this.nodeConnection.sshService.exec(
            `chmod 600 ${wallet_path}/direct/accounts/all-accounts.keystore.json`
          );
          this.nodeConnection.taskManager.otherTasksHandler(
            ref,
            `Generated Wallet`,
            true,
            "Waiting 30 Seconds for Client"
          );
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
          await this.nodeConnection.sshService.exec(
            `echo ${StringUtils.createRandomString()} > ${validator_path}/api-token.txt`
          );
          await Sleep(180000);
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
    try {
      let data = [];
      const apiToken = await this.getApiToken(client);
      this.nodeConnection.taskManager.otherTasksHandler(ref, `Get API Token`, true);
      for (const batch of this.batches) {
        const returnVal = await this.keystoreAPI(client, "POST", batch, apiToken);
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

      let imported = 0;
      let duplicate = 0;
      let error = 0;
      let pubkeys = this.batches.map((b) => b.keystores.map((c) => JSON.parse(c).pubkey)).flat();
      let message = data
        .map((key, index) => {
          if (key.status === "imported") imported++;
          if (key.status === "duplicate") duplicate++;
          if (key.status === "error") error++;
          return (
            `${pubkeys[index].substring(0, 20)}...${pubkeys[index].substring(
              pubkeys[index].length - 6,
              pubkeys[index].length
            )}:\t${key.status}` + (key.status == "error" ? `:\n${key.message}\n` : "")
          );
        })
        .join("\n");
      this.nodeConnection.taskManager.otherTasksHandler(ref);
      return message + `\n${imported} key(s) imported...\n${duplicate} duplicate(s)...\n${error} import(s) failed...`;
    } catch (err) {
      log.info(ref);
      this.nodeConnection.taskManager.otherTasksHandler(
        ref,
        `Import Failed`,
        false,
        "Validator Import Failed:\n" + err
      );
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
      const result = await this.keystoreAPI(client);

      this.nodeConnection.taskManager.otherTasksHandler(ref, `Get Keys`, true, result.stdout);

      const data = JSON.parse(result.stdout);
      if (!data.data) data.data = [];
      await this.writeKeys(data.data.map((k) => k.validating_pubkey));

      this.nodeConnection.taskManager.otherTasksHandler(ref, `Write Keys to keys.yaml`, true);
      this.nodeConnection.taskManager.otherTasksHandler(ref);
      return data;
    } catch (err) {
      this.nodeConnection.taskManager.otherTasksHandler(
        ref,
        `Listing Keys Failed`,
        false,
        "Listing Validators Failed:\n" + err
      );
      this.nodeConnection.taskManager.otherTasksHandler(ref);
      log.error("Listing Validators Failed:\n", err);
      return err;
    }
  }

  async deleteValidators(serviceID, keys, picked) {
    const ref = StringUtils.createRandomString();
    this.nodeConnection.taskManager.otherTasksHandler(ref, `Deleting Keys`);
    try {
      let client = await this.nodeConnection.readServiceConfiguration(serviceID);
      const result = await this.keystoreAPI(client, "DELETE", { pubkeys: keys });

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
      this.nodeConnection.taskManager.otherTasksHandler(ref, `Delete Keys`, true, result.stdout);

      this.nodeConnection.taskManager.otherTasksHandler(ref);
      //Return slashing protection data
      if (picked)
        return data.slashing_protection;
      return data;
    } catch (err) {
      this.nodeConnection.taskManager.otherTasksHandler(
        ref,
        `Deleting Keys Failed`,
        false,
        "Deleting Validators Failed:\n" + err
      );
      this.nodeConnection.taskManager.otherTasksHandler(ref);
      log.error("Deleting Validators Failed:\n", err);
      return err;
    }
  }

  async keystoreAPI(service, method = "GET", data, apiToken) {
    if (!apiToken) apiToken = await this.getApiToken(service);
    let command = [
      "docker run --rm --network=stereum curlimages/curl",
      `curl ${service.service == "TekuBeaconService" ? "--insecure https" : "http"}://stereum-${service.id}:${validatorPorts[service.service]
      }/eth/v1/keystores`,
      `-X ${method.toUpperCase()}`,
      `-H 'Content-Type: application/json'`,
      `-H 'Authorization: Bearer ${apiToken}'`,
      `-s`,
    ];
    if (data) command.push(`-d '${JSON.stringify(data)}'`);
    return await this.nodeConnection.sshService.exec(command.join(" "));
  }

  async insertSSVNetworkKeys(service, sk) {
    try {
      const dataDir = service.config.volumes.find((vol) => vol.servicePath === "/data").destinationPath;
      let ssvConfig = (await this.nodeConnection.sshService.exec(`cat ${dataDir}/config.yaml`)).stdout;
      if (ssvConfig) {
        const escapedConfigFile = StringUtils.escapeStringForShell(
          ssvConfig.replace(/^OperatorPrivateKey.*/gm, 'OperatorPrivateKey: "' + sk + '"')
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
  // deactivated on the front end side
  async addFeeRecipient(keys, address) {
    if (keys && keys.length != 0 && address) {
      const serviceID = keys[0].validatorID;
      const validatorKeys = keys.map((key) => {
        return {
          pubkey: key.key,
          recipient: address,
        };
      });

      try {
        let run = await this.nodeConnection.runPlaybook("validator-fee-recipient-api", {
          stereum_role: "validator-fee-recipient-api",
          validator_service: serviceID,
          validator_keys: validatorKeys,
        });
        //let logs = new RegExp(/^DATA: ({"msg":.*)/, 'gm').exec(await this.nodeConnection.playbookStatus(run.playbookRunRef))
        //let result = (JSON.parse(logs[1])).msg
        return run;
      } catch (err) {
        log.error("Changing Fee Recipient Failed:\n", err);
        return err;
      }
    }
    return 0;
  }

  async getOperatorPageURL(pubKey) {
    const pubKeyHash = crypto.createHash("sha256").update(pubKey).digest("hex");
    return pubKeyHash;
  }

  async setGraffitis(graffiti) {
    let services = await this.serviceManager.readServiceConfigurations();
    let validators = await services.filter((service) => {
      if (
        service.service.includes("Teku") ||
        service.service.includes("Nimbus") ||
        service.service.includes("Validator")
      ) {
        return true;
      }
      return false;
    });

    for (let client of validators) {
      let service = client.service.replace(/(Beacon|Validator|Service)/gm, "").toLowerCase();

      const graffitiVolume = client.volumes.find((vol) => vol.servicePath === "/opt/app/graffitis");
      let graffitiDir = "";
      if (graffitiVolume) graffitiDir = graffitiVolume.destinationPath + "/graffitis.yaml";
      let config = "";
      switch (service) {
        case "lighthouse":
          config = `default: ${graffiti}`;
          await this.nodeConnection.sshService.exec(
            "echo " + StringUtils.escapeStringForShell(config) + " > " + graffitiDir
          );
          break;

        case "prysm":
          config = `default: "${graffiti}"`;
          await this.nodeConnection.sshService.exec(
            "echo " + StringUtils.escapeStringForShell(config) + " > " + graffitiDir
          );
          break;

        case "nimbus": {
          //Nimbus only supports Graffiti changes while running via their rest api
          let command = client.command.find((c) => c.includes("--rest-port="));
          let port = command.replace("--rest-port=", "");

          let CurlCommand = [
            "docker run --rm --network=stereum curlimages/curl",
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
          await this.nodeConnection.sshService.exec(
            "echo " + StringUtils.escapeStringForShell(config) + " > " + graffitiDir
          );
          break;

        default:
          break;
      }
    }
  }

  async writeKeys(keys) {
    let obj = keys;
    if (Array.isArray(keys)) {
      obj = {};
      const existing = await this.readKeys();
      keys.forEach((key) => {
        if (existing && existing[key]) {
          obj[key] = existing[key];
        } else {
          obj[key] = "";
        }
      });
    }
    await this.nodeConnection.sshService.exec(
      "echo -e " + StringUtils.escapeStringForShell(YAML.stringify(obj)) + " > /etc/stereum/keys.yaml"
    );
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
        let path = "";
        if (typeof service.volumes[0] == "string") {
          path = ServiceVolume.buildByConfig(
            service.volumes.find((v) => v.includes("/opt/app/data/wallets"))
          ).destinationPath;
        } else {
          path = service.volumes.find((v) => v.servicePath == "/opt/app/data/wallets").destinationPath;
        }
        //Make sure keystores have correct permissions
        const chmodResult = await this.nodeConnection.sshService.exec("chmod -Rv 600 " + path + "/direct/accounts/*")
        log.info(chmodResult.stdout)
        if (path) {
          result = await this.nodeConnection.sshService.exec("cat " + path + "/auth-token");
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
        result = await this.nodeConnection.sshService.exec(
          `docker exec -u 0 -w /opt/app/validators stereum-${service.id} cat api-token.txt`
        );
        break;
      case "TekuBeaconService":
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
        result = await this.nodeConnection.sshService.exec(
          `docker exec stereum-${service.id} curl -X POST http://localhost:9000/reload`
        );
        result.stdout = "";
        break;
    }

    if (SSHService.checkExecError(result)) {
      log.error(`Couldn't get API token for ${service.service}: ${SSHService.extractExecError(result)}`);
      return null;
    }
    return result.stdout.trim();
  }

  async exitValidator(pubkey, password, serviceID) {
    let services = await this.serviceManager.readServiceConfigurations();
    let client = services.find((service) => service.id === serviceID);
    let service = client.service.replace(/(Beacon|Validator|Service)/gm, "").toLowerCase();

    let beaconNodeID;
    if (service === "prysm" || service === "lighthouse" || service === "lodestar") {
      beaconNodeID = JSON.stringify(
        JSON.stringify(client.command).match(/[a-f0-9]{8}(?:-[a-f0-9]{4}){4}[a-f0-9]{8}/)
      ).replace(/['"[\]']/g, "");
    }

    let result;
    try {
      switch (service) {
        case "lighthouse": {
          await this.nodeConnection.sshService.exec(
            `docker exec stereum-${serviceID} sh -c "touch /opt/app/validator/validators/${pubkey}/exit_password.txt && echo "${password}" > /opt/app/validator/validators/${pubkey}/exit_password.txt"`
          );
          const exitLighthouseCmd = `docker exec stereum-${serviceID} sh -c "lighthouse account validator exit --keystore=/opt/app/validator/validators/${pubkey}/voting-keystore.json --password-file=/opt/app/validator/validators/${pubkey}/exit_password.txt --network=${client.network} --beacon-node=http://stereum-${beaconNodeID}:5052 --no-confirmation"`;
          result = await this.nodeConnection.sshService.exec(exitLighthouseCmd);
          await this.nodeConnection.sshService.exec(
            `docker exec stereum-${serviceID} sh -c "rm /opt/app/validator/validators/${pubkey}/exit_password.txt"`
          );
          break;
        }
        case "lodestar": {
          await this.nodeConnection.sshService.exec(
            `docker exec stereum-${serviceID} sh -c "touch /opt/app/validator/secrets/exit_password.txt && echo "${password}" > /opt/app/validator/secrets/exit_password.txt"`
          );
          const exitLodestarCmd = `docker exec -u 0 stereum-${serviceID} sh -c "node ./packages/cli/bin/lodestar validator voluntary-exit --dataDir=/opt/app/validator --keystore=/opt/app/validator/keystores --passphraseFile=/opt/app/validator/secrets/exit_password.txt --beaconNodes=http://stereum-${beaconNodeID}:9596 --pubkeys=${pubkey} --network=${client.network} --force=true --yes=true"`;
          result = await this.nodeConnection.sshService.exec(exitLodestarCmd);
          await this.nodeConnection.sshService.exec(
            `docker exec stereum-${serviceID} sh -c "rm /opt/app/validator/secrets/exit_password.txt"`
          );
          break;
        }
        case "nimbus": {
          const exitNimbusCmd = `docker exec -u 0 -it stereum-${serviceID} sh -c "/home/user/nimbus_beacon_node deposits exit --validator=/opt/app/validators/${pubkey}/keystore.json"`;
          let okToExit = false;
          let checkMessage = false;
          let counter = 0;
          result = { stdout: "", stderr: "" };
          await new Promise((resolve, reject) => {
            this.nodeConnection.sshService.conn.shell(function (err, stream) {
              stream.stdin.write(exitNimbusCmd + "\r\n")

              stream.stderr.on("data", (err) => {
                log.error(err);
                reject();
              });
              stream.stdout.on("data", (data) => {
                if (/Password:/.test(data)) {
                  okToExit = true;
                  stream.stdin.write(`${password}\r\n`);
                  counter++;
                  if (counter > 10) {
                    stream.end();
                    resolve()
                  }
                }
                if (/Your choice:/.test(data)) {
                  stream.stdin.write(`I understand the implications of submitting a voluntary exit\r\n`);
                  checkMessage = true;
                }
                if (/:~#/.test(data) && okToExit) {
                  stream.end();
                  resolve();
                }
                if (checkMessage) {
                  result.stdout += data.toString()
                }
              });
            });
          });
          break;
        }
        case "prysm": {
          await this.nodeConnection.sshService.exec(
            `touch /opt/stereum/prysm-${serviceID}/data/passwords/exit_password.txt && echo "${password}" > /opt/stereum/prysm-${serviceID}/data/passwords/exit_password.txt`
          );
          await this.nodeConnection.sshService.exec(
            `chown 2000:2000 /opt/stereum/prysm-${serviceID}/data/passwords/exit_password.txt && chmod 700 /opt/stereum/prysm-${serviceID}/data/passwords/exit_password.txt`
          );
          const exitPrysmCmd = `docker run -v /opt/stereum/prysm-${serviceID}/data/wallets:/wallets -v /opt/stereum/prysm-${serviceID}/data/passwords:/passwords --network=stereum gcr.io/prysmaticlabs/prysm/cmd/prysmctl:latest validator exit --wallet-dir=/wallets --wallet-password-file=/passwords/wallet-password --public-keys=${pubkey} --account-password-file=/passwords/exit_password.txt --beacon-rpc-provider=stereum-${beaconNodeID}:4000 --${client.network}=true --accept-terms-of-use=true --force-exit=true`;
          result = await this.nodeConnection.sshService.exec(exitPrysmCmd);
          await this.nodeConnection.sshService.exec(
            `rm /opt/stereum/prysm-${serviceID}/data/passwords/exit_password.txt`
          );
          break;
        }
        case "teku": {
          let noPrefixPubkey = pubkey.slice(2, 98);
          const exitTekuCmd = `docker exec stereum-${serviceID} sh -c "/opt/teku/bin/teku voluntary-exit --validator-keys=/opt/app/data/validator/key-manager/local/${noPrefixPubkey}.json:/opt/app/data/validator/key-manager/local-passwords/${noPrefixPubkey}.txt --confirmation-enabled=false"`;
          result = await this.nodeConnection.sshService.exec(exitTekuCmd);
          break;
        }
      }
      return result;
    } catch (err) {
      log.error("Validator Voluntary-Exit Failed:\n", err);
      return err;
    }
  }
}
