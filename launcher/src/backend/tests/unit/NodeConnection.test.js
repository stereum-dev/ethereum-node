import { NodeConnection } from "../../NodeConnection";
import { TaskManager } from "../../TaskManager";
import { nodeOS } from "../../NodeOS";
const log = require("electron-log");
jest.setTimeout(10000);

test("findOS Ubuntu", () => {
  jest.mock("../../SSHService");
  const SSHService = require("../../SSHService");
  const mMock = jest.fn(() => {
    return { rc: 0, stdout: "DISTRIB_ID=Ubuntu" };
  });
  SSHService.SSHService.mockImplementation(() => {
    return {
      exec: mMock,
    };
  });

  const nodeConnection = new NodeConnection(null);
  nodeConnection.taskManager = new TaskManager();
  nodeConnection.sshService = new SSHService.SSHService();

  nodeConnection.findOS();

  expect(nodeConnection.os == nodeOS.ubuntu);
});

test("findOS CentOS", () => {
  jest.mock("../../SSHService");
  const SSHService = require("../../SSHService");
  const mMock = jest.fn(() => {
    return { rc: 0, stdout: 'NAME="CentOS Linux"' };
  });
  SSHService.SSHService.mockImplementation(() => {
    return {
      exec: mMock,
    };
  });

  const nodeConnection = new NodeConnection(null);
  nodeConnection.taskManager = new TaskManager();
  nodeConnection.sshService = new SSHService.SSHService();

  nodeConnection.findOS();

  expect(nodeConnection.os == nodeOS.centos);
});

test("findStereumSettings", async () => {
  jest.mock("../../SSHService");
  const SSHService = require("../../SSHService");
  const mMock = jest.fn(() => {
    return {
      rc: 0,
      stdout: `stereum_settings:
  settings:
    controls_install_path: /opt/stereum/mock
    updates:
      in_progress:
      lane: stable_mock
      available:
      unattended:
        check: true
        install: false
        `,
    };
  });
  SSHService.SSHService.mockImplementation(() => {
    return {
      exec: mMock,
    };
  });

  const nodeConnection = new NodeConnection(null);
  nodeConnection.taskManager = new TaskManager();
  nodeConnection.sshService = new SSHService.SSHService();

  await nodeConnection.findStereumSettings();

  expect(nodeConnection.settings.stereum.settings.controls_install_path).toMatch(/\/opt\/stereum\/mock/);
});

test("findStereumSettings failure", async () => {
  jest.mock("../../SSHService");
  const SSHService = require("../../SSHService");
  const mMock = jest.fn(() => {
    return {
      rc: 1,
      stdout: `stereum:
  settings:
    controls_install_path: /opt/stereum/mock
    updates:
      in_progress:
      lane: stable_mock
      available:
      unattended:
        check: true
        install: false`,
    };
  });
  SSHService.SSHService.mockImplementation(() => {
    return {
      exec: mMock,
    };
  });

  const nodeConnection = new NodeConnection(null);
  nodeConnection.taskManager = new TaskManager();
  nodeConnection.sshService = new SSHService.SSHService();

  await nodeConnection.findStereumSettings();

  expect(nodeConnection.settings).toBeNull();
});

test("prepareStereumNode failure ubuntu installpkg", async () => {
  jest.mock("../../SSHService");
  const SSHService = require("../../SSHService");
  const mMock = jest.fn();
  mMock.mockReturnValueOnce({ rc: 0, stdout: "ubuntu" }).mockReturnValueOnce({ rc: 1, stderr: "error1234" });
  SSHService.SSHService.mockImplementation(() => {
    return {
      exec: mMock,
    };
  });

  const nodeConnection = new NodeConnection(null);
  nodeConnection.taskManager = new TaskManager();
  nodeConnection.sshService = new SSHService.SSHService();

  await nodeConnection.prepareStereumNode("/opt/stereum/bar").catch((e) => {
    expect(e).toEqual(new Error("Can't install os packages: error1234"));
  });

  expect(mMock.mock.calls.length).toBe(2);
  expect(mMock.mock.calls[1][0]).toMatch(/apt/);
});

test("prepareStereumNode error ubuntu installpkg", async () => {
  jest.mock("../../SSHService");
  const SSHService = require("../../SSHService");
  const mMock = jest.fn();
  mMock.mockReturnValueOnce({ rc: 0, stdout: "ubuntu" }).mockRejectedValue("foobar");
  SSHService.SSHService.mockImplementation(() => {
    return {
      exec: mMock,
    };
  });

  const nodeConnection = new NodeConnection(null);
  nodeConnection.taskManager = new TaskManager();
  nodeConnection.sshService = new SSHService.SSHService();

  await nodeConnection.prepareStereumNode("/opt/stereum/bar").catch((e) => {
    expect(e).toEqual(new Error("Can't install os packages: foobar"));
  });

  expect(mMock.mock.calls.length).toBe(2);
  expect(mMock.mock.calls[1][0]).toMatch(/apt/);
});

