import { NimbusBeaconService } from "../../ethereum-services/NimbusBeaconService.js";
import { ServicePort, servicePortProtocol } from "../../ethereum-services/ServicePort.js";
import { ServiceVolume } from "../../ethereum-services/ServiceVolume.js";

test("buildConfiguration", () => {
  const ports = [
    new ServicePort(null, 9000, 9000, servicePortProtocol.tcp),
    new ServicePort(null, 9000, 9000, servicePortProtocol.udp),
    new ServicePort("127.0.0.1", 9190, 9190, servicePortProtocol.tcp),
  ];

  jest.mock("../../ethereum-services/GethService");
  const GethService = require("../../ethereum-services/GethService");
  const mMock = jest.fn(() => {
    return "Ws-endpoint-string";
  });
  GethService.GethService.mockImplementation(() => {
    return {
      buildExecutionClientEngineRPCWsEndpointUrl: mMock,
      buildMinimalConfiguration: jest.fn(() => {
        return {
          id: "geth-id",
          service: "GethService",
        };
      }),
      volumes: [new ServiceVolume("some/path/data", "some/path/other/data"), new ServiceVolume("some/path/engine.jwt", "/engine.jwt")],
    };
  });

  jest.mock("../../ethereum-services/FlashbotsMevBoostService");
  const FlashbotsMevBoostService = require("../../ethereum-services/FlashbotsMevBoostService");
  const mevMock = jest.fn(() => {
    return "mevboost-http-endpoint-string";
  });
  FlashbotsMevBoostService.FlashbotsMevBoostService.mockImplementation(() => {
    return {
      buildMevboostEndpointURL: mevMock,
    };
  });

  const nimbusService = NimbusBeaconService.buildByUserInput(
    "prater",
    ports,
    "/opt/stereum/nimbus",
    [new GethService.GethService()],
    []
  ).buildConfiguration();

  expect(nimbusService.command).toContain("--web3-url=Ws-endpoint-string");
  expect(nimbusService.command).toContain("--network=prater");
  expect(nimbusService.volumes).toHaveLength(2);
  expect(nimbusService.volumes).toContain("/opt/stereum/nimbus-" + nimbusService.id + "/beacon:/opt/app/beacon");
  expect(nimbusService.volumes).toContain("some/path/engine.jwt:/engine.jwt");
  expect(nimbusService.ports).toHaveLength(3);
  expect(nimbusService.id).toHaveLength(36);
  expect(nimbusService.user).toMatch(/2000/);
  expect(nimbusService.image).toMatch(/statusim\/nimbus-eth2/);
  expect(nimbusService.configVersion).toBe(2);
});

test("buildConsensusClientWsEndpointUrl", () => {
  const ports = [
    new ServicePort(null, 100, 200, servicePortProtocol.tcp),
    new ServicePort(null, 101, 202, servicePortProtocol.udp),
    new ServicePort("1.2.3.4", 303, 404, servicePortProtocol.udp),
  ];

  jest.mock("../../ethereum-services/GethService");
  const GethService = require("../../ethereum-services/GethService");
  const mMock = jest.fn(() => {
    return "Ws-endpoint-string";
  });
  GethService.GethService.mockImplementation(() => {
    return {
      buildExecutionClientEngineRPCWsEndpointUrl: mMock,
      buildMinimalConfiguration: jest.fn(() => {
        return {
          id: "geth-id",
          service: "GethService",
        };
      }),
      volumes: [new ServiceVolume("some/path/data", "some/path/other/data"), new ServiceVolume("some/path/engine.jwt", "/engine.jwt")],
    };
  });

  const nimbusEndpoint = NimbusBeaconService.buildByUserInput(
    "prater",
    ports,
    "/opt/stereum/nimbus",
    [new GethService.GethService()],
    []
  ).buildConsensusClientHttpEndpointUrl();

  expect(nimbusEndpoint).toMatch(/http:\/\/stereum-.{36}:5052/);
});

test("getAvailablePorts", () => {
  jest.mock("../../ethereum-services/GethService");
  const GethService = require("../../ethereum-services/GethService");
  const mMock = jest.fn(() => {
    return "Ws-endpoint-string";
  });
  GethService.GethService.mockImplementation(() => {
    return {
      buildExecutionClientEngineRPCWsEndpointUrl: mMock,
      buildMinimalConfiguration: jest.fn(() => {
        return {
          id: "geth-id",
          service: "GethService",
        };
      }),
      volumes: [new ServiceVolume("some/path/data", "some/path/other/data"), new ServiceVolume("some/path/engine.jwt", "/engine.jwt")],
    };
  });
  const nimbusServicePorts = NimbusBeaconService.buildByUserInput(
    "prater",
    [],
    "/opt/stereum/nimbus",
    [new GethService.GethService()],
    []
  ).getAvailablePorts();

  expect(nimbusServicePorts).toHaveLength(4);
});

test("network", () => {
  jest.mock("../../ethereum-services/GethService");
  const GethService = require("../../ethereum-services/GethService");
  const mMock = jest.fn(() => {
    return "Ws-endpoint-string";
  });
  GethService.GethService.mockImplementation(() => {
    return {
      buildExecutionClientEngineRPCWsEndpointUrl: mMock,
      buildMinimalConfiguration: jest.fn(() => {
        return {
          id: "geth-id",
          service: "GethService",
        };
      }),
      volumes: [new ServiceVolume("some/path/data", "some/path/other/data"), new ServiceVolume("some/path/engine.jwt", "/engine.jwt")],
    };
  });
  const nimbusService = NimbusBeaconService.buildByUserInput(
    "goerli",
    [],
    "/opt/stereum/nimbus",
    [new GethService.GethService()],
    []
  ).buildConfiguration();

  expect(nimbusService.network).toMatch(/goerli/);
});

test("buildByConfiguration", () => {
  const nimbus = NimbusBeaconService.buildByConfiguration({
    id: "123",
    service: "NimbusBeaconService",
    configVersion: 234,
    image: "nimbusbeacon:v0.0.1",
    ports: ["0.0.0.0:1234:5678/tcp", "8.8.8.8:1234:5678/udp"],
    volumes: ["/opt/stereum/foo:/opt/app/data"],
  });

  expect(nimbus.id).toBe("123");
  expect(nimbus.service).toBe("NimbusBeaconService");
  expect(nimbus.configVersion).toBe(234);
  expect(nimbus.image).toBe("nimbusbeacon");
  expect(nimbus.imageVersion).toBe("v0.0.1");
  expect(nimbus.ports).toHaveLength(2);
  expect(nimbus.ports[0].destinationPort).toBe("1234");
  expect(nimbus.ports[1].servicePort).toBe("5678");

  expect(nimbus.volumes).toHaveLength(1);
  expect(nimbus.volumes[0]).toBeDefined();
});

test("getDataDir", () => {
  const service = NimbusBeaconService.buildByUserInput("goerli", [], "/opt/stereum/app");
  const serviceDataDir = service.getDataDir();
  expect(serviceDataDir).toBe("/opt/stereum/app-" + service.id + "/beacon");
});

// EOF
