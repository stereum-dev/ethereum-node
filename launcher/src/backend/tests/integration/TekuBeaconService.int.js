/**
 * @jest-environment node
 */
import { HetznerServer } from "../../HetznerServer.js";
import { NodeConnection } from "../../NodeConnection.js";
import { ServiceManager } from "../../ServiceManager.js";
import { TaskManager } from "../../TaskManager.js";
import { ValidatorAccountManager } from "../../ValidatorAccountManager.js";
const log = require("electron-log");

jest.setTimeout(1800000);

test("teku validator import", async () => {
  const testServer = new HetznerServer();
  const keyResponse = await testServer.createSSHKey("Teku--integration-test--ubuntu-2204");

  const serverSettings = {
    name: "Teku--integration-test--ubuntu-2204",
    image: "ubuntu-22.04",
    server_type: "cpx31",
    start_after_create: true,
    ssh_keys: [keyResponse.ssh_key.id],
  };

  await testServer.create(serverSettings);
  log.info("Server started");

  const connectionParams = {
    host: testServer.serverIPv4,
    port: "22",
    user: "root",
    privateKey: testServer.sshKeyPair.private,
  };

  const nodeConnection = new NodeConnection(connectionParams);
  const taskManager = new TaskManager(nodeConnection);
  const serviceManager = new ServiceManager(nodeConnection);
  await testServer.checkServerConnection(nodeConnection);

  await nodeConnection.establish(taskManager);

  //prepare node
  await nodeConnection.sshService.exec(` mkdir /etc/stereum &&
      echo "stereum_settings:
      settings:
        controls_install_path: /opt/stereum
        os_user: stereum
        updates:
          lane: stable
          unattended:
            install: false
            interval_days: 7
            hour: 3
            min: 0
    " > /etc/stereum/stereum.yaml`);
  await nodeConnection.findStereumSettings();
  await nodeConnection.prepareStereumNode(nodeConnection.settings.stereum.settings.controls_install_path);

  //install geth
  let geth = serviceManager.getService("GethService", { network: "hoodi", installDir: "/opt/stereum" });

  //install tekuBC
  let tekuBC = serviceManager.getService("TekuBeaconService", { network: "hoodi", installDir: "/opt/stereum", executionClients: [geth] });

  //install tekuVC
  let tekuVC = serviceManager.getService("TekuValidatorService", {
    network: "hoodi",
    installDir: "/opt/stereum",
    consensusClients: [tekuBC],
  });

  let versions = await nodeConnection.nodeUpdates.checkUpdates();
  geth.imageVersion = versions[geth.network][geth.service].slice(-1).pop();
  tekuBC.imageVersion = versions[tekuBC.network][tekuBC.service].slice(-1).pop();
  tekuVC.imageVersion = versions[tekuVC.network][tekuVC.service].slice(-1).pop();

  //write config and start geth
  await nodeConnection.writeServiceConfiguration(geth.buildConfiguration());
  await serviceManager.manageServiceState(geth.id, "started");

  //write config and start nimbus
  await nodeConnection.writeServiceConfiguration(tekuBC.buildConfiguration());
  await nodeConnection.writeServiceConfiguration(tekuVC.buildConfiguration());
  await serviceManager.manageServiceState(tekuBC.id, "started");
  await serviceManager.manageServiceState(tekuVC.id, "started");

  //Waiting for the service to start properly
  await testServer.Sleep(60000);

  //import validator
  const validatorAccountManager = new ValidatorAccountManager(nodeConnection, serviceManager);
  validatorAccountManager.batches.push({
    keystores: [
      '{"crypto": {"kdf": {"function": "scrypt", "params": {"dklen": 32, "n": 262144, "r": 8, "p": 1, "salt": "de4b32f49572c01146afb11a82c326fdc03be6cf447983daf9eb7ec0f868a116"}, "message": ""}, "checksum": {"function": "sha256", "params": {}, "message": "1ccb24f0f1469ab56cc0147dae242aab59ff360177c8ec4f710966913da839b6"}, "cipher": {"function": "aes-128-ctr", "params": {"iv": "a24857026939492f49444679544cb6bb"}, "message": "b5d944adfb65e33873c5c1b809c3c15b558821f2829cd7e9da1df65d0b78fdb6"}}, "description": "", "pubkey": "acaa51756fb445b406c9e599f3f4bec991f7799c002619566ab1fa5b70445c62f1ac6561154ca5e49d7542dbe690b96b", "path": "m/12381/3600/0/0/0", "uuid": "1ea9ed13-e3bb-4555-99d9-c5e83ab9eb67", "version": 4}',
      '{"crypto": {"kdf": {"function": "scrypt", "params": {"dklen": 32, "n": 262144, "r": 8, "p": 1, "salt": "de4b32f49572c01146afb11a82c326fdc03be6cf447983daf9eb7ec0f868a116"}, "message": ""}, "checksum": {"function": "sha256", "params": {}, "message": "3691a02425a4607b86292313cc72e31d4866043034ee9cff0b7cab2096105269"}, "cipher": {"function": "aes-128-ctr", "params": {"iv": "a24857026939492f49444679544cb6bb"}, "message": "e8a184e9d70408acd33459c67632c7bb63cf9c58a175de2030f962da88a2eb4d"}}, "description": "", "pubkey": "82ed748ffbc23ee3b730577a81f4cd05fe7dba234b3de5efc31f53de67091de9631d8581d72892351dfad52b65e53fbf", "path": "m/12381/3600/1/0/0", "uuid": "f712f984-b926-4e90-a603-f3f14703bf4b", "version": 4}',
      '{"crypto": {"kdf": {"function": "scrypt", "params": {"dklen": 32, "n": 262144, "r": 8, "p": 1, "salt": "de4b32f49572c01146afb11a82c326fdc03be6cf447983daf9eb7ec0f868a116"}, "message": ""}, "checksum": {"function": "sha256", "params": {}, "message": "fa52987837af01ec48e2b21f2078acef3368983943751013758052e07dae841d"}, "cipher": {"function": "aes-128-ctr", "params": {"iv": "a24857026939492f49444679544cb6bb"}, "message": "8c055c8c504cd3ad20bcb1101431b2b1a506b1a4d0efdbd294d75c39c0f2268b"}}, "description": "", "pubkey": "948f092cb5b5cae121fdc14af0e4e5a90d03ab661266b700ded1c1ca4fd6f0a76f8dac187815409197bf036675571458", "path": "m/12381/3600/2/0/0", "uuid": "c7521eed-533a-4fd1-90b7-ad1aa0f24a2d", "version": 4}',
    ],
    passwords: ["MyTestPassword", "MyTestPassword", "MyTestPassword"],
  });
  const importResult = await validatorAccountManager.importKey(tekuVC.id);
  log.info(importResult);

  //get logs
  let condition = false;
  let counter = 0;
  let BCstatus = "";
  let VCstatus = "";
  while (!condition && counter < 10) {
    await testServer.Sleep(30000);
    BCstatus = await nodeConnection.sshService.exec(`docker logs stereum-${tekuBC.id}`);
    VCstatus = await nodeConnection.sshService.exec(`docker logs stereum-${tekuVC.id}`);
    if (
      /JWT secret loaded/.test(BCstatus.stdout) &&
      /Using execution engine at http:\/\/stereum-.{36}:8551/.test(BCstatus.stdout) &&
      /Starting metrics http service/.test(BCstatus.stdout) &&
      /Listening on http:\/\/.*:5051/.test(BCstatus.stdout) &&
      /Syncing started/.test(BCstatus.stdout) &&
      /Starting metrics http service/.test(VCstatus.stdout) &&
      /Listening on https:\/\/.*:5052/.test(VCstatus.stdout) &&
      /Successfully connected to beacon node event stream/.test(VCstatus.stdout) &&
      /Starting doppelganger detection for public keys: .{7}, .{7}, .{7}/.test(VCstatus.stdout)
    ) {
      condition = true;
    }
    counter++;
  }

  const dataDir = tekuVC
    .buildConfiguration()
    .volumes.find((volume) => volume.includes("data"))
    .split(":")[0];
  log.debug(dataDir);

  const ufw = await nodeConnection.sshService.exec("ufw status");
  const docker = await nodeConnection.sshService.exec("docker ps");
  const teku_api_keystore = await nodeConnection.sshService.exec(`cat ${dataDir}/teku_api_keystore`);
  const teku_api_password = await nodeConnection.sshService.exec(`cat ${dataDir}/teku_api_password.txt`);
  const validator_api_bearer = await nodeConnection.sshService.exec(`cat ${dataDir}/validator/key-manager/validator-api-bearer`);

  // destroy
  await testServer.finishTestGracefully(nodeConnection);

  //check ufw
  expect(ufw.stdout).toMatch(/9001\/tcp/);
  expect(ufw.stdout).toMatch(/9001\/udp/);
  expect(ufw.stdout).toMatch(/5052\/tcp/);
  expect(ufw.stdout).toMatch(/5051\/tcp/);

  //check teku API keystore, password & api bearer
  expect(teku_api_keystore.stdout).toBeTruthy();
  expect(teku_api_password.stdout).toBeTruthy();
  expect(validator_api_bearer.stdout).toBeTruthy();

  //teku tekuBC logs
  expect(BCstatus.stdout).toMatch(/JWT secret loaded/);
  expect(BCstatus.stdout).toMatch(/Using execution engine at http:\/\/stereum-.{36}:8551/);
  expect(BCstatus.stdout).toMatch(/Starting metrics http service/);
  expect(BCstatus.stdout).toMatch(/Listening on http:\/\/.*:5051/);
  expect(BCstatus.stdout).toMatch(/Syncing started/);

  //teku tekuVC logs
  expect(VCstatus.stdout).toMatch(/Starting metrics http service/);
  expect(VCstatus.stdout).toMatch(/Listening on https:\/\/.*:5052/);
  expect(VCstatus.stdout).toMatch(/Successfully connected to beacon node event stream/);
  expect(VCstatus.stdout).toMatch(/Starting doppelganger detection for public keys: .{7}, .{7}, .{7}/);

  //check docker container
  expect(docker.stdout).toMatch(/consensys\/teku/);
  expect(docker.stdout).toMatch(/5051-5052->5051-5052/);
  expect(docker.stdout).toMatch(/8008\/tcp/);
  expect(docker.stdout).toMatch(/9001->9001/);
  if (!tekuBC.id.includes("Up") && !tekuVC.id.includes("Up") && !geth.id.includes("Up")) {
    expect((docker.stdout.match(new RegExp("Up", "g")) || []).length).toBe(3);
  }
});

// EOF
