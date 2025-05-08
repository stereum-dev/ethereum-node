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

test("nimbus validator import", async () => {
  //create server
  const testServer = new HetznerServer();
  const keyResponse = await testServer.createSSHKey("Nimbus--integration-test--ubuntu-2204");

  const serverSettings = {
    name: "Nimbus--integration-test--ubuntu-2204",
    image: "ubuntu-22.04",
    server_type: "cpx31",
    start_after_create: true,
    ssh_keys: [keyResponse.ssh_key.id],
  };

  await testServer.create(serverSettings);
  log.info("server started");

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
  let geth = serviceManager.getService("GethService", { network: "holesky", installDir: "/opt/stereum" });

  //install nimbus
  let nimbusBC = serviceManager.getService("NimbusBeaconService", {
    network: "holesky",
    installDir: "/opt/stereum",
    executionClients: [geth],
  });

  let nimbusVC = serviceManager.getService("NimbusValidatorService", {
    network: "holesky",
    installDir: "/opt/stereum",
    consensusClients: [nimbusBC],
  });

  let versions = await nodeConnection.nodeUpdates.checkUpdates();
  geth.imageVersion = versions[geth.network][geth.service].slice(-1).pop();
  nimbusBC.imageVersion = versions[nimbusBC.network][nimbusBC.service].slice(-1).pop();
  nimbusVC.imageVersion = versions[nimbusVC.network][nimbusVC.service].slice(-1).pop();

  //write config and start geth
  await nodeConnection.writeServiceConfiguration(geth.buildConfiguration());
  await serviceManager.manageServiceState(geth.id, "started");

  //write config and start nimbus
  await nodeConnection.writeServiceConfiguration(nimbusBC.buildConfiguration());
  await nodeConnection.writeServiceConfiguration(nimbusVC.buildConfiguration());
  await serviceManager.manageServiceState(nimbusBC.id, "started");
  await serviceManager.manageServiceState(nimbusVC.id, "started");

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
  await validatorAccountManager.importKey(nimbusVC.id);

  //get logs
  let condition = false;
  let counter = 0;
  let BCstatus = "";
  let VCstatus = "";
  while (!condition && counter < 10) {
    await testServer.Sleep(30000);
    BCstatus = await nodeConnection.sshService.exec(`docker logs stereum-${nimbusBC.id}`);
    VCstatus = await nodeConnection.sshService.exec(`docker logs stereum-${nimbusVC.id}`);
    if (
      /Starting beacon node/.test(BCstatus.stdout) &&
      /Listening to incoming network requests/.test(BCstatus.stdout) &&
      /REST service started/.test(BCstatus.stdout) &&
      /Slot start/.test(BCstatus.stdout) &&
      /Beacon node is online/.test(VCstatus.stdout) &&
      /Beacon node is compatible/.test(VCstatus.stdout) &&
      /Local validator attached/.test(VCstatus.stdout) &&
      /REST service started/.test(VCstatus.stdout) &&
      /Slot start/.test(VCstatus.stdout)
    ) {
      condition = true;
    }
    counter++;
  }
  const ufw = await nodeConnection.sshService.exec("ufw status");
  const docker = await nodeConnection.sshService.exec("docker ps");

  // destroy
  await testServer.finishTestGracefully(nodeConnection);

  //check ufw
  expect(ufw.stdout).toMatch(/9000\/tcp/);
  expect(ufw.stdout).toMatch(/9000\/udp/);
  expect(ufw.stdout).toMatch(/5052\/tcp/);

  //check docker container
  expect(docker.stdout).toMatch(/statusim\/nimbus-eth2/);
  expect(docker.stdout).toMatch(/statusim\/nimbus-validator-client/);
  expect(docker.stdout).toMatch(/5052->5052/);
  expect(docker.stdout).toMatch(/9000->9000/);
  if (!nimbusBC.id.includes("Up") && !nimbusVC.id.includes("Up") && !geth.id.includes("Up")) {
    expect((docker.stdout.match(new RegExp("Up", "g")) || []).length).toBe(3);
  }

  //check nimbus service logs
  expect(BCstatus.stdout).toMatch(/Starting beacon node/);
  expect(BCstatus.stdout).toMatch(/Listening to incoming network requests/);
  expect(BCstatus.stdout).toMatch(/REST service started/);
  expect(BCstatus.stdout).toMatch(/Slot start/);

  expect(VCstatus.stdout).toMatch(/Beacon node is online/);
  expect(VCstatus.stdout).toMatch(/Beacon node is compatible/);
  expect(VCstatus.stdout).toMatch(/Local validator attached/);
  expect(VCstatus.stdout).toMatch(/REST service started/);
  expect(VCstatus.stdout).toMatch(/Slot start/);
});
