/**
 * @jest-environment node
 */
import { HetznerServer } from "../../HetznerServer.js";
import { NodeConnection } from "../../NodeConnection.js";
import { ServiceManager } from "../../ServiceManager.js";
import { TaskManager } from "../../TaskManager.js";
const log = require("electron-log");

jest.setTimeout(500000);

test("nethermind installationm", async () => {
  const testServer = new HetznerServer();
  const keyResponse = await testServer.createSSHKey("Nethermind--integration-test--ubuntu-2204");

  const serverSettings = {
    name: "Nethermind--integration-test--ubuntu-2204",
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

  //install nethermind
  let executionClient = serviceManager.getService("NethermindService", { network: "hoodi", installDir: "/opt/stereum" });

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
      /Initialization Completed/.test(status.stdout) &&
      /Peers/.test(status.stdout) &&
      /http:\/\/0\.0\.0\.0:8545/.test(status.stdout) &&
      /http:\/\/0\.0\.0\.0:8546/.test(status.stdout) &&
      /http:\/\/0\.0\.0\.0:8551/.test(status.stdout)
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
  expect(docker.stdout).toMatch(/nethermind\/nethermind/);
  expect(docker.stdout).toMatch(/30303->30303/);
  if (!executionClient.id.includes("Up")) {
    expect((docker.stdout.match(new RegExp("Up", "g")) || []).length).toBe(1);
  }

  expect(status.stdout).toMatch(/Initialization Completed/);
  expect(status.stdout).toMatch(/Peers/);
  expect(status.stdout).toMatch(/http:\/\/0\.0\.0\.0:8545/);
  expect(status.stdout).toMatch(/http:\/\/0\.0\.0\.0:8546/);
  expect(status.stdout).toMatch(/http:\/\/0\.0\.0\.0:8551/);
});
