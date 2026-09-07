import { GethService } from "../../ethereum-services/GethService";
import { BesuService } from "../../ethereum-services/BesuService";
import { NimbusBeaconService } from "../../ethereum-services/NimbusBeaconService";
import { PrometheusService } from "../../ethereum-services/PrometheusService";
import { PrometheusNodeExporterService } from "../../ethereum-services/PrometheusNodeExporterService";
import { GrafanaService } from "../../ethereum-services/GrafanaService";
import { ServiceManager, serivceState } from "../../ServiceManager";
import YAML from "yaml";
import { LighthouseBeaconService } from "../../ethereum-services/LighthouseBeaconService";
import { LighthouseValidatorService } from "../../ethereum-services/LighthouseValidatorService";
import { PrysmBeaconService } from "../../ethereum-services/PrysmBeaconService";
import { PrysmValidatorService } from "../../ethereum-services/PrysmValidatorService";
import { TekuBeaconService } from "../../ethereum-services/TekuBeaconService";
import { NethermindService } from "../../ethereum-services/NethermindService";
import { FlashbotsMevBoostService } from "../../ethereum-services/FlashbotsMevBoostService";

test("manageServiceState success", async () => {
  jest.mock("../../NodeConnection");
  const NodeConnection = require("../../NodeConnection");
  const mMock = jest.fn((pb) => {
    return new Promise((resolve) => {
      resolve({
        playbook: pb,
        playbookRunRef: "asdf",
      });
    });
  });
  NodeConnection.NodeConnection.mockImplementation(() => {
    return {
      runPlaybook: mMock,
    };
  });

  const sm = new ServiceManager(NodeConnection.NodeConnection());

  await expect(sm.manageServiceState("123", serivceState.restarted)).resolves.toEqual({
    playbook: "restarting Service",
    playbookRunRef: "asdf",
  });

  expect(mMock.mock.calls[0][0]).toMatch(/restarting Service/);
  expect(mMock.mock.calls[0][1].stereum_args.manage_service.configuration.id).toMatch(/123/);
  expect(mMock.mock.calls[0][1].stereum_args.manage_service.state).toMatch(serivceState.restarted);
});

test("manageServiceState failure", async () => {
  jest.mock("../../NodeConnection");
  const NodeConnection = require("../../NodeConnection");
  const mMock = jest.fn(() => {
    return new Promise((resolve, reject) => {
      reject("error321");
    });
  });
  NodeConnection.NodeConnection.mockImplementation(() => {
    return {
      runPlaybook: mMock,
    };
  });

  const sm = new ServiceManager(NodeConnection.NodeConnection());

  await expect(sm.manageServiceState("123", serivceState.started)).rejects.toMatch(/error321/);

  expect(mMock.mock.calls[0][0]).toMatch(/starting Service/);
  expect(mMock.mock.calls[0][1].stereum_args.manage_service.configuration.id).toMatch(/123/);
  expect(mMock.mock.calls[0][1].stereum_args.manage_service.state).toMatch(serivceState.started);
});

test("readServiceConfigurations success", async () => {
  jest.mock("../../NodeConnection");
  const NodeConnection = require("../../NodeConnection");
  const listServicesConfigurationsMock = jest.fn(() => {
    return new Promise((resolve) => {
      resolve(["first.yaml", "second.yaml"]);
    });
  });
  const readServiceYAMLMock = jest
    .fn()
    .mockResolvedValueOnce("service: LighthouseBeaconService\nid: first\n")
    .mockResolvedValueOnce("service: LighthouseValidatorService\nid: second\n");

  NodeConnection.NodeConnection.mockImplementation(() => {
    return {
      listServicesConfigurations: listServicesConfigurationsMock,
      readServiceYAML: readServiceYAMLMock,
    };
  });

  const sm = new ServiceManager(NodeConnection.NodeConnection());

  const serviceConfigs = await sm.readServiceConfigurations();

  expect(serviceConfigs.length).toBe(2);

  expect(serviceConfigs[0].service).toEqual("LighthouseBeaconService");
  expect(serviceConfigs[0].id).toEqual("first");

  expect(serviceConfigs[1].service).toEqual("LighthouseValidatorService");
  expect(serviceConfigs[1].id).toEqual("second");
});

