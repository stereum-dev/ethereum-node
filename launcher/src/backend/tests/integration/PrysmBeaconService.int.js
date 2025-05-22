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

test("prysm validator import", async () => {
  const testServer = new HetznerServer();
  const keyResponse = await testServer.createSSHKey("Prysm--integration-test--ubuntu-2204");

  const serverSettings = {
    name: "Prysm--integration-test--ubuntu-2204",
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
  // create stereum settings
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

  let prysmBC = serviceManager.getService("PrysmBeaconService", {
    network: "hoodi",
    installDir: "/opt/stereum",
    executionClients: [geth],
  });

  let prysmVC = serviceManager.getService("PrysmValidatorService", {
    network: "hoodi",
    installDir: "/opt/stereum",
    consensusClients: [prysmBC],
  });

  let versions = await nodeConnection.nodeUpdates.checkUpdates();
  geth.imageVersion = versions[geth.network][geth.service].slice(-1).pop();
  prysmBC.imageVersion = versions[prysmBC.network][prysmBC.service].slice(-1).pop();
  prysmVC.imageVersion = versions[prysmVC.network][prysmVC.service].slice(-1).pop();

  //write config and start geth
  await nodeConnection.writeServiceConfiguration(geth.buildConfiguration());
  await serviceManager.manageServiceState(geth.id, "started");

  //write config and start nimbus
  await nodeConnection.writeServiceConfiguration(prysmBC.buildConfiguration());
  await nodeConnection.writeServiceConfiguration(prysmVC.buildConfiguration());
  await serviceManager.manageServiceState(prysmBC.id, "started");
  await serviceManager.manageServiceState(prysmVC.id, "started");

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
  const importResult = await validatorAccountManager.importKey(prysmVC.id);
  log.info(importResult);

  await Promise.all([serviceManager.manageServiceState(prysmBC.id, "stopped"), serviceManager.manageServiceState(prysmVC.id, "stopped")]);

  await Promise.all([serviceManager.manageServiceState(prysmBC.id, "started"), serviceManager.manageServiceState(prysmVC.id, "started")]);

  //get logs
  let condition = false;
  let counter = 0;
  let VCstatus = "";
  let BCstatus = "";
  while (!condition && counter < 10) {
    await testServer.Sleep(30000);
    VCstatus = await nodeConnection.sshService.exec(`docker logs stereum-${prysmVC.id}`);
    BCstatus = await nodeConnection.sshService.exec(`docker logs stereum-${prysmBC.id}`);
    if (
      /Finished reading JWT secret/.test(BCstatus.stderr) &&
      /Starting beacon node/.test(BCstatus.stderr) &&
      /Starting initial chain sync/.test(BCstatus.stderr) &&
      /Connected peers/.test(BCstatus.stderr) &&
      /Connected to new endpoint/.test(BCstatus.stderr) &&
      /Beacon chain started/.test(VCstatus.stderr) &&
      /Waiting for beacon node to sync to latest chain head/.test(VCstatus.stderr)
    ) {
      condition = true;
    }
    counter++;
  }

  const wallet_path = prysmVC
    .buildConfiguration()
    .volumes.find((volume) => volume.includes("wallets"))
    .split(":")[0];
  log.debug(wallet_path);

  const passwords_path = prysmVC
    .buildConfiguration()
    .volumes.find((volume) => volume.includes("passwords"))
    .split(":")[0];
  log.debug(passwords_path);

  const ufw = await nodeConnection.sshService.exec("ufw status");
  const validatorAccounts = await nodeConnection.sshService.exec(`cat ${wallet_path}/direct/accounts/all-accounts.keystore.json`);
  const auth_token = await nodeConnection.sshService.exec(`cat ${wallet_path}/auth-token`);
  const docker = await nodeConnection.sshService.exec("docker ps");
  let responseValidator = await nodeConnection.sshService.exec(
    "docker exec stereum-" +
      prysmVC.id +
      " /app/cmd/validator/validator accounts list --wallet-dir=/opt/app/data/wallets --wallet-password-file=/opt/app/data/passwords/wallet-password --accept-terms-of-use"
  );
  const runningValidator = responseValidator.stdout.replace("\x1B[93m3\x1B[0m", "3"); //remove yellow color coding

  // destroy
  await testServer.finishTestGracefully(nodeConnection);

  //check ufw
  expect(ufw.stdout).toMatch(/13001\/tcp/);
  expect(ufw.stdout).toMatch(/12001\/udp/);
  expect(ufw.stdout).toMatch(/4000\/tcp/);
  expect(ufw.stdout).toMatch(/7500\/tcp/);

  // Wallet & auth-token
  expect(validatorAccounts.stdout).toBeTruthy();
  expect(auth_token.stdout).toBeTruthy();

  //check docker container
  expect(docker.stdout).toMatch(/prysmaticlabs\/prysm-validator/);
  expect(docker.stdout).toMatch(/prysmaticlabs\/prysm-beacon-chain/);
  expect(docker.stdout).toMatch(/7500->7500/);
  expect(docker.stdout).toMatch(/4000->4000/);
  expect(docker.stdout).toMatch(/12001->12001/);
  expect(docker.stdout).toMatch(/13001->13001/);
  if (![prysmBC.id, prysmVC.id, geth.id].join("").includes("Up")) {
    expect((docker.stdout.match(new RegExp("Up", "g")) || []).length).toBe(3);
  }

  //check prysm BC logs
  expect(BCstatus.stderr).toMatch(/Finished reading JWT secret/);
  expect(BCstatus.stderr).toMatch(/Starting beacon node/);
  expect(BCstatus.stderr).toMatch(/Starting initial chain sync/);
  expect(BCstatus.stderr).toMatch(/Connected peers/);
  expect(BCstatus.stderr).toMatch(/Connected to new endpoint/);

  //check prysm VC logs
  expect(VCstatus.stderr).toMatch(/Beacon chain started/);
  expect(VCstatus.stderr).toMatch(/Waiting for beacon node to sync to latest chain head/);
  expect(runningValidator).toMatch(/Showing .{1} validator accounts/);
});
