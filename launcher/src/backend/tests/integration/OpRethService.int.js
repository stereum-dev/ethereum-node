/**
 * @jest-environment node
 */
import { HetznerServer } from "../../HetznerServer.js";
import { NodeConnection } from "../../NodeConnection.js";
import { ServiceManager } from "../../ServiceManager.js";
import { TaskManager } from "../../TaskManager.js";
const log = require("electron-log");

jest.setTimeout(500000);

test("op-reth installation", async () => {
  const testServer = new HetznerServer();
  const keyResponse = await testServer.createSSHKey("OpReth--integration-test--ubuntu-2204");

  const serverSettings = {
    name: "OpReth--integration-test--ubuntu-2204",
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
  let executionClient = serviceManager.getService("OpRethService", { network: "optimism-sepolia", installDir: "/opt/stereum" });

  let versions = await nodeConnection.nodeUpdates.checkUpdates();
  executionClient.imageVersion = versions[executionClient.network][executionClient.service].slice(-1).pop();

  await nodeConnection.writeServiceConfiguration(executionClient.buildConfiguration());
  await serviceManager.manageServiceState(executionClient.id, "started");

  //get logs
  let condition = false;
  let counter = 0;
  let status = "";
  while (!condition && counter < 10) {
    await testServer.Sleep(30000);
    status = await nodeConnection.sshService.exec(`docker logs stereum-${executionClient.id}`);
    if (
      /Launching node/.test(status.stdout) &&
      /Database opened/.test(status.stdout) &&
      /Transaction pool initialized/.test(status.stdout) &&
      /P2P networking initialized/.test(status.stdout) &&
      /Consensus engine initialized/.test(status.stdout) &&
      /Engine API handler initialized/.test(status.stdout) &&
      /RPC auth server started/.test(status.stdout) &&
      /RPC HTTP server started/.test(status.stdout) &&
      /RPC WS server started/.test(status.stdout) &&
      /RPC IPC server started/.test(status.stdout) &&
      /Status connected_peers/.test(status.stdout)
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
  expect(docker.stdout).toMatch(/ghcr.io\/paradigmxyz\/op-reth/);
  expect(docker.stdout).toMatch(/30303->30303/);
  if (!executionClient.id.includes("Up")) {
    expect((docker.stdout.match(new RegExp("Up", "g")) || []).length).toBe(1);
  }

  expect(status.stdout).toMatch(/Launching node/);
  expect(status.stdout).toMatch(/Database opened/);
  expect(status.stdout).toMatch(/Transaction pool initialized/);
  expect(status.stdout).toMatch(/P2P networking initialized/);
  expect(status.stdout).toMatch(/Consensus engine initialized/);
  expect(status.stdout).toMatch(/Engine API handler initialized/);
  expect(status.stdout).toMatch(/RPC auth server started/);
  expect(status.stdout).toMatch(/RPC HTTP server started/);
  expect(status.stdout).toMatch(/RPC WS server started/);
  expect(status.stdout).toMatch(/RPC IPC server started/);
  expect(status.stdout).toMatch(/Status connected_peers/);
});