test("readServiceConfigurations success empty", async () => {
  jest.mock("../../NodeConnection");
  const NodeConnection = require("../../NodeConnection");
  const listServicesConfigurationsMock = jest.fn(() => {
    return new Promise((resolve) => {
      resolve(new Array());
    });
  });

  NodeConnection.NodeConnection.mockImplementation(() => {
    return {
      listServicesConfigurations: listServicesConfigurationsMock,
    };
  });

  const sm = new ServiceManager(NodeConnection.NodeConnection());

  const serviceConfigs = await sm.readServiceConfigurations();

  expect(serviceConfigs.length).toBe(0);
});

test("addDependencies LighthouseBeaconService", () => {
  const sm = new ServiceManager();
  const geth1 = GethService.buildByUserInput("goerli", [], "/opt/stereum/geth1");
  const geth2 = GethService.buildByUserInput("goerli", [], "/opt/stereum/geth2");
  const lhService = LighthouseBeaconService.buildByUserInput("prater", [], "/opt/stereum/lh", [], []);

  const result = sm.addDependencies(lhService, [geth1, geth2]);
  expect(result.command.join(" ")).toMatch(/--execution-endpoint=http:\/\/stereum-.{36}:8551,http:\/\/stereum-.{36}:8551/);
  expect(result.dependencies.executionClients).toHaveLength(2);
});

test("addDependencies FlashbotsMevBoost", () => {
  const sm = new ServiceManager();
  const lhService1 = LighthouseBeaconService.buildByUserInput("prater", [], "/opt/stereum/lh1", [], []);
  const lhService2 = LighthouseBeaconService.buildByUserInput("prater", [], "/opt/stereum/lh2", [], []);
  const mevboost = FlashbotsMevBoostService.buildByUserInput("goerli");

  const result = sm.addDependencies(mevboost, [lhService1, lhService2]);
  expect(result).toHaveLength(2);
  expect(result[0].command.join(" ")).toMatch(/--builder=http:\/\/stereum-.{36}:18550/);
});

test("addConnection String", () => {
  const geth1 = GethService.buildByUserInput("goerli", [], "/opt/stereum/geth");
  const geth2 = GethService.buildByUserInput("goerli", [], "/opt/stereum/geth");
  const prysm = PrysmBeaconService.buildByUserInput("prater", [], "/opt/stereum/prysm", [geth1], []);
  const dependencies = prysm.dependencies.executionClients.concat([geth2]);
  const endpointCommand = "--execution-endpoint=";
  const filter = (e) => e.buildExecutionClientEngineRPCHttpEndpointUrl();

  const sm = new ServiceManager();
  const result = sm.addCommandConnection(prysm, endpointCommand, dependencies, filter);

  expect(result).toContain(`--execution-endpoint=http://stereum-${geth1.id}:8551,http://stereum-${geth2.id}:8551`);
});

test("addConnection array empty dependencies", () => {
  const geth1 = GethService.buildByUserInput("goerli", [], "/opt/stereum/geth");
  const lhService = LighthouseBeaconService.buildByUserInput("prater", [], "/opt/stereum/prysm", [geth1], []);
  const dependencies = [];
  const endpointCommand = "--execution-endpoint=";
  const filter = (e) => e.buildExecutionClientEngineRPCHttpEndpointUrl();

  const sm = new ServiceManager();
  const result = sm.addCommandConnection(lhService, endpointCommand, dependencies, filter);

  expect(result).not.toContain("--execution-endpoint=");
  expect(result.join(" ")).not.toMatch(/--execution-endpoint=/);
});

test("addConnection array", () => {
  const geth1 = GethService.buildByUserInput("goerli", [], "/opt/stereum/geth");
  const geth2 = GethService.buildByUserInput("goerli", [], "/opt/stereum/geth");
  const lhService = LighthouseBeaconService.buildByUserInput("prater", [], "/opt/stereum/prysm", [geth1], []);
  const dependencies = lhService.dependencies.executionClients.concat([geth2]);
  const endpointCommand = "--execution-endpoint=";
  const filter = (e) => e.buildExecutionClientEngineRPCHttpEndpointUrl();

  const sm = new ServiceManager();
  const result = sm.addCommandConnection(lhService, endpointCommand, dependencies, filter);

  expect(result).toContain(`--execution-endpoint=http://stereum-${geth1.id}:8551,http://stereum-${geth2.id}:8551`);
});

