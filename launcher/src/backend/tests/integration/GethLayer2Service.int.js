/**
 * @jest-environment node
 */
import { HetznerServer } from "../../HetznerServer.js";
import { NodeConnection } from "../../NodeConnection.js";
import { ServiceManager } from "../../ServiceManager.js";
import { TaskManager } from "../../TaskManager.js";
const log = require("electron-log");

jest.setTimeout(500000);

test("l2geth installation", async () => {
  const testServer = new HetznerServer();
  const keyResponse = await testServer.createSSHKey("Layer2-Geth--integration-test--ubuntu-2204");

  const serverSettings = {
    name: "Layer2-Geth--integration-test--ubuntu-2204",
    image: "ubuntu-22.04",
    server_type: "cpx21",
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

  //install besu
  let executionClient = serviceManager.getService("L2GethService", { network: "op-mainnet", installDir: "/opt/stereum" });

  // let versions = await nodeConnection.nodeUpdates.checkUpdates();
  // executionClient.imageVersion = versions[executionClient.network][executionClient.service].slice(-1).pop();
  executionClient.imageVersion = "latest";

  await nodeConnection.writeServiceConfiguration(executionClient.buildConfiguration());
  await serviceManager.manageServiceState(executionClient.id, "started");

  //get logs
  let condition = false;
  let counter = 0;
  let status = "";
  let completeStatus = "";
  while (!condition && counter < 5) {
    await testServer.Sleep(30000);
    status = await nodeConnection.sshService.exec(`docker logs stereum-${executionClient.id}`);
    completeStatus = status.stdout + status.stderr;

    if (
      /Starting peer-to-peer node/.test(completeStatus) &&
      /Opened ancient database/.test(completeStatus) &&
      /Initialised chain configuration/.test(completeStatus) &&
      /Loaded most recent local header/.test(completeStatus) &&
      /Loaded most recent local full block/.test(completeStatus) &&
      /Loaded most recent local fast block/.test(completeStatus) &&
      /Started P2P networking/.test(completeStatus) &&
      /IPC endpoint opened/.test(completeStatus) &&
      /HTTP endpoint opened/.test(completeStatus)
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
  expect(ufw.stdout).toMatch(/30303\/tcp/);
  expect(ufw.stdout).toMatch(/30303\/udp/);

  //check docker container
  expect(docker.stdout).toMatch(/ethereumoptimism\/l2geth/);
  expect(docker.stdout).toMatch(/30303->30303/);
  if (!executionClient.id.includes("Up")) {
    expect((docker.stdout.match(new RegExp("Up", "g")) || []).length).toBe(1);
  }

  expect(completeStatus).toMatch(/Starting peer-to-peer node/);
  expect(completeStatus).toMatch(/Opened ancient database/);
  expect(completeStatus).toMatch(/Initialised chain configuration/);
  expect(completeStatus).toMatch(/Loaded most recent local header/);
  expect(completeStatus).toMatch(/Loaded most recent local full block/);
  expect(completeStatus).toMatch(/Loaded most recent local fast block/);
  expect(completeStatus).toMatch(/Started P2P networking/);
  expect(completeStatus).toMatch(/IPC endpoint opened/);
  expect(completeStatus).toMatch(/HTTP endpoint opened/);
});
