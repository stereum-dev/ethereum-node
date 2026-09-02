import { GethService } from "../../ethereum-services/GethService";
import { BesuService } from "../../ethereum-services/BesuService";
import { NimbusBeaconService } from "../../ethereum-services/NimbusBeaconService";
import { PrometheusService } from "../../ethereum-services/PrometheusService";
import { PrometheusNodeExporterService } from "../../ethereum-services/PrometheusNodeExporterService";
import { GrafanaService } from "../../ethereum-services/GrafanaService";
import { ServiceManager, serivceState } from "../../ServiceManager";
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
      resolve(["first", "second"]);
    });
  });
  const readServiceConfigurationMock = jest
    .fn()
    .mockReturnValueOnce(
      new Promise((resolve) => {
        return resolve({
          service: "LighthouseBeaconService",
          id: "first",
        });
      })
    )
    .mockReturnValueOnce(
      new Promise((resolve) => {
        return resolve({
          service: "LighthouseValidatorService",
          id: "second",
        });
      })
    );

  NodeConnection.NodeConnection.mockImplementation(() => {
    return {
      listServicesConfigurations: listServicesConfigurationsMock,
      readServiceConfiguration: readServiceConfigurationMock,
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
      listServicesConfigurations: jest.fn(() => Promise.resolve(configs.map((c) => c.id))),
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
