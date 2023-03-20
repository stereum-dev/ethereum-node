import { SSVNetworkService } from "./ethereum-services/SSVNetworkService";
import { GethService } from "./ethereum-services/GethService";
import { BesuService } from "./ethereum-services/BesuService";
import { NimbusBeaconService } from "./ethereum-services/NimbusBeaconService";
import { PrometheusService } from "./ethereum-services/PrometheusService";
import { PrometheusNodeExporterService } from "./ethereum-services/PrometheusNodeExporterService";
import { GrafanaService } from "./ethereum-services/GrafanaService";
import { ServicePort, servicePortProtocol } from "./ethereum-services/ServicePort";
import { StringUtils } from "./StringUtils.js";
import { ServiceManager, serivceState } from "./ServiceManager";
import { LighthouseBeaconService } from "./ethereum-services/LighthouseBeaconService";
import { LighthouseValidatorService } from "./ethereum-services/LighthouseValidatorService";
import { PrysmBeaconService } from "./ethereum-services/PrysmBeaconService";
import { PrysmValidatorService } from "./ethereum-services/PrysmValidatorService";
import { TekuBeaconService } from "./ethereum-services/TekuBeaconService";
import { NethermindService } from "./ethereum-services/NethermindService";
import { FlashbotsMevBoostService } from "./ethereum-services/FlashbotsMevBoostService";

test("manageServiceState success", async () => {
  jest.mock("./NodeConnection");
  const NodeConnection = require("./NodeConnection");
  const mMock = jest.fn((pb, args) => {
    return new Promise(async (resolve, reject) => {
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
  jest.mock("./NodeConnection");
  const NodeConnection = require("./NodeConnection");
  const mMock = jest.fn((pb, args) => {
    return new Promise(async (resolve, reject) => {
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
  jest.mock("./NodeConnection");
  const NodeConnection = require("./NodeConnection");
  const listServicesConfigurationsMock = jest.fn(() => {
    return new Promise(async (resolve, reject) => {
      resolve(["first", "second"]);
    });
  });
  const readServiceConfigurationMock = jest
    .fn()
    .mockReturnValueOnce(
      new Promise(async (resolve, reject) => {
        return resolve({
          service: "LighthouseBeaconService",
          id: "first",
        });
      })
    )
    .mockReturnValueOnce(
      new Promise(async (resolve, reject) => {
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
  jest.mock("./NodeConnection");
  const NodeConnection = require("./NodeConnection");
  const listServicesConfigurationsMock = jest.fn(() => {
    return new Promise(async (resolve, reject) => {
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
});

test("addDependencies FlashbotsMevBoost", () => {
  const sm = new ServiceManager();
  const lhService1 = LighthouseBeaconService.buildByUserInput("prater", [], "/opt/stereum/lh1", [], []);
  const lhService2 = LighthouseBeaconService.buildByUserInput("prater", [], "/opt/stereum/lh2", [], []);
  const mevboost = FlashbotsMevBoostService.buildByUserInput("goerli");
  const result = sm.addDependencies(mevboost, [lhService1, lhService2]);
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

  expect(result).toMatch(/--execution-endpoint=http:\/\/stereum-.{36}:8551,http:\/\/stereum-.{36}:8551/);
});

test("addConnection array empty dependencies", () => {
  const geth1 = GethService.buildByUserInput("goerli", [], "/opt/stereum/geth");
  const lhService = LighthouseBeaconService.buildByUserInput("prater", [], "/opt/stereum/prysm", [geth1], []);
  const dependencies = []
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
  const dependencies = []
  const endpointCommand = "--execution-endpoint=";
  const filter = (e) => e.buildExecutionClientEngineRPCHttpEndpointUrl();

  const sm = new ServiceManager();
  const result = sm.addCommandConnection(prysm, endpointCommand, dependencies, filter);

  expect(result).not.toMatch(/--execution-endpoint=/);
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

  expect(result).not.toMatch(
    /--beacon-rpc-provider="stereum-42d9f0b4-257f-f71e-10fe-66c342dd4995:4000,stereum-foo:3000,stereum-bar:2000"/
  );
  expect(result).not.toMatch(
    /--beacon-rpc-gateway-provider=stereum-foo:3000,stereum-42d9f0b4-257f-f71e-10fe-66c342dd4995:3500/
  );
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

  expect(result).not.toContain(
    '--ee-endpoint="http://stereum-9adfdb2e-9f5b-aba4-cfde-f3483d7aac8d:8551,foo:3000,bar:2000"'
  );
  expect(result).toContain('--ee-endpoint="foo:3000,bar:2000"');
});

test("change network", () => {
  let services = [];
  let installDir = "/opt/stereum";
  let checkpointURL = undefined;
  let relayURL =
    "https://0x8f7b17a74569b7a57e9bdafd2e159380759f5dc3ccbd4bf600414147e8c4e1dc6ebada83c0139ac15850eb6c975e82d0@builder-relay-goerli.blocknative.com";
  let oldNetwork = "goerli";
  let newNetwork = "mainnet";
  const sm = new ServiceManager();
  services.push(GethService.buildByUserInput(oldNetwork, [], installDir + "/geth"));
  services.push(BesuService.buildByUserInput(oldNetwork, [], installDir + "/besu"));
  services.push(NethermindService.buildByUserInput(oldNetwork, [], installDir + "/nethermind"));
  services.push(FlashbotsMevBoostService.buildByUserInput(oldNetwork, relayURL));
  services.push(
    LighthouseBeaconService.buildByUserInput(oldNetwork, [], installDir + "/lighthouse", [], [], checkpointURL)
  );
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
  expect(services.find((s) => s.service === "PrysmBeaconService").command).toMatch(/--mainnet/);
  expect(services.find((s) => s.service === "PrysmBeaconService").command).not.toMatch(
    /--genesis-state=\/opt\/app\/genesis\/prysm\-prater\-genesis\.ssz/
  );
  expect(services.find((s) => s.service === "LighthouseBeaconService").command).toContain("--network=mainnet");
});