test("prepareStereumNode failure ubuntu unsupported os", async () => {
  jest.mock("../../SSHService");
  const SSHService = require("../../SSHService");
  const mMock = jest.fn();
  mMock.mockReturnValueOnce({ rc: 0, stdout: "blah" });
  SSHService.SSHService.mockImplementation(() => {
    return {
      exec: mMock,
    };
  });

  const nodeConnection = new NodeConnection(null);
  nodeConnection.taskManager = new TaskManager();
  nodeConnection.sshService = new SSHService.SSHService();

  await nodeConnection.prepareStereumNode("/opt/stereum/bar").catch((e) => {
    expect(e).toEqual(new Error("unsupported OS"));
  });

  expect(mMock.mock.calls.length).toBe(1);
});

test("prepareStereumNode failure ubuntu install", async () => {
  jest.mock("../../SSHService");
  const SSHService = require("../../SSHService");
  const mMock = jest.fn();
  mMock
    .mockReturnValueOnce({ rc: 0, stdout: "ubuntu" }) // find OS
    .mockReturnValueOnce({ rc: 0 }) // install pkg
    .mockReturnValueOnce({ rc: 0, stdout: "stereum_settings:\n  settings:\n    controls_install_path: /opt/tests" }) // find settings
    .mockReturnValueOnce({ rc: 1, stderr: "" }); // install
  SSHService.SSHService.mockImplementation(() => {
    return {
      exec: mMock,
    };
  });

  const nodeConnection = new NodeConnection(null);
  nodeConnection.taskManager = new TaskManager();
  nodeConnection.sshService = new SSHService.SSHService();

  await nodeConnection.prepareStereumNode("/opt/stereum/bar").catch((e) => {
    expect(e).toEqual(new Error("Can't install ansible role: <stderr empty>"));
  });

  expect(mMock.mock.calls.length).toBe(5);
});

test("prepareStereumNode error ubuntu install", async () => {
  jest.mock("../../SSHService");
  const SSHService = require("../../SSHService");
  const mMock = jest.fn();
  mMock
    .mockReturnValueOnce({ rc: 0, stdout: "ubuntu" }) // find OS
    .mockReturnValueOnce({ rc: 0 }) // delete ansible roles if exist
    .mockReturnValueOnce({ rc: 0 }) // install pkg
    .mockReturnValueOnce({ rc: 0, stdout: "stereum_settings:\n  settings:\n    controls_install_path: /opt/tests" }) // find settings
    .mockRejectedValue("connection lost"); // install
  SSHService.SSHService.mockImplementation(() => {
    return {
      exec: mMock,
    };
  });

  const nodeConnection = new NodeConnection(null);
  nodeConnection.taskManager = new TaskManager();
  nodeConnection.sshService = new SSHService.SSHService();

  await nodeConnection.prepareStereumNode("/opt/stereum/bar").catch((e) => {
    expect(e).toEqual(new Error("Can't install ansible roles: connection lost"));
  });

  expect(mMock.mock.calls.length).toBe(5);
});

test("prepareStereumNode success", async () => {
  jest.mock("../../SSHService");
  const SSHService = require("../../SSHService");
  const mMock = jest.fn();
  mMock
    .mockReturnValueOnce({ rc: 0, stdout: "stereum_settings:\n  settings:\n    controls_install_path: /opt/tests" }) // find settings
    .mockReturnValueOnce({ rc: 0, stdout: "ubuntu" }) // find OS
    .mockReturnValueOnce({ rc: 0 }) // install pkg
    .mockReturnValueOnce({ rc: 0 }) // delete ansible roles if exist
    .mockReturnValueOnce({ rc: 0, stdout: "stereum_settings:\n  settings:\n    controls_install_path: /opt/tests" }) // find settings
    .mockReturnValueOnce({ rc: 0 }) // install
    .mockReturnValueOnce({ rc: 0 }) // playbook ansible
    .mockReturnValueOnce({ rc: 0 }); // playbook ansible
  SSHService.SSHService.mockImplementation(() => {
    return {
      exec: mMock,
    };
  });

  const nodeConnection = new NodeConnection(null);
  nodeConnection.taskManager = new TaskManager();
  nodeConnection.sshService = new SSHService.SSHService();

  await nodeConnection.findStereumSettings();
  const playbookRun = await nodeConnection.prepareStereumNode("/opt/stereum/bar");
  expect(playbookRun[0]).toBeDefined();
  expect(playbookRun[0]).toMatchObject({
    playbook: expect.stringMatching(/setup/),
    playbookRunRef: expect.any(String),
  });
  expect(playbookRun[1]).toBeDefined();
  expect(playbookRun[1]).toMatchObject({
    playbook: expect.stringMatching(/configure-firewall/),
    playbookRunRef: expect.any(String),
  });

  expect(mMock.mock.calls.length).toBe(8);

  expect(mMock.mock.calls[0][0]).toMatch(/cat/);
  expect(mMock.mock.calls[0][0]).toMatch(/stereum.yaml/);

  expect(mMock.mock.calls[1][0]).toMatch(/cat/);
  expect(mMock.mock.calls[1][0]).toMatch(/release/);

  expect(mMock.mock.calls[2][0]).toMatch(/apt install/);

  expect(mMock.mock.calls[4][0]).toMatch(/cat/);
  expect(mMock.mock.calls[4][0]).toMatch(/stereum.yaml/);

  expect(mMock.mock.calls[5][0]).toMatch(/git checkout/);

  expect(mMock.mock.calls[6][0]).toMatch(/ansible-playbook/);
  expect(mMock.mock.calls[6][0]).toMatch(/ansible-playbook/);
});