test("addConnection String empty dependencies", () => {
  const geth1 = GethService.buildByUserInput("goerli", [], "/opt/stereum/geth");
  const prysm = PrysmBeaconService.buildByUserInput("prater", [], "/opt/stereum/prysm", [geth1], []);
  const dependencies = [];
  const endpointCommand = "--execution-endpoint=";
  const filter = (e) => e.buildExecutionClientEngineRPCHttpEndpointUrl();

  const sm = new ServiceManager();
  const result = sm.addCommandConnection(prysm, endpointCommand, dependencies, filter);

  expect(result).not.toContain("--execution-endpoint=");
});

test("removeConnection String", () => {
  const command = `/app/cmd/validator/validator --accept-terms-of-use=true
  --beacon-rpc-provider="stereum-42d9f0b4-257f-f71e-10fe-66c342dd4995:4000"
  --beacon-rpc-gateway-provider=stereum-42d9f0b4-257f-f71e-10fe-66c342dd4995:3500
  --web --prater=true --datadir=/opt/app/data/db
  --wallet-dir=/opt/app/data/wallets
  --wallet-password-file=/opt/app/data/passwords/wallet-password
  --monitoring-host=0.0.0.0 --grpc-gateway-port=7500 --grpc-gateway-host=0.0.0.0
  --grpc-gateway-corsdomain="*"  --monitoring-host=0.0.0.0
  --monitoring-port=8081
  --suggested-fee-recipient=0x0000000000000000000000000000000000000000
  --graffiti-file=/opt/app/graffitis/graffitis.yaml`;
  const id = "42d9f0b4-257f-f71e-10fe-66c342dd4995";

  const sm = new ServiceManager();
  const result = sm.removeCommandConnection(command, id);

  expect(result).not.toMatch(/--beacon-rpc-provider="stereum-42d9f0b4-257f-f71e-10fe-66c342dd4995:4000"/);
  expect(result).not.toMatch(/--beacon-rpc-gateway-provider=stereum-42d9f0b4-257f-f71e-10fe-66c342dd4995:3500/);
  expect(result).not.toMatch(/--beacon-rpc-provider=""/);
  expect(result).not.toMatch(/--beacon-rpc-gateway-provider=/);
});

test("removeConnection String multiple endpoints", () => {
  const command = `/app/cmd/validator/validator --accept-terms-of-use=true
  --beacon-rpc-provider="stereum-42d9f0b4-257f-f71e-10fe-66c342dd4995:4000,stereum-foo:3000,stereum-bar:2000"
  --beacon-rpc-gateway-provider=stereum-foo:3000,stereum-42d9f0b4-257f-f71e-10fe-66c342dd4995:3500
  --web --prater=true --datadir=/opt/app/data/db
  --wallet-dir=/opt/app/data/wallets
  --wallet-password-file=/opt/app/data/passwords/wallet-password
  --monitoring-host=0.0.0.0 --grpc-gateway-port=7500 --grpc-gateway-host=0.0.0.0
  --grpc-gateway-corsdomain="*"  --monitoring-host=0.0.0.0
  --monitoring-port=8081
  --suggested-fee-recipient=0x0000000000000000000000000000000000000000
  --graffiti-file=/opt/app/graffitis/graffitis.yaml`;
  const id = "42d9f0b4-257f-f71e-10fe-66c342dd4995";

  const sm = new ServiceManager();
  const result = sm.removeCommandConnection(command, id);

  expect(result).not.toMatch(/--beacon-rpc-provider="stereum-42d9f0b4-257f-f71e-10fe-66c342dd4995:4000,stereum-foo:3000,stereum-bar:2000"/);
  expect(result).not.toMatch(/--beacon-rpc-gateway-provider=stereum-foo:3000,stereum-42d9f0b4-257f-f71e-10fe-66c342dd4995:3500/);
  expect(result).toMatch(/--beacon-rpc-provider="stereum-foo:3000,stereum-bar:2000"/);
  expect(result).toMatch(/--beacon-rpc-gateway-provider=stereum-foo:3000/);
});

