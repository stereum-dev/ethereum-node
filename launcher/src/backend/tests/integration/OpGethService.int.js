/**
 * @jest-environment node
 */
import { HetznerServer } from "../../HetznerServer.js";
import { NodeConnection } from "../../NodeConnection.js";
import { ServiceManager } from "../../ServiceManager.js";
import { TaskManager } from "../../TaskManager.js";
const log = require("electron-log");

jest.setTimeout(500000);

test("op-geth installation", async () => {
  const testServer = new HetznerServer();
  const keyResponse = await testServer.createSSHKey("OpGeth--integration-test--ubuntu-2204");

  const serverSettings = {
    name: "OpGeth--integration-test--ubuntu-2204",
    image: "ubuntu-22.04",
    server_type: "cpx21",
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

  //install besu
  let executionClient = serviceManager.getService("OpGethService", { network: "op-sepolia", installDir: "/opt/stereum" });

  //let versions = await nodeConnection.nodeUpdates.checkUpdates();
  //executionClient.imageVersion = versions[executionClient.network][executionClient.service].slice(-1).pop();
  executionClient.imageVersion = "latest";

  await nodeConnection.writeServiceConfiguration(executionClient.buildConfiguration());
  await serviceManager.manageServiceState(executionClient.id, "started");

  //get logs
  let condition = false;
  let counter = 0;
  let status = "";
  let completeStatus = "";
  while (!condition && counter < 10) {
    await testServer.Sleep(30000);
    status = await nodeConnection.sshService.exec(`docker logs stereum-${executionClient.id}`);
    completeStatus = status.stdout + status.stderr;

    if (
      /Starting geth on an OP network/.test(completeStatus) &&
      /Started P2P networking/.test(completeStatus) &&
      /HTTP server started/.test(completeStatus) &&
      /WebSocket enabled/.test(completeStatus) &&
      /Engine API enabled/.test(completeStatus) &&
      /Looking for peers/.test(completeStatus) &&
      /Starting metrics server/.test(completeStatus)
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
  expect(docker.stdout).toMatch(/oplabs-tools-artifacts\/images\/op-geth/);
  expect(docker.stdout).toMatch(/30303->30303/);
  if (!executionClient.id.includes("Up")) {
    expect((docker.stdout.match(new RegExp("Up", "g")) || []).length).toBe(1);
  }

  expect(completeStatus).toMatch(/Starting geth on an OP network/);
  expect(completeStatus).toMatch(/Started P2P networking/);
  expect(completeStatus).toMatch(/HTTP server started/);
  expect(completeStatus).toMatch(/WebSocket enabled/);
  expect(completeStatus).toMatch(/Engine API enabled/);
  expect(completeStatus).toMatch(/Looking for peers/);
  expect(completeStatus).toMatch(/Starting metrics server/);
});
