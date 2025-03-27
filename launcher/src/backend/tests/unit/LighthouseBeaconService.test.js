import { LighthouseBeaconService } from "../../ethereum-services/LighthouseBeaconService.js";
import { ServicePort, servicePortProtocol } from "../../ethereum-services/ServicePort.js";
import { ServiceVolume } from "../../ethereum-services/ServiceVolume.js";

test("buildConfiguration", () => {
  const ports = [
    new ServicePort(null, 100, 200, servicePortProtocol.tcp),
    new ServicePort(null, 101, 202, servicePortProtocol.udp),
    new ServicePort("1.2.3.4", 303, 404, servicePortProtocol.udp),
  ];

  jest.mock("../../ethereum-services/GethService");
  const GethService = require("../../ethereum-services/GethService");
  const mMock = jest.fn(() => {
    return "http-endpoint-string";
  });
  GethService.GethService.mockImplementation(() => {
    return {
      buildExecutionClientEngineRPCHttpEndpointUrl: mMock,
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

  const lhService = LighthouseBeaconService.buildByUserInput(
    "prater",
    ports,
    "/opt/stereum/lh",
    [new GethService.GethService()],
    []
  ).buildConfiguration();

  expect(lhService.command).toContain("--execution-endpoint=http-endpoint-string");
  expect(lhService.volumes).toHaveLength(3);
  expect(lhService.volumes).toContain("/opt/stereum/lh-" + lhService.id + "/beacon:/opt/app/beacon");
  expect(lhService.volumes).toContain("/opt/stereum/lh-" + lhService.id + "/slasher:/opt/app/slasher");
  expect(lhService.ports).toHaveLength(3);
  expect(lhService.id).toHaveLength(36);
  expect(lhService.user).toMatch(/2000/);
  expect(lhService.image).toMatch(/sigp\/lighthouse/);
  expect(lhService.configVersion).toBe(1);
});

test("buildConsensusClientHttpEndpointUrl", () => {
  jest.mock("../../ethereum-services/GethService");
  const GethService = require("../../ethereum-services/GethService");
  const mMock = jest.fn(() => {
    return "http-endpoint-string";
  });
  GethService.GethService.mockImplementation(() => {
    return {
      buildExecutionClientEngineRPCHttpEndpointUrl: mMock,
      buildMinimalConfiguration: jest.fn(() => {
        return {
          id: "geth-id",
          service: "GethService",
        };
      }),
      volumes: [new ServiceVolume("some/path/data", "some/path/other/data"), new ServiceVolume("some/path/engine.jwt", "/engine.jwt")],
    };
  });
  const ports = [
    new ServicePort(null, 100, 200, servicePortProtocol.tcp),
    new ServicePort(null, 101, 202, servicePortProtocol.udp),
    new ServicePort("1.2.3.4", 303, 404, servicePortProtocol.udp),
  ];

  const lhService = LighthouseBeaconService.buildByUserInput(
    "prater",
    ports,
    "/opt/stereum/lh",
    [new GethService.GethService()],
    []
  ).buildConsensusClientHttpEndpointUrl();

  expect(lhService).toMatch(/http:\/\/stereum-.{36}:5052/);
});

test("getAvailablePorts", () => {
  jest.mock("../../ethereum-services/GethService");
  const GethService = require("../../ethereum-services/GethService");
  const mMock = jest.fn(() => {
    return "http-endpoint-string";
  });
  GethService.GethService.mockImplementation(() => {
    return {
      buildExecutionClientEngineRPCHttpEndpointUrl: mMock,
      buildMinimalConfiguration: jest.fn(() => {
        return {
          id: "geth-id",
          service: "GethService",
        };
      }),
      volumes: [new ServiceVolume("some/path/data", "some/path/other/data"), new ServiceVolume("some/path/engine.jwt", "/engine.jwt")],
    };
  });
  const lhServicePorts = LighthouseBeaconService.buildByUserInput(
    "prater",
    [],
    "/opt/stereum/lh",
    [new GethService.GethService()],
    []
  ).getAvailablePorts();

  expect(lhServicePorts).toHaveLength(3);
});

test("network", () => {
  jest.mock("../../ethereum-services/GethService");
  const GethService = require("../../ethereum-services/GethService");
  const mMock = jest.fn(() => {
    return "http-endpoint-string";
  });
  GethService.GethService.mockImplementation(() => {
    return {
      buildExecutionClientEngineRPCHttpEndpointUrl: mMock,
      buildMinimalConfiguration: jest.fn(() => {
        return {
          id: "geth-id",
          service: "GethService",
        };
      }),
      volumes: [new ServiceVolume("some/path/data", "some/path/other/data"), new ServiceVolume("some/path/engine.jwt", "/engine.jwt")],
    };
  });
  const lhServicePorts = LighthouseBeaconService.buildByUserInput(
    "goerli",
    [],
    "/opt/stereum/lh",
    [new GethService.GethService()],
    []
  ).buildConfiguration();

  expect(lhServicePorts.network).toMatch(/goerli/);
});

test("buildByConfiguration", () => {
  const lh = LighthouseBeaconService.buildByConfiguration({
    id: "123",
    service: "LighthouseBeaconService",
    configVersion: 678,
    image: "lhbeacon:v0.0.1",
    ports: ["0.0.0.0:1234:5678/tcp", "8.8.8.8:1234:5678/udp"],
    volumes: ["/opt/stereum/foo:/opt/app/data"],
  });

  expect(lh.id).toBe("123");
  expect(lh.service).toBe("LighthouseBeaconService");
  expect(lh.configVersion).toBe(678);
  expect(lh.image).toBe("lhbeacon");
  expect(lh.imageVersion).toBe("v0.0.1");
  expect(lh.ports).toHaveLength(2);
  expect(lh.ports[0].destinationPort).toBe("1234");
  expect(lh.ports[1].servicePort).toBe("5678");

  expect(lh.volumes).toHaveLength(1);
  expect(lh.volumes[0]).toBeDefined();
});

test("getDataDir", () => {
  const service = LighthouseBeaconService.buildByUserInput("goerli", [], "/opt/stereum/app");
  const serviceDataDir = service.getDataDir();
  expect(serviceDataDir).toBe("/opt/stereum/app-" + service.id + "/beacon");
});

// EOF