test("removeConnection array single endpoint", () => {
  const command = [
    "--network=prater",
    "--logging=INFO",
    "--p2p-enabled=true",
    "--p2p-port=9001",
    "--validators-keystore-locking-enabled=false",
    "--validators-graffiti-file=/opt/app/graffitis/graffitis.yaml",
    "--ee-endpoint=http://stereum-9adfdb2e-9f5b-aba4-cfde-f3483d7aac8d:8551",
    "--ee-jwt-secret-file=/engine.jwt",
    "--validators-proposer-default-fee-recipient=0x0000000000000000000000000000000000000000",
    "--data-path=/opt/app/data",
    "--data-storage-mode=prune",
    "--rest-api-port=5051",
    "--rest-api-host-allowlist=*",
    "--rest-api-interface=0.0.0.0",
    "--rest-api-docs-enabled=true",
    "--rest-api-enabled=true",
  ];
  const id = "9adfdb2e-9f5b-aba4-cfde-f3483d7aac8d";

  const sm = new ServiceManager();
  const result = sm.removeCommandConnection(command, id);

  expect(result).not.toContain("--ee-endpoint=http://stereum-9adfdb2e-9f5b-aba4-cfde-f3483d7aac8d:8551");
  expect(result).not.toContain("--ee-endpoint=");
});

test("removeConnection array multiple endpoints", () => {
  const command = [
    "--network=prater",
    "--logging=INFO",
    "--p2p-enabled=true",
    "--p2p-port=9001",
    "--validators-keystore-locking-enabled=false",
    "--validators-graffiti-file=/opt/app/graffitis/graffitis.yaml",
    '--ee-endpoint="http://stereum-9adfdb2e-9f5b-aba4-cfde-f3483d7aac8d:8551,foo:3000,bar:2000"',
    "--ee-jwt-secret-file=/engine.jwt",
    "--validators-proposer-default-fee-recipient=0x0000000000000000000000000000000000000000",
    "--data-path=/opt/app/data",
    "--data-storage-mode=prune",
    "--rest-api-port=5051",
    "--rest-api-host-allowlist=*",
    "--rest-api-interface=0.0.0.0",
    "--rest-api-docs-enabled=true",
    "--rest-api-enabled=true",
  ];
  const id = "9adfdb2e-9f5b-aba4-cfde-f3483d7aac8d";

  const sm = new ServiceManager();
  const result = sm.removeCommandConnection(command, id);

  expect(result).not.toContain('--ee-endpoint="http://stereum-9adfdb2e-9f5b-aba4-cfde-f3483d7aac8d:8551,foo:3000,bar:2000"');
  expect(result).toContain('--ee-endpoint="foo:3000,bar:2000"');
});

test("change network", () => {
  let services = [];
  let installDir = "/opt/stereum";
  let checkpointURL = undefined;
  let relayURL =
    "https://0x8f7b17a74569b7a57e9bdafd2e159380759f5dc3ccbd4bf600414147e8c4e1dc6ebada83c0139ac15850eb6c975e82d0@builder-relay-goerli.blocknative.com";
  let oldNetwork = "holesky";
  let newNetwork = "mainnet";
  const sm = new ServiceManager();
  services.push(GethService.buildByUserInput(oldNetwork, [], installDir + "/geth"));
  services.push(BesuService.buildByUserInput(oldNetwork, [], installDir + "/besu"));
  services.push(NethermindService.buildByUserInput(oldNetwork, [], installDir + "/nethermind"));
  services.push(FlashbotsMevBoostService.buildByUserInput(oldNetwork, relayURL));
  services.push(LighthouseBeaconService.buildByUserInput(oldNetwork, [], installDir + "/lighthouse", [], [], checkpointURL));
  services.push(LighthouseValidatorService.buildByUserInput(oldNetwork, [], installDir + "/lighthouse", []));
  services.push(PrysmBeaconService.buildByUserInput(oldNetwork, [], installDir + "/prysm", [], [], checkpointURL));
  services.push(PrysmValidatorService.buildByUserInput(oldNetwork, [], installDir + "/prysm", []));
  services.push(NimbusBeaconService.buildByUserInput(oldNetwork, [], installDir + "/nimbus", [], [], checkpointURL));
  services.push(TekuBeaconService.buildByUserInput(oldNetwork, [], installDir + "/teku", [], [], checkpointURL));
  services.push(PrometheusNodeExporterService.buildByUserInput(oldNetwork));
  services.push(PrometheusService.buildByUserInput(oldNetwork, [], installDir + "/prometheus"));
  services.push(GrafanaService.buildByUserInput(oldNetwork, [], installDir + "/grafana"));
  for (let service of services) {
    if (service.service === "FlashbotsMevBoostService") {
      service.entrypoint = sm.changeNetworkCommand(newNetwork, service);
    } else {
      service.command = sm.changeNetworkCommand(newNetwork, service);
    }
    service.network = newNetwork;
  }
  expect(services.map((s) => s.network)).not.toContain("goerli");
  expect(services.find((s) => s.service === "FlashbotsMevBoostService").entrypoint).toContain("-mainnet");
  expect(services.find((s) => s.service === "PrysmBeaconService").command).toContain("--mainnet");
  expect(services.find((s) => s.service === "PrysmBeaconService").command).not.toContain(
    "--genesis-state=/opt/app/genesis/prysm-holesky-genesis.ssz"
  );
  expect(services.find((s) => s.service === "LighthouseBeaconService").command).toContain("--network=mainnet");
});