test("prepareStereumNode error playbook", async () => {
  jest.mock("../../SSHService");
  const SSHService = require("../../SSHService");
  const mMock = jest.fn();
  mMock
    .mockReturnValueOnce({ rc: 0, stdout: "stereum_settings:\n  settings:\n    controls_install_path: /opt/tests" }) // find settings
    .mockReturnValueOnce({ rc: 0, stdout: "ubuntu" }) // find OS
    .mockReturnValueOnce({ rc: 0 }) // delete ansible roles if exist
    .mockReturnValueOnce({ rc: 0 }) // install pkg
    .mockReturnValueOnce({ rc: 0, stdout: "stereum_settings:\n  settings:\n    controls_install_path: /opt/tests" }) // find settings
    .mockReturnValueOnce({ rc: 0 }) // install
    .mockRejectedValue("connection interrupted"); // playbook ansible
  SSHService.SSHService.mockImplementation(() => {
    return {
      exec: mMock,
    };
  });

  const nodeConnection = new NodeConnection(null);
  nodeConnection.taskManager = new TaskManager();
  nodeConnection.sshService = new SSHService.SSHService();

  await nodeConnection.findStereumSettings();
  await nodeConnection.prepareStereumNode("/opt/stereum/bar").catch((e) => {
    expect(e).toEqual(new Error("Can't run setup playbook: Error: Can't run playbook: connection interrupted"));
  });

  expect(mMock.mock.calls.length).toBe(7);

  expect(mMock.mock.calls[1][0]).toMatch(/cat/);
  expect(mMock.mock.calls[1][0]).toMatch(/release/);

  expect(mMock.mock.calls[2][0]).toMatch(/apt install/);

  expect(mMock.mock.calls[4][0]).toMatch(/cat/);
  expect(mMock.mock.calls[4][0]).toMatch(/stereum.yaml/);

  expect(mMock.mock.calls[5][0]).toMatch(/git checkout/);

  expect(mMock.mock.calls[6][0]).toMatch(/ansible-playbook/);
});

test("prepareStereumNode failure playbook", async () => {
  jest.mock("../../SSHService");
  const SSHService = require("../../SSHService");
  const mMock = jest.fn();
  mMock
    .mockReturnValueOnce({ rc: 0, stdout: "stereum_settings:\n  settings:\n    controls_install_path: /opt/tests\n    lane: stable" }) // find settings
    .mockReturnValueOnce({ rc: 0, stdout: "ubuntu" }) // find OS
    .mockReturnValueOnce({ rc: 0 }) // delete ansible roles if exist
    .mockReturnValueOnce({ rc: 0 }) // install pkg
    .mockReturnValueOnce({ rc: 0, stdout: "stereum_settings:\n  settings:\n    controls_install_path: /opt/tests\n    lane: stable" }) // find settings
    .mockReturnValueOnce({ rc: 0 }) // install
    .mockReturnValueOnce({ rc: 1, stderr: "asdf" }); // playbook ansible
  SSHService.SSHService.mockImplementation(() => {
    return {
      exec: mMock,
    };
  });

  const nodeConnection = new NodeConnection(null);
  nodeConnection.taskManager = new TaskManager();
  nodeConnection.sshService = new SSHService.SSHService();

  await nodeConnection.findStereumSettings();
  await nodeConnection.prepareStereumNode("/opt/stereum/bar").catch((e) => {
    expect(e).toEqual(new Error("Can't run setup playbook: Error: Failed running 'setup': asdf"));
  });

  expect(mMock.mock.calls.length).toBe(7);
  expect(mMock.mock.calls[1][0]).toMatch(/cat/);
  expect(mMock.mock.calls[1][0]).toMatch(/release/);

  expect(mMock.mock.calls[2][0]).toMatch(/apt install/);

  expect(mMock.mock.calls[4][0]).toMatch(/cat/);
  expect(mMock.mock.calls[4][0]).toMatch(/stereum.yaml/);

  expect(mMock.mock.calls[5][0]).toMatch(/git checkout/);

  expect(mMock.mock.calls[6][0]).toMatch(/ansible-playbook/);
});

test("playbookStatus error", async () => {
  jest.mock("../../SSHService");
  const SSHService = require("../../SSHService");
  const mMock = jest.fn();
  mMock.mockRejectedValue("error123");
  SSHService.SSHService.mockImplementation(() => {
    return {
      exec: mMock,
    };
  });

  const nodeConnection = new NodeConnection(null);
  nodeConnection.taskManager = new TaskManager();
  nodeConnection.sshService = new SSHService.SSHService();

  expect.assertions(1);

  await nodeConnection.playbookStatus("ref-123").catch((e) => {
    expect(e).toEqual(new Error("Can't read playbook status 'ref-123': error123"));
  });
});

test("playbookStatus failure", async () => {
  jest.mock("../../SSHService");
  const SSHService = require("../../SSHService");
  const mMock = jest.fn();
  mMock.mockReturnValueOnce(new Promise((resolve) => resolve({ rc: 1, stderr: "err-1" })));
  SSHService.SSHService.mockImplementation(() => {
    return {
      exec: mMock,
    };
  });

  const nodeConnection = new NodeConnection(null);
  nodeConnection.taskManager = new TaskManager();
  nodeConnection.sshService = new SSHService.SSHService();

  expect.assertions(1);

  await nodeConnection.playbookStatus("ref-123").catch((e) => {
    log.debug("playbookStatus failure:", e);
    expect(e).toEqual(new Error("Failed reading status of ref 'ref-123': err-1"));
  });
});

