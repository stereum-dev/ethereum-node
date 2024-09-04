/**
 * @jest-environment node
 */
import { NodeConnection } from "../../NodeConnection";
import { nodeOS } from "../../NodeOS";
import { TaskManager } from "../../TaskManager";
import { HetznerServer } from "../../HetznerServer";
const log = require("electron-log");

jest.setTimeout(500000);

test("prepareStereumNode on ubuntu", async () => {
  const testServer = new HetznerServer();
  const keyResponse = await testServer.createSSHKey("NodeConnection--integration-test--ubuntu-2204");

  const serverSettings = {
    name: "NodeConnection--integration-test--ubuntu-2204",
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
  await testServer.checkServerConnection(nodeConnection);

  await nodeConnection.establish(taskManager);

  await nodeConnection.findOS();

  // create stereum settings
  await nodeConnection.sshService.exec(` mkdir /etc/stereum &&
    echo "stereum_settings:
    settings:
      controls_install_path: /opt/stereum
      updates:
        lane: stable
        unattended:
          install: false
  " > /etc/stereum/stereum.yaml`);
  await nodeConnection.findStereumSettings();

  const playbookRun = await nodeConnection.prepareStereumNode("/opt/stereum");
  const ansibleRoles = await nodeConnection.sshService.exec("ls /opt/stereum/ansible/controls");
  const ansibleVersion = await nodeConnection.sshService.exec("ansible --version");

  await testServer.finishTestGracefully(nodeConnection);

  const ansible = ansibleVersion.stdout.split("\n")[0].split(" ");
  ansible[2] = ansible[2].split(".");

  // check if findOS() works
  expect(nodeConnection.os).toBe(nodeOS.ubuntu);

  // check if findStereumSettings() works
  expect(nodeConnection.settings).toBeDefined();

  // check if playbook setup was run
  expect(playbookRun[0]).toHaveProperty("playbook", "setup");
  expect(playbookRun[0]).toHaveProperty("playbookRunRef");
  expect(playbookRun[1]).toHaveProperty("playbook", "configure-firewall");
  expect(playbookRun[1]).toHaveProperty("playbookRunRef");

  // check if ansible roles got pulled from repo
  expect(ansibleRoles.stdout).toMatch(/roles/);

  // check ansible version
  expect(ansible[0]).toBe("ansible");
  expect(ansible[1]).toMatch(/core/);
  expect(ansible[2][0]).toMatch(/[0-9]+/);
  expect(ansible[2][1]).toMatch(/[0-9]+/);
  expect(ansible[2][2]).toMatch(/[0-9]+/);
});

// EOF