const beaconConfig = (id) => {
  return {
    service: "LighthouseBeaconService",
    id: id,
    configVersion: 1,
    command: ["lighthouse", "bn", "--network=hoodi"],
    entrypoint: [],
    env: {},
    image: "sigp/lighthouse:v8.2.2",
    ports: ["0.0.0.0:9000:9000/tcp"],
    volumes: ["/opt/stereum/lighthouse-" + id + ":/opt/app/beacon"],
    user: "2000",
    network: "hoodi",
    autoupdate: true,
    dependencies: { executionClients: [], consensusClients: [], mevboost: [], otherServices: [] },
  };
};

const validatorConfig = (id, dvId) => {
  return {
    service: "LodestarValidatorService",
    id: id,
    configVersion: 1,
    command: ["validator", `--beaconNodes=http://stereum-${dvId}:3600`, "--distributed"],
    entrypoint: [],
    env: {},
    image: "chainsafe/lodestar:v1.46.0",
    ports: [],
    volumes: ["/opt/stereum/lodestar-" + id + ":/opt/app/validator"],
    user: "2000",
    network: "hoodi",
    autoupdate: false,
    dependencies: {
      executionClients: [],
      consensusClients: [{ id: dvId, service: "CharonService" }],
      mevboost: [],
      otherServices: [],
    },
  };
};

const charonConfig = (id) => {
  return {
    service: "CharonService",
    id: id,
    configVersion: 1,
    command: [
      "run",
      "--beacon-node-endpoints=http://stereum-lh-id:5052",
      "--log-level=info",
      "--p2p-tcp-address=0.0.0.0:3610",
      "--validator-api-address=0.0.0.0:3600",
      "--monitoring-address=0.0.0.0:3620",
      "--builder-api",
      "--graffiti=custom",
    ],
    entrypoint: ["/usr/local/bin/charon"],
    env: {},
    image: "obolnetwork/charon:v1.11.0",
    ports: ["0.0.0.0:3610:3610/tcp"],
    volumes: ["/opt/stereum/charon-" + id + ":/opt/charon"],
    user: "2000",
    network: "hoodi",
    autoupdate: false,
    dependencies: {
      executionClients: [],
      consensusClients: [{ id: "lh-id", service: "LighthouseBeaconService" }],
      mevboost: [],
      otherServices: [],
    },
  };
};

const switchMocks = (configs) => {
  jest.mock("../../NodeConnection");
  const NodeConnection = require("../../NodeConnection");
  const writeServiceConfiguration = jest.fn(() => Promise.resolve());
  const runPlaybook = jest.fn(() => Promise.resolve({ playbookRunRef: "ref" }));
  NodeConnection.NodeConnection.mockImplementation(() => {
    return {
      listServicesConfigurations: jest.fn(() => Promise.resolve(configs.map((c) => `${c.id}.yaml`))),
      readServiceYAML: jest.fn((file) => Promise.resolve(YAML.stringify(configs.find((c) => `${c.id}.yaml` === file)))),
      readServiceConfiguration: jest.fn((id) => Promise.resolve(configs.find((c) => c.id === id))),
      writeServiceConfiguration: writeServiceConfiguration,
      runPlaybook: runPlaybook,
      nodeUpdates: { checkUpdates: jest.fn(() => Promise.resolve({ hoodi: { PlutoService: ["v0.1.3", "v0.1.4"] } })) },
      sshService: { exec: jest.fn(() => Promise.resolve({ stdout: "80.249.121.1\n", stderr: "", rc: 0 })) },
    };
  });
  return { NodeConnection, writeServiceConfiguration, runPlaybook };
};

