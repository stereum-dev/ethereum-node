/**
 * @jest-environment node
 */
import { HetznerServer } from "../../HetznerServer.js";
import { NodeConnection } from "../../NodeConnection.js";
//import { ValidatorAccountManager } from "../../ValidatorAccountManager.js";
import { ServiceManager } from "../../ServiceManager.js";
import { TaskManager } from "../../TaskManager.js";
const log = require("electron-log");

jest.setTimeout(1800000);

test("grandine consensus client", async () => {
  const testServer = new HetznerServer();
  const keyResponse = await testServer.createSSHKey("Grandine--integration-test--ubuntu-2204");

  const serverSettings = {
    name: "Grandine--integration-test--ubuntu-2204",
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

  let geth = serviceManager.getService("GethService", { network: "hoodi", installDir: "/opt/stereum" });

  let grandineBC = serviceManager.getService("GrandineBeaconService", {
    network: "hoodi",
    installDir: "/opt/stereum",
    executionClients: [geth],
  });

  //get latest versions
  let versions = await nodeConnection.nodeUpdates.checkUpdates();
  geth.imageVersion = versions[geth.network][geth.service].slice(-1).pop();
  grandineBC.imageVersion = versions[grandineBC.network][grandineBC.service].slice(-1).pop();

  await nodeConnection.writeServiceConfiguration(geth.buildConfiguration());
  await serviceManager.manageServiceState(geth.id, "started");

  //write configs for grandine BC
  await nodeConnection.writeServiceConfiguration(grandineBC.buildConfiguration());

  //start BC
  await serviceManager.manageServiceState(grandineBC.id, "started");

  //Waiting for the service to start properly
  await testServer.Sleep(30000);

  //get logs
  let condition = false;
  let counter = 0;
  let BCstatus = "";
  while (!condition && counter < 10) {
    await testServer.Sleep(30000);
    BCstatus = await nodeConnection.sshService.exec(`docker logs stereum-${grandineBC.id}`);
    if (
      /starting beacon node/.test(BCstatus.stdout) &&
      /genesis state loaded/.test(BCstatus.stdout) &&
      /metrics server is listening on 0.0.0.0:5054/.test(BCstatus.stdout) &&
      /HTTP server listening on 0.0.0.0:5052/.test(BCstatus.stdout)
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
  expect(ufw.stdout).toMatch(/9001\/udp/);
  expect(ufw.stdout).toMatch(/5052\/tcp/);

  //check docker container
  expect(docker.stdout).toMatch(/sifrai\/grandine/);
  expect(docker.stdout).toMatch(/5052->5052/);
  expect(docker.stdout).toMatch(/9000->9000/);
  expect(docker.stdout).toMatch(/9000-9001->9000-9001/);
  if (!grandineBC.id.includes("Up")) {
    expect((docker.stdout.match(new RegExp("Up", "g")) || []).length).toBe(2);
  }

  //check grandine BC logs
  expect(BCstatus.stdout).toMatch(/starting beacon node/);
  expect(BCstatus.stdout).toMatch(/genesis state loaded/);
  expect(BCstatus.stdout).toMatch(/metrics server is listening on 0.0.0.0:5054/);
  expect(BCstatus.stdout).toMatch(/HTTP server listening on 0.0.0.0:5052/);
});