test("playbookStatus success", async () => {
  jest.mock("../../SSHService");
  const SSHService = require("../../SSHService");
  const mMock = jest.fn();
  mMock.mockReturnValueOnce(new Promise((resolve) => resolve({ rc: 0, stdout: "playbook-output" })));
  SSHService.SSHService.mockImplementation(() => {
    return {
      exec: mMock,
    };
  });

  const nodeConnection = new NodeConnection(null);
  nodeConnection.taskManager = new TaskManager();
  nodeConnection.sshService = new SSHService.SSHService();

  expect(await nodeConnection.playbookStatus("ref-123")).toMatch("playbook-output");
});

test("runPlaybook extravars success", async () => {
  jest.mock("../../SSHService");
  const SSHService = require("../../SSHService");
  const mMock = jest.fn();
  mMock.mockReturnValueOnce({ rc: 0, stdout: "playbook-output" });
  SSHService.SSHService.mockImplementation(() => {
    return {
      exec: mMock,
    };
  });

  const nodeConnection = new NodeConnection(null);
  nodeConnection.taskManager = new TaskManager();
  nodeConnection.sshService = new SSHService.SSHService();

  nodeConnection.settings = {
    stereum: {
      settings: {
        controls_install_path: "/some/path",
      },
    },
  };

  const playbookRunRef = await nodeConnection.runPlaybook("ref-abc", { stereum_var: "sowow" });

  expect(playbookRunRef.playbook).toMatch("ref-abc");
  expect(playbookRunRef.playbookRunRef).toBeDefined();
  expect(playbookRunRef.playbookRunRef).toHaveLength(36);
  expect(mMock.mock.calls).toHaveLength(1);
  expect(mMock.mock.calls[0][0]).toMatch(/sowow/);

  log.info("call: ", mMock.mock.calls[0][0]);
});

test("runPlaybook error no settings", async () => {
  const nodeConnection = new NodeConnection(null);
  nodeConnection.taskManager = new TaskManager();

  await nodeConnection.runPlaybook("ref-abc", { stereum_var: "sowow" }).catch((e) => {
    expect(e).toEqual(new Error("Settings not loaded! Run findStereumSettings() first."));
  });
});

test("listServicesConfigurations success", async () => {
  jest.mock("../../SSHService");
  const SSHService = require("../../SSHService");
  const mMock = jest.fn();
  mMock.mockReturnValueOnce({ rc: 0, stdout: "foo.yaml\nbar.yaml\nxyz.yaml" });
  SSHService.SSHService.mockImplementation(() => {
    return {
      exec: mMock,
    };
  });

  const nodeConnection = new NodeConnection(null);
  nodeConnection.taskManager = new TaskManager();
  nodeConnection.sshService = new SSHService.SSHService();

  const list = await nodeConnection.listServicesConfigurations();

  expect(list.length).toBe(3);
  expect(list).toContain("foo.yaml");
  expect(list).toContain("bar.yaml");
  expect(list).toContain("xyz.yaml");

  expect(mMock.mock.calls.length).toBe(1);

  expect(mMock.mock.calls[0][0]).toMatch(/ls -1 \/etc\/stereum\/services/);
});

test("listServicesConfigurations success empty", async () => {
  jest.mock("../../SSHService");
  const SSHService = require("../../SSHService");
  const mMock = jest.fn();
  mMock.mockReturnValueOnce({ rc: 0, stdout: "" });
  SSHService.SSHService.mockImplementation(() => {
    return {
      exec: mMock,
    };
  });

  const nodeConnection = new NodeConnection(null);
  nodeConnection.taskManager = new TaskManager();
  nodeConnection.sshService = new SSHService.SSHService();

  const list = await nodeConnection.listServicesConfigurations();

  expect(list.length).toBe(0);

  expect(mMock.mock.calls.length).toBe(1);

  expect(mMock.mock.calls[0][0]).toMatch(/ls -1 \/etc\/stereum\/services/);
});

test("readServiceConfiguration success", async () => {
  jest.mock("../../SSHService");
  const SSHService = require("../../SSHService");
  const mMock = jest.fn();
  mMock.mockReturnValueOnce({ rc: 0, stdout: "id: foo-bar\nimage: stereum/lighthouse:0.0.1-123" });
  SSHService.SSHService.mockImplementation(() => {
    return {
      exec: mMock,
    };
  });

  const nodeConnection = new NodeConnection(null);
  nodeConnection.taskManager = new TaskManager();
  nodeConnection.sshService = new SSHService.SSHService();

  const config = await nodeConnection.readServiceConfiguration("foo-bar");

  expect(config).toBeDefined();
  expect(config.id).toMatch(/foo-bar/);
  expect(config.image).toMatch(/stereum\/lighthouse:0.0.1-123/);

  expect(mMock.mock.calls.length).toBe(1);

  expect(mMock.mock.calls[0][0]).toMatch(/cat \/etc\/stereum\/services\/foo-bar.yaml/);
});