test("switchServices swaps charon for pluto in place", async () => {
  const config = charonConfig("charon-id");
  const vc = validatorConfig("vc-id", "charon-id");
  const { NodeConnection, writeServiceConfiguration, runPlaybook } = switchMocks([config, beaconConfig("lh-id"), vc]);
  const sm = new ServiceManager(NodeConnection.NodeConnection());

  const handledInPlace = await sm.switchServices({
    id: "charon-id",
    setupId: "setup-id",
    service: { service: "CharonService", category: "validator", config: { serviceID: "charon-id", network: "hoodi" } },
    data: { itemToInstall: { service: "PlutoService" }, data: {} },
  });

  // the previous service must survive: it holds the ENR key and key shares
  expect(handledInPlace).toBe(true);

  const written = writeServiceConfiguration.mock.calls[0][0];
  expect(written.service).toMatch("PlutoService");
  expect(written.image).toMatch("nethermindeth/pluto:v0.1.4");
  expect(written.entrypoint).toEqual(["/app/bin/pluto"]);

  // identity, ports and data directory are untouched
  expect(written.id).toMatch("charon-id");
  expect(written.ports).toEqual(config.ports);
  expect(written.volumes).toEqual(config.volumes);
  expect(written.user).toMatch("2000");
  expect(written.autoupdate).toBe(false);

  // dependencies come back out as minimal configs
  expect(written.dependencies.consensusClients).toEqual([{ id: "lh-id", service: "LighthouseBeaconService" }]);

  // carried over verbatim; "--p2p-external-ip" is the user's to set
  expect(written.command).toEqual(config.command);

  // stopped then started, so "manage-service" reconciles the firewall rules
  expect(runPlaybook.mock.calls.map((c) => c[1].stereum_args.manage_service.state)).toEqual(["stopped", "started"]);
});

test("switchServices refreshes what dependents recorded about the client", async () => {
  const config = charonConfig("charon-id");
  const vc = validatorConfig("vc-id", "charon-id");
  const { NodeConnection, writeServiceConfiguration } = switchMocks([config, beaconConfig("lh-id"), vc]);
  const sm = new ServiceManager(NodeConnection.NodeConnection());

  await sm.switchServices({
    id: "charon-id",
    setupId: "setup-id",
    service: { service: "CharonService", category: "validator", config: { serviceID: "charon-id", network: "hoodi" } },
    data: { itemToInstall: { service: "PlutoService" }, data: {} },
  });

  const written = writeServiceConfiguration.mock.calls.map((c) => c[0]);
  const dependent = written.find((c) => c.id === "vc-id");

  // dependents persist the client's name next to its id, so a stale name would
  // outlive the swap
  expect(dependent).toBeDefined();
  expect(dependent.dependencies.consensusClients).toEqual([{ id: "charon-id", service: "PlutoService" }]);

  // rewriting a dependent must not quietly re-enable its auto updates
  expect(dependent.autoupdate).toBe(false);

  // and nothing else about it changes
  expect(dependent.command).toEqual(vc.command);
  expect(dependent.image).toMatch("chainsafe/lodestar:v1.46.0");
});

test("switchServices swaps pluto back to charon in place", async () => {
  const config = charonConfig("pluto-id");
  config.service = "PlutoService";
  config.image = "nethermindeth/pluto:v0.1.4";
  config.entrypoint = ["/app/bin/pluto"];
  config.command.push("--p2p-external-ip=80.249.121.1");

  const { NodeConnection, writeServiceConfiguration } = switchMocks([config, beaconConfig("lh-id")]);
  const sm = new ServiceManager(NodeConnection.NodeConnection());

  const handledInPlace = await sm.switchServices({
    id: "pluto-id",
    setupId: "setup-id",
    service: { service: "PlutoService", category: "validator", config: { serviceID: "pluto-id", network: "hoodi" } },
    data: { itemToInstall: { service: "CharonService" }, data: {} },
  });

  expect(handledInPlace).toBe(true);

  const written = writeServiceConfiguration.mock.calls[0][0];
  expect(written.service).toMatch("CharonService");
  expect(written.image).toMatch(/^obolnetwork\/charon:/);
  expect(written.entrypoint).toEqual(["/usr/local/bin/charon"]);
  expect(written.id).toMatch("pluto-id");
  // charon accepts the same flag, so a hand set external ip survives the swap
  expect(written.command).toEqual(config.command);
  expect(written.command).toContain("--graffiti=custom");
  expect(written.command).toContain("--p2p-external-ip=80.249.121.1");
});

