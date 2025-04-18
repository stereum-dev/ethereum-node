/**
 * @jest-environment node
 */
import { HetznerServer } from "../../HetznerServer.js";
import { NodeConnection } from "../../NodeConnection.js";
import { ValidatorAccountManager } from "../../ValidatorAccountManager.js";
import { ServiceManager } from "../../ServiceManager.js";
import { TaskManager } from "../../TaskManager.js";
const log = require("electron-log");

jest.setTimeout(1800000);

test("lighthouse validator import", async () => {
  const testServer = new HetznerServer();
  const keyResponse = await testServer.createSSHKey("Lighthouse--integration-test--ubuntu-2204");

  const serverSettings = {
    name: "Lighthouse--integration-test--ubuntu-2204",
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

  let geth = serviceManager.getService("GethService", { network: "holesky", installDir: "/opt/stereum" });

  let lhBC = serviceManager.getService("LighthouseBeaconService", {
    network: "holesky",
    installDir: "/opt/stereum",
    executionClients: [geth],
  });

  let lhVC = serviceManager.getService("LighthouseValidatorService", {
    network: "holesky",
    installDir: "/opt/stereum",
    consensusClients: [lhBC],
  });

  //get latest versions
  let versions = await nodeConnection.nodeUpdates.checkUpdates();
  geth.imageVersion = versions[geth.network][geth.service].slice(-1).pop();
  lhBC.imageVersion = versions[lhBC.network][lhBC.service].slice(-1).pop();
  lhVC.imageVersion = versions[lhVC.network][lhVC.service].slice(-1).pop();

  await nodeConnection.writeServiceConfiguration(geth.buildConfiguration()), await serviceManager.manageServiceState(geth.id, "started");

  //write configs for lighhouse BC and VC
  await nodeConnection.writeServiceConfiguration(lhBC.buildConfiguration());
  await nodeConnection.writeServiceConfiguration(lhVC.buildConfiguration());

  //start BC and VC
  await serviceManager.manageServiceState(lhBC.id, "started");
  await serviceManager.manageServiceState(lhVC.id, "started");

  //Waiting for the service to start properly
  await testServer.Sleep(360000);

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
  await validatorAccountManager.importKey(lhVC.id);

  //get logs
  let condition = false;
  let counter = 0;
  let VCstatus = "";
  let BCstatus = "";
  while (!condition && counter < 10) {
    await testServer.Sleep(30000);
    VCstatus = await await nodeConnection.sshService.exec(`docker logs stereum-${lhVC.id}`);
    BCstatus = await nodeConnection.sshService.exec(`docker logs stereum-${lhBC.id}`);
    if (
      /Block production enabled/.test(BCstatus.stderr) &&
      /Beacon chain initialized/.test(BCstatus.stderr) &&
      /HTTP API started/.test(BCstatus.stderr) &&
      /Metrics HTTP server started/.test(BCstatus.stderr) &&
      /Syncing /.test(BCstatus.stderr) &&
      /The execution endpoint is connected and configured, however it is not yet synced/.test(BCstatus.stderr) &&
      /Successfully loaded graffiti file/.test(VCstatus.stderr) &&
      /Starting validator client/.test(VCstatus.stderr) &&
      /Metrics HTTP server started/.test(VCstatus.stderr) &&
      /Successfully loaded graffiti file/.test(VCstatus.stderr) &&
      /Initialized beacon node connections/.test(VCstatus.stderr) &&
      /HTTP API started/.test(VCstatus.stderr) &&
      /Imported keystores via standard HTTP API, count: 3/.test(VCstatus.stderr) &&
      /Enabled validator/.test(VCstatus.stderr)
    ) {
      condition = true;
    }
    counter++;
  }

  const ufw = await nodeConnection.sshService.exec("ufw status");
  const docker = await nodeConnection.sshService.exec("docker ps");
  const api_token = await nodeConnection.sshService.exec(`cat /opt/stereum/lighthouse-${lhVC.id}/validator/validators/api-token.txt`);

  // destroy
  await testServer.finishTestGracefully(nodeConnection);

  //check ufw
  expect(ufw.stdout).toMatch(/9000\/tcp/);
  expect(ufw.stdout).toMatch(/9000\/udp/);
  expect(ufw.stdout).toMatch(/5052\/tcp/);
  expect(ufw.stdout).toMatch(/5062\/tcp/);

  //check for api_token file
  expect(api_token.stdout).toBeTruthy();

  //check docker container
  expect(docker.stdout).toMatch(/sigp\/lighthouse/);
  expect(docker.stdout).toMatch(/5052->5052/);
  expect(docker.stdout).toMatch(/5062->5062/);
  expect(docker.stdout).toMatch(/9000->9000/);
  if (![lhBC.id, lhVC.id].join("").includes("Up")) {
    expect((docker.stdout.match(new RegExp("Up", "g")) || []).length).toBe(3);
  }

  //check lighthouse BC logs
  expect(BCstatus.stderr).toMatch(/Block production enabled/);
  expect(BCstatus.stderr).toMatch(/Beacon chain initialized/);
  expect(BCstatus.stderr).toMatch(/HTTP API started/);
  expect(BCstatus.stderr).toMatch(/Metrics HTTP server started/);
  expect(BCstatus.stderr).toMatch(/Syncing/);
  expect(BCstatus.stderr).toMatch(/The execution endpoint is connected and configured, however it is not yet synced/);

  //check lighthouse VC logs
  expect(VCstatus.stderr).toMatch(/Successfully loaded graffiti file/);
  expect(VCstatus.stderr).toMatch(/Starting validator client/);
  expect(VCstatus.stderr).toMatch(/Metrics HTTP server started/);
  expect(VCstatus.stderr).toMatch(/Successfully loaded graffiti file/);
  expect(VCstatus.stderr).toMatch(/Initialized beacon node connections/);
  expect(VCstatus.stderr).toMatch(/HTTP API started/);
  expect(VCstatus.stderr).toMatch(/Imported keystores via standard HTTP API, count: 3/);
  expect(VCstatus.stderr).toMatch(/Enabled validator/);
});
