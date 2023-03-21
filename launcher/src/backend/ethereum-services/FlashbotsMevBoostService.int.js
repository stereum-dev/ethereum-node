/**
 * @jest-environment node
 */
import { HetznerServer } from "../HetznerServer.js";
import { NodeConnection } from "../NodeConnection.js";
import { ServiceManager } from "../ServiceManager.js";
import { FlashbotsMevBoostService } from "./FlashbotsMevBoostService.js";
const log = require("electron-log");

jest.setTimeout(600000);

test("mevboost installation", async () => {
  const serverSettings = {
    name: "Mevboost--integration-test--ubuntu-2204",
    image: "ubuntu-22.04",
    server_type: "cpx21",
    start_after_create: true,
  };

  const testServer = new HetznerServer();
  await testServer.create(serverSettings);
  log.info("Server started");

  const connectionParams = {
    host: testServer.serverIPv4,
    port: "22",
    username: "root",
    password: testServer.serverRootPassword,
    privatekey: undefined,
  };
  const nodeConnection = new NodeConnection(connectionParams);
  const serviceManager = new ServiceManager(nodeConnection);
  await testServer.connect(nodeConnection);

  //change password
  await testServer.passwordAuthentication(testServer.serverRootPassword);

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
  " > /etc/stereum/stereum.yaml`);
  await nodeConnection.findStereumSettings();
  await nodeConnection.prepareStereumNode(nodeConnection.settings.stereum.settings.controls_install_path);

  let mevboost = FlashbotsMevBoostService.buildByUserInput(
    "goerli",
    "https://0xafa4c6985aa049fb79dd37010438cfebeb0f2bd42b115b89dd678dab0670c1de38da0c4e9138c9290a398ecd9a0b3110@boost-relay-goerli.flashbots.net"
  );
  let versions = await nodeConnection.checkUpdates();
  mevboost.imageVersion = versions[mevboost.network][mevboost.service].slice(-1).pop();
  await nodeConnection.writeServiceConfiguration(mevboost.buildConfiguration());
  await serviceManager.manageServiceState(mevboost.id, "started");

  // mevboost logs
  //get logs
  let condition = false;
  let counter = 0;
  let status = "";
  while (!condition && counter < 10) {
    await testServer.Sleep(30000);
    status = await nodeConnection.sshService.exec(`docker logs stereum-${mevboost.id}`);
    if (
      /listening on 0.0.0.0:18550/.test(status.stdout) &&
      /using 1 relays/.test(status.stdout) &&
      !/Invalid relay URL/.test(status.stdout)
    ) {
      condition = true;
    }
    counter++;
  }
  const docker = await nodeConnection.sshService.exec("docker ps");

  // destroy
  await nodeConnection.destroyNode();
  await nodeConnection.sshService.disconnect();
  await testServer.destroy();

  //check docker container
  expect(docker.stdout).toMatch(/flashbots\/mev-boost/);
  expect(docker.stdout).toMatch(/18550\/tcp/);
  if (!mevboost.id.includes("Up")) {
    expect((docker.stdout.match(new RegExp("Up", "g")) || []).length).toBe(1);
  }

  // check if Mevboost service is running properly
  expect(status.stdout).toMatch(/listening on 0.0.0.0:18550/);
  expect(status.stdout).toMatch(/using 1 relays/);
  expect(status.stdout).not.toMatch(/Invalid relay URL/);
});