test("resolveExternalIp falls through to the next service", async () => {
  jest.mock("../../NodeConnection");
  const NodeConnection = require("../../NodeConnection");
  const exec = jest
    .fn()
    .mockResolvedValueOnce({ stdout: "", stderr: "curl: (6) Could not resolve host", rc: 6 })
    .mockResolvedValueOnce({ stdout: "80.249.121.1\n", stderr: "", rc: 0 });
  NodeConnection.NodeConnection.mockImplementation(() => {
    return { sshService: { exec: exec } };
  });

  const sm = new ServiceManager(NodeConnection.NodeConnection());

  await expect(sm.resolveExternalIp()).resolves.toMatch("80.249.121.1");
  expect(exec).toHaveBeenCalledTimes(2);
});

test("resolveExternalIp reports failure instead of a bogus address", async () => {
  jest.mock("../../NodeConnection");
  const NodeConnection = require("../../NodeConnection");
  NodeConnection.NodeConnection.mockImplementation(() => {
    return { sshService: { exec: jest.fn(() => Promise.resolve({ stdout: "<html>nope</html>", stderr: "", rc: 0 })) } };
  });

  const sm = new ServiceManager(NodeConnection.NodeConnection());

  await expect(sm.resolveExternalIp()).resolves.toBeNull();
});

// A config file that cannot be read used to abort the whole read, leaving the
// launcher with no services at all. Every file is read on its own now, so the
// readable ones still show up and the broken ones come back as such - they carry
// the service id the expert mode YAML editor needs to repair the file.

const brokenId = "9d1a4e77-1f3d-4e6b-9d9c-1a7c5b2f0333";
const unknownId = "4b5c6d7e-8f90-41a2-b3c4-d5e6f7a80444";

// mirrors NodeConnection: the file name carries the id, the content comes back
// as text, and a file that cannot be read at all throws
function nodeConnectionWithConfigs(contentByFile) {
  return {
    listServicesConfigurations: jest.fn().mockResolvedValue(Object.keys(contentByFile)),
    readServiceYAML: jest.fn(async (file) => {
      const content = contentByFile[file];
      if (content instanceof Error) throw content;
      return typeof content === "string" ? content : YAML.stringify(content);
    }),
  };
}

test("readServiceConfigurations keeps the readable configs when one is broken", async () => {
  const sm = new ServiceManager(
    nodeConnectionWithConfigs({
      "geth.yaml": { service: "GethService", id: "geth" },
      [`${brokenId}.yaml`]: "service: GethService\n  id: nested-wrong\n",
      "teku.yaml": { service: "TekuBeaconService", id: "teku" },
    })
  );

  const { services, broken } = await sm.readServiceConfigurationsWithBroken();

  expect(services.map((service) => service.id)).toEqual(["geth", "teku"]);
  expect(broken).toHaveLength(1);
  expect(broken[0].id).toEqual(brokenId);
  expect(broken[0].service).toBeNull();
  expect(broken[0].error).toMatch(/^Nested mappings are not allowed.*line 1, column 10:$/);
});

test("readServiceConfigurations returns the built services only", async () => {
  const sm = new ServiceManager(
    nodeConnectionWithConfigs({
      "geth.yaml": { service: "GethService", id: "geth" },
      [`${brokenId}.yaml`]: "service: GethService\n  id: nested-wrong\n",
    })
  );

  const serviceConfigs = await sm.readServiceConfigurations();

  expect(serviceConfigs).toHaveLength(1);
  expect(serviceConfigs[0].id).toEqual("geth");
});

test("readServiceConfigurations reports a missing and an unknown service as broken", async () => {
  const sm = new ServiceManager(
    nodeConnectionWithConfigs({
      [`${brokenId}.yaml`]: { id: brokenId, configVersion: 1 },
      [`${unknownId}.yaml`]: { id: unknownId, service: "SomeFutureClientService" },
    })
  );

  const { services, broken } = await sm.readServiceConfigurationsWithBroken();

  expect(services).toHaveLength(0);
  expect(broken).toHaveLength(2);
  expect(broken.find((entry) => entry.id === brokenId).error).toMatch(/without service/);
  expect(broken.find((entry) => entry.id === unknownId).error).toMatch(/SomeFutureClientService/);
});