test("writeServiceConfiguration success", async () => {
  jest.mock("../../SSHService");
  const SSHService = require("../../SSHService");
  const mMock = jest.fn();
  mMock.mockReturnValueOnce({ rc: 0 });
  SSHService.SSHService.mockImplementation(() => {
    return {
      exec: mMock,
    };
  });

  const nodeConnection = new NodeConnection(null);
  nodeConnection.taskManager = new TaskManager();
  nodeConnection.sshService = new SSHService.SSHService();

  await nodeConnection.writeServiceConfiguration({
    id: "some-id",
    user: "2000",
    ports: ["0.0.0.0:9000:9000/tcp", "0.0.0.0:9000:9000/udp"],
  });

  expect(mMock.mock.calls.length).toBe(1);

  expect(mMock.mock.calls[0][0]).toMatch(/2000/);
  expect(mMock.mock.calls[0][0]).toMatch(/id: some-id/);
  expect(mMock.mock.calls[0][0]).toMatch("/etc/stereum/services/some-id");
  expect(mMock.mock.calls[0][0]).toMatch("- 0.0.0.0:9000:9000/tcp");
  log.debug(mMock.mock.calls[0][0]);
});

const service_json = `{"Command":"\\"/opt/app/start/validator.sh\\"","CreatedAt":"2021-11-13 13:37:32 +0100 CET","ID":"fe70855b294617c9fc2bc927acdf3489d3a2d4fe866e3ad2733e61f73591cf2c","Image":"stereum/lighthouse:v2.0.1-47","Labels":"com.docker.compose.container-number=1,com.docker.compose.oneoff=False,com.docker.compose.project=stereum,com.docker.compose.project.working_dir=/opt/stereum/ethereum2-docker-compose,docker-slim.version=linux|Transformer|1.33.0|da7983050b8bf326c6f8e73ddce43a5b8d54da4b|2020-12-12_08:18:23PM,com.docker.compose.config-hash=42f09503e86b5e3fa084baa02eace7a86877f64f7a8650949f317c31491019de,com.docker.compose.service=validator,com.docker.compose.version=1.25.0,maintainer=theguys@stereum.net,com.docker.compose.project.config_files=docker-compose.yaml,docker-compose.override.yaml","LocalVolumes":"0","Mounts":"/opt/stereum/ethereum2-docker-compose/launchpad,/opt/stereum/ethereum2-docker-compose/wallets","Names":"stereum_validator_1","Networks":"stereum_default","Ports":"","RunningFor":"5 hours ago","Size":"0B (virtual 126MB)","State":"running","Status":"Up 5 hours"}
{"Command":"\\"/run.sh\\"","CreatedAt":"2021-11-13 13:37:32 +0100 CET","ID":"57db4c9753023ab1b4236297b8498dbb602aa69fdec8c8424f2f80405e2292f0","Image":"grafana/grafana:7.3.10","Labels":"com.docker.compose.container-number=1,com.docker.compose.oneoff=False,com.docker.compose.project=stereum,com.docker.compose.project.config_files=docker-compose.yaml,docker-compose.override.yaml,com.docker.compose.project.working_dir=/opt/stereum/ethereum2-docker-compose,com.docker.compose.service=grafana,com.docker.compose.version=1.25.0,com.docker.compose.config-hash=c3c9e29b4b9543b242ebcc705a703b01281381b5b3f21712aec2ea3a5e78a010","LocalVolumes":"0","Mounts":"/opt/stereum/ethereum2-docker-compose/config/grafana/grafana.ini,/opt/stereum/ethereum2-docker-compose/config/grafana/provisioning-lh,/opt/stereum/ethereum2-docker-compose/qrcode,/opt/stereum/ethereum2-docker-compose/data/grafana","Names":"stereum_grafana_1","Networks":"stereum_default","Ports":"127.0.0.1:3000-\\u003e3000/tcp","RunningFor":"5 hours ago","Size":"0B (virtual 187MB)","State":"running","Status":"Up 5 hours"}
{"Command":"\\"/bin/prometheus --storage.tsdb.retention.time=7d --config.file=/etc/prometheus/prometheus.yml\\"","CreatedAt":"2021-11-13 13:37:30 +0100 CET","ID":"8de840a040fd2d8b504a09d87e962e61dfea0b8f8ab534c73c0c9bb412bd0d7b","Image":"prom/prometheus:v2.22.2","Labels":"com.docker.compose.container-number=1,com.docker.compose.oneoff=False,com.docker.compose.project.config_files=docker-compose.yaml,docker-compose.override.yaml,com.docker.compose.project.working_dir=/opt/stereum/ethereum2-docker-compose,com.docker.compose.service=prometheus,com.docker.compose.config-hash=8be7d1a61dbda6995e86a6ed5dfc6569b84f52630ae6011f77aa45b885aba214,com.docker.compose.project=stereum,com.docker.compose.version=1.25.0,maintainer=The Prometheus Authors \\u003cprometheus-developers@googlegroups.com\\u003e","LocalVolumes":"0","Mounts":"/opt/stereum/ethereum2-docker-compose/data/prometheus,/opt/stereum/ethereum2-docker-compose/config/prometheus/prometheus-lh.yaml","Names":"stereum_prometheus_1","Networks":"stereum_default","Ports":"127.0.0.1:9090-\\u003e9090/tcp","RunningFor":"5 hours ago","Size":"0B (virtual 168MB)","State":"running","Status":"Up 5 hours"}
{"Command":"\\"/opt/app/start/beacon.sh\\"","CreatedAt":"2021-11-13 13:37:30 +0100 CET","ID":"a6556815714e6e5b7665554900bf5191d4a2e5c0622a192fa2b4791cef421e41","Image":"stereum/lighthouse:v2.0.1-47","Labels":"com.docker.compose.project.config_files=docker-compose.yaml,docker-compose.override.yaml,com.docker.compose.service=beacon,com.docker.compose.version=1.25.0,docker-slim.version=linux|Transformer|1.33.0|da7983050b8bf326c6f8e73ddce43a5b8d54da4b|2020-12-12_08:18:23PM,maintainer=theguys@stereum.net,com.docker.compose.config-hash=b1f8212fa43d8599971a8cc6d751dcff3537076cf01a0c62f7d5e7303701f8d4,com.docker.compose.project=stereum,com.docker.compose.project.working_dir=/opt/stereum/ethereum2-docker-compose,com.docker.compose.container-number=1,com.docker.compose.oneoff=False","LocalVolumes":"0","Mounts":"/opt/stereum/ethereum2-docker-compose/data/sigmaprime/lighthouse,/opt/stereum/ethereum2-docker-compose/data/sigmaprime/slasher","Names":"stereum_beacon_1","Networks":"stereum_default,stereum_stereum-admin","Ports":"127.0.0.1:5052-\\u003e5052/tcp, 0.0.0.0:9000-\\u003e9000/tcp, 0.0.0.0:9000-\\u003e9000/udp, :::9000-\\u003e9000/tcp, :::9000-\\u003e9000/udp","RunningFor":"5 hours ago","Size":"0B (virtual 126MB)","State":"running","Status":"Up 5 hours"}\n`;

