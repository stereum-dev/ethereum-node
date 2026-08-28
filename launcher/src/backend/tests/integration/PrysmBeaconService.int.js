/**
 * @jest-environment node
 */
import { HetznerServer } from "../../HetznerServer.js";
import { NodeConnection } from "../../NodeConnection.js";
import { ServiceManager } from "../../ServiceManager.js";
import { TaskManager } from "../../TaskManager.js";
import { ValidatorAccountManager } from "../../ValidatorAccountManager.js";
import { StringUtils } from "../../StringUtils.js";
const log = require("electron-log");

jest.setTimeout(1800000);

test("prysm wallet generation", async () => {
  const testServer = new HetznerServer();
  const keyResponse = await testServer.createSSHKey("Prysm--integration-test--ubuntu-2604");

  const serverSettings = {
    name: "Prysm--integration-test--ubuntu-2604",
    image: "ubuntu-26.04",
    server_type: "cpx31",
    start_after_create: true,
    ssh_keys: [keyResponse.ssh_key.id],
    location: "hil",
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

  //generate the validator wallet, using the same function Stereum calls before importing keys
  const validatorAccountManager = new ValidatorAccountManager(nodeConnection, serviceManager);
  const services = await serviceManager.readServiceConfigurations();
  await validatorAccountManager.initWallet(
    services.find((service) => service.id === prysmVC.id),
    StringUtils.createRandomString()
  );

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
      /Prysm Beacon Chain started/.test(BCstatus.stderr) &&
      /Starting initial chain sync/.test(BCstatus.stderr) &&
      /Node started p2p server/.test(BCstatus.stderr) &&
      /Connected to new endpoint/.test(BCstatus.stderr) &&
      /Prysm Validator started/.test(VCstatus.stderr) &&
      /Opened validator wallet/.test(VCstatus.stderr)
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
  expect(BCstatus.stderr).toMatch(/Prysm Beacon Chain started/);
  expect(BCstatus.stderr).toMatch(/Starting initial chain sync/);
  expect(BCstatus.stderr).toMatch(/Node started p2p server/);
  expect(BCstatus.stderr).toMatch(/Connected to new endpoint/);

  //check prysm VC logs
  expect(VCstatus.stderr).toMatch(/Prysm Validator started/);
  expect(VCstatus.stderr).toMatch(/Opened validator wallet/);
});