test("readServiceConfigurations keeps a dependency whose own config is broken", async () => {
  const sm = new ServiceManager(
    nodeConnectionWithConfigs({
      "geth.yaml": "service: GethService\n  id: nested-wrong\n",
      "teku.yaml": {
        service: "TekuBeaconService",
        id: "teku",
        dependencies: { executionClients: [{ service: "GethService", id: "geth" }], consensusClients: [] },
      },
    })
  );

  const { services } = await sm.readServiceConfigurationsWithBroken();

  expect(services).toHaveLength(1);
  // kept, so writing teku's config back does not erase the pairing
  expect(services[0].dependencies.executionClients).toHaveLength(1);
  expect(services[0].buildConfiguration().dependencies.executionClients).toEqual([{ service: "GethService", id: "geth" }]);
});

test("readServiceConfigurations resolves dependencies into the built services", async () => {
  const sm = new ServiceManager(
    nodeConnectionWithConfigs({
      "geth.yaml": { service: "GethService", id: "geth" },
      "teku.yaml": {
        service: "TekuBeaconService",
        id: "teku",
        dependencies: { executionClients: [{ service: "GethService", id: "geth" }], consensusClients: [] },
      },
    })
  );

  const { services, broken } = await sm.readServiceConfigurationsWithBroken();
  const teku = services.find((service) => service.id === "teku");

  expect(broken).toEqual([]);
  expect(teku.dependencies.executionClients).toHaveLength(1);
  expect(teku.dependencies.executionClients[0].id).toEqual("geth");
});

test("readServiceConfigurations yields nothing when the server cannot be reached", async () => {
  const sm = new ServiceManager({
    listServicesConfigurations: jest.fn().mockRejectedValue(new Error("Not connected")),
    readServiceYAML: jest.fn(),
  });

  await expect(sm.readServiceConfigurationsWithBroken()).resolves.toEqual({ services: [], broken: [] });
});

test("readServiceConfigurations ignores what is not a config file", async () => {
  const sm = new ServiceManager(
    nodeConnectionWithConfigs({
      "geth.yaml": { service: "GethService", id: "geth" },
      "geth.yaml.bak": new Error("cat: no such file"),
      backups: new Error("cat: is a directory"),
    })
  );

  const { services, broken } = await sm.readServiceConfigurationsWithBroken();

  expect(services.map((service) => service.id)).toEqual(["geth"]);
  expect(broken).toEqual([]);
});

test("readServiceConfigurations gives up instead of calling everything broken when a read fails", async () => {
  const sm = new ServiceManager(
    nodeConnectionWithConfigs({
      "geth.yaml": { service: "GethService", id: "geth" },
      "teku.yaml": new Error("Failed reading service yaml teku: Not connected!"),
      "prysm.yaml": { service: "PrysmBeaconService", id: "prysm" },
    })
  );

  await expect(sm.readServiceConfigurationsWithBroken()).resolves.toEqual({ services: [], broken: [] });
});

test("readServiceConfigurations treats an empty read as a save in progress", async () => {
  const sm = new ServiceManager(
    nodeConnectionWithConfigs({
      "geth.yaml": { service: "GethService", id: "geth" },
      "teku.yaml": "",
    })
  );

  const { services, broken } = await sm.readServiceConfigurationsWithBroken();

  expect(services.map((service) => service.id)).toEqual(["geth"]);
  expect(broken).toEqual([]);
});

test("readServiceConfigurations does not mistake an inherited property for a service", async () => {
  const sm = new ServiceManager(nodeConnectionWithConfigs({ "odd.yaml": { service: "constructor", id: "odd" } }));

  const { services, broken } = await sm.readServiceConfigurationsWithBroken();

  expect(services).toHaveLength(0);
  expect(broken[0].error).toEqual("unknown service 'constructor'");
});

test("readServiceConfigurations survives a dependency entry that is not a service", async () => {
  const sm = new ServiceManager(
    nodeConnectionWithConfigs({
      "teku.yaml": { service: "TekuBeaconService", id: "teku", dependencies: { executionClients: [null] } },
    })
  );

  const { services } = await sm.readServiceConfigurationsWithBroken();

  expect(services).toHaveLength(1);
  expect(services[0].dependencies.executionClients).toEqual([]);
});