test("listServices success", async () => {
  jest.mock("../../SSHService");
  const SSHService = require("../../SSHService");
  const mMock = jest.fn();
  mMock.mockReturnValueOnce({ rc: 0, stdout: service_json });
  SSHService.SSHService.mockImplementation(() => {
    return {
      exec: mMock,
    };
  });

  const nodeConnection = new NodeConnection(null);
  nodeConnection.taskManager = new TaskManager();
  nodeConnection.sshService = new SSHService.SSHService();

  const services = await nodeConnection.listServices();

  expect(services).toHaveLength(4);
  expect(services[0].ID).toMatch("fe70855b294617c9fc2bc927acdf3489d3a2d4fe866e3ad2733e61f73591cf2c");
  expect(services[3].Names).toMatch("stereum_beacon_1");

  expect(mMock.mock.calls.length).toBe(1);
  expect(mMock.mock.calls[0][0]).toMatch(/docker ps/);
});

const service_details_json = `[
    {
        "Id": "a6556815714e6e5b7665554900bf5191d4a2e5c0622a192fa2b4791cef421e41",
        "Created": "2021-11-13T12:37:30.356648585Z",
        "Path": "/opt/app/start/beacon.sh",
        "Args": [],
        "State": {
            "Status": "running",
            "Running": true,
            "Paused": false,
            "Restarting": false,
            "OOMKilled": false,
            "Dead": false,
            "Pid": 29152,
            "ExitCode": 0,
            "Error": "",
            "StartedAt": "2021-11-13T12:37:32.187021441Z",
            "FinishedAt": "0001-01-01T00:00:00Z"
        },
        "Image": "sha256:fb2e561826148eadf6bd879970fd70f3e522a5290840571af247227deed179b3",
        "ResolvConfPath": "/var/lib/docker/containers/a6556815714e6e5b7665554900bf5191d4a2e5c0622a192fa2b4791cef421e41/resolv.conf",
        "HostnamePath": "/var/lib/docker/containers/a6556815714e6e5b7665554900bf5191d4a2e5c0622a192fa2b4791cef421e41/hostname",
        "HostsPath": "/var/lib/docker/containers/a6556815714e6e5b7665554900bf5191d4a2e5c0622a192fa2b4791cef421e41/hosts",
        "LogPath": "/var/lib/docker/containers/a6556815714e6e5b7665554900bf5191d4a2e5c0622a192fa2b4791cef421e41/a6556815714e6e5b7665554900bf5191d4a2e5c0622a192fa2b4791cef421e41-json.log",
        "Name": "/stereum_beacon_1",
        "RestartCount": 0,
        "Driver": "overlay2",
        "Platform": "linux",
        "MountLabel": "",
        "ProcessLabel": "",
        "AppArmorProfile": "docker-default",
        "ExecIDs": null,
        "HostConfig": {
            "Binds": [
                "/opt/stereum/ethereum2-docker-compose/data/sigmaprime/lighthouse:/opt/app/beacon:rw",
                "/opt/stereum/ethereum2-docker-compose/data/sigmaprime/slasher:/opt/app/slasher:rw"
            ],
            "ContainerIDFile": "",
            "LogConfig": {
                "Type": "json-file",
                "Config": {
                    "max-file": "10",
                    "max-size": "100m"
                }
            },
            "NetworkMode": "stereum_default",
            "PortBindings": {
                "5052/tcp": [
                    {
                        "HostIp": "127.0.0.1",
                        "HostPort": "5052"
                    }
                ],
                "9000/tcp": [
                    {
                        "HostIp": "",
                        "HostPort": "9000"
                    }
                ],
                "9000/udp": [
                    {
                        "HostIp": "",
                        "HostPort": "9000"
                    }
                ]
            },
            "RestartPolicy": {
                "Name": "unless-stopped",
                "MaximumRetryCount": 0
            },
            "AutoRemove": false,
            "VolumeDriver": "",
            "VolumesFrom": [],
            "CapAdd": null,
            "CapDrop": null,
            "CgroupnsMode": "host",
            "Dns": null,
            "DnsOptions": null,
            "DnsSearch": null,
            "ExtraHosts": null,
            "GroupAdd": null,
            "IpcMode": "shareable",
            "Cgroup": "",
            "Links": null,
            "OomScoreAdj": 0,
            "PidMode": "",
            "Privileged": false,
            "PublishAllPorts": false,
            "ReadonlyRootfs": false,
            "SecurityOpt": null,
            "UTSMode": "",
            "UsernsMode": "",
            "ShmSize": 67108864,
            "Runtime": "runc",
            "ConsoleSize": [
                0,
                0
            ],
            "Isolation": "",
            "CpuShares": 0,
            "Memory": 0,
            "NanoCpus": 0,
            "CgroupParent": "",
            "BlkioWeight": 0,
            "BlkioWeightDevice": null,
            "BlkioDeviceReadBps": null,
            "BlkioDeviceWriteBps": null,
            "BlkioDeviceReadIOps": null,
            "BlkioDeviceWriteIOps": null,
            "CpuPeriod": 0,
            "CpuQuota": 0,
            "CpuRealtimePeriod": 0,
            "CpuRealtimeRuntime": 0,
            "CpusetCpus": "",
            "CpusetMems": "",
            "Devices": null,
            "DeviceCgroupRules": null,
            "DeviceRequests": null,
            "KernelMemory": 0,
            "KernelMemoryTCP": 0,
            "MemoryReservation": 0,
            "MemorySwap": 0,
            "MemorySwappiness": null,
            "OomKillDisable": false,
            "PidsLimit": null,
            "Ulimits": null,
            "CpuCount": 0,
            "CpuPercent": 0,
            "IOMaximumIOps": 0,
            "IOMaximumBandwidth": 0,
            "MaskedPaths": [
                "/proc/asound",
                "/proc/acpi",
                "/proc/kcore",
                "/proc/keys",
                "/proc/latency_stats",
                "/proc/timer_list",
                "/proc/timer_stats",
                "/proc/sched_debug",
                "/proc/scsi",
                "/sys/firmware"
            ],
            "ReadonlyPaths": [
                "/proc/bus",
                "/proc/fs",
                "/proc/irq",
                "/proc/sys",
                "/proc/sysrq-trigger"
            ]
        },
        "GraphDriver": {
            "Data": {
                "LowerDir": "/var/lib/docker/overlay2/f0092cb53cc9c1c1e12c36870c020f173baf2a95646790a1a0ad8bea984c91e0-init/diff:/var/lib/docker/overlay2/43badb5ecb62ab9bf310c7de21f73f983311a731832acdac5cb166c99b0259d7/diff:/var/lib/docker/overlay2/50faeef96fcf8625e280c262ef55b3774a2e5775dc0a4aec8be4cb7c5761d574/diff",
                "MergedDir": "/var/lib/docker/overlay2/f0092cb53cc9c1c1e12c36870c020f173baf2a95646790a1a0ad8bea984c91e0/merged",
                "UpperDir": "/var/lib/docker/overlay2/f0092cb53cc9c1c1e12c36870c020f173baf2a95646790a1a0ad8bea984c91e0/diff",
                "WorkDir": "/var/lib/docker/overlay2/f0092cb53cc9c1c1e12c36870c020f173baf2a95646790a1a0ad8bea984c91e0/work"
            },
            "Name": "overlay2"
        },
        "Mounts": [
            {
                "Type": "bind",
                "Source": "/opt/stereum/ethereum2-docker-compose/data/sigmaprime/lighthouse",
                "Destination": "/opt/app/beacon",
                "Mode": "rw",
                "RW": true,
                "Propagation": "rprivate"
            },
            {
                "Type": "bind",
                "Source": "/opt/stereum/ethereum2-docker-compose/data/sigmaprime/slasher",
                "Destination": "/opt/app/slasher",
                "Mode": "rw",
                "RW": true,
                "Propagation": "rprivate"
            }
        ],
        "Config": {
            "Hostname": "a6556815714e",
            "Domainname": "",
            "User": "2000",
            "AttachStdin": false,
            "AttachStdout": false,
            "AttachStderr": false,
            "ExposedPorts": {
                "5052/tcp": {},
                "9000/tcp": {},
                "9000/udp": {}
            },
            "Tty": false,
            "OpenStdin": false,
            "StdinOnce": false,
            "Env": [
                "DEBUG_LEVEL=debug",
                "NETWORK=prater",
                "ETH1_NODES=http://geth:8545",
                "DATADIR=/opt/app/beacon",
                "SLASHERDIR=/opt/app/slasher",
                "SLASHER_DB_SIZE=16",
                "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
                "SERVICE_USER=app",
                "SERVICE_HOME=/opt/app"
            ],
            "Cmd": null,
            "Image": "stereum/lighthouse:v2.0.1-47",
            "Volumes": {
                "/opt/app/beacon": {},
                "/opt/app/slasher": {}
            },
            "WorkingDir": "/opt/app",
            "Entrypoint": [
                "/opt/app/start/beacon.sh"
            ],
            "OnBuild": null,
            "Labels": {
                "com.docker.compose.config-hash": "b1f8212fa43d8599971a8cc6d751dcff3537076cf01a0c62f7d5e7303701f8d4",
                "com.docker.compose.container-number": "1",
                "com.docker.compose.oneoff": "False",
                "com.docker.compose.project": "stereum",
                "com.docker.compose.project.config_files": "docker-compose.yaml,docker-compose.override.yaml",
                "com.docker.compose.project.working_dir": "/opt/stereum/ethereum2-docker-compose",
                "com.docker.compose.service": "beacon",
                "com.docker.compose.version": "1.25.0",
                "docker-slim.version": "linux|Transformer|1.33.0|da7983050b8bf326c6f8e73ddce43a5b8d54da4b|2020-12-12_08:18:23PM",
                "maintainer": "theguys@stereum.net"
            }
        },
        "NetworkSettings": {
            "Bridge": "",
            "SandboxID": "d4fe608b92b11e8f564103dc56bfc060652fae91e04663a63a88355616c22010",
            "HairpinMode": false,
            "LinkLocalIPv6Address": "",
            "LinkLocalIPv6PrefixLen": 0,
            "Ports": {
                "5052/tcp": [
                    {
                        "HostIp": "127.0.0.1",
                        "HostPort": "5052"
                    }
                ],
                "9000/tcp": [
                    {
                        "HostIp": "0.0.0.0",
                        "HostPort": "9000"
                    },
                    {
                        "HostIp": "::",
                        "HostPort": "9000"
                    }
                ],
                "9000/udp": [
                    {
                        "HostIp": "0.0.0.0",
                        "HostPort": "9000"
                    },
                    {
                        "HostIp": "::",
                        "HostPort": "9000"
                    }
                ]
            },
            "SandboxKey": "/var/run/docker/netns/d4fe608b92b1",
            "SecondaryIPAddresses": null,
            "SecondaryIPv6Addresses": null,
            "EndpointID": "",
            "Gateway": "",
            "GlobalIPv6Address": "",
            "GlobalIPv6PrefixLen": 0,
            "IPAddress": "",
            "IPPrefixLen": 0,
            "IPv6Gateway": "",
            "MacAddress": "",
            "Networks": {
                "stereum_default": {
                    "IPAMConfig": null,
                    "Links": null,
                    "Aliases": [
                        "beacon",
                        "a6556815714e"
                    ],
                    "NetworkID": "9adb605458b867104cb3515b9bb2dfd4f6fc7b729cd46ba57d92f30841e74025",
                    "EndpointID": "518570753ccbb1a96db23520808c8cd73b8e4fe8fdc59bbea666a16aec80b673",
                    "Gateway": "172.19.0.1",
                    "IPAddress": "172.19.0.8",
                    "IPPrefixLen": 16,
                    "IPv6Gateway": "",
                    "GlobalIPv6Address": "",
                    "GlobalIPv6PrefixLen": 0,
                    "MacAddress": "02:42:ac:13:00:08",
                    "DriverOpts": null
                },
                "stereum_stereum-admin": {
                    "IPAMConfig": null,
                    "Links": null,
                    "Aliases": [
                        "beacon",
                        "a6556815714e"
                    ],
                    "NetworkID": "f1baee4e8f9f04eb979ea1d1d91a451a37134bdd29b05fb4732bdb1c39290093",
                    "EndpointID": "e8dd2aedc76be4c63649dd7d7e9eb4907595d5aaef07126720519427b091f8d3",
                    "Gateway": "172.18.0.1",
                    "IPAddress": "172.18.0.4",
                    "IPPrefixLen": 16,
                    "IPv6Gateway": "",
                    "GlobalIPv6Address": "",
                    "GlobalIPv6PrefixLen": 0,
                    "MacAddress": "02:42:ac:12:00:04",
                    "DriverOpts": null
                }
            }
        }
    }
]`;

test("getServiceDetails success", async () => {
  jest.mock("../../SSHService");
  const SSHService = require("../../SSHService");
  const mMock = jest.fn();
  mMock.mockReturnValueOnce({ rc: 0, stdout: service_details_json });
  SSHService.SSHService.mockImplementation(() => {
    return {
      exec: mMock,
    };
  });

  const nodeConnection = new NodeConnection(null);
  nodeConnection.taskManager = new TaskManager();
  nodeConnection.sshService = new SSHService.SSHService();

  const details = await nodeConnection.getServiceDetails("a655");

  expect(details).toHaveLength(1);
  expect(details[0].Id).toMatch("a6556815714e6e5b7665554900bf5191d4a2e5c0622a192fa2b4791cef421e41");
  expect(details[0].Name).toMatch("stereum_beacon_1");
  expect(details[0].NetworkSettings.Ports["9000/udp"]).toHaveLength(2);

  expect(mMock.mock.calls.length).toBe(1);
  expect(mMock.mock.calls[0][0]).toMatch(/docker inspect a655/);
});

// EOF
