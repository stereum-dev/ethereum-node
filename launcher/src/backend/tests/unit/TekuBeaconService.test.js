import { TekuBeaconService } from "../../ethereum-services/TekuBeaconService.js";
import { ServicePort, servicePortProtocol } from "../../ethereum-services/ServicePort.js";
import { ServiceVolume } from "../../ethereum-services/ServiceVolume.js";

test("buildConfiguration", () => {
  const ports = [
    new ServicePort(null, 9001, 9001, servicePortProtocol.tcp),
    new ServicePort(null, 9001, 9001, servicePortProtocol.udp),
    new ServicePort("127.0.0.1", 5052, 5052, servicePortProtocol.tcp),
    new ServicePort("127.0.0.1", 5051, 5051, servicePortProtocol.tcp),
    new ServicePort("127.0.0.1", 8008, 8008, servicePortProtocol.tcp),
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

  const tekuService = TekuBeaconService.buildByUserInput(
    "prater",
    ports,
    "/opt/stereum/teku",
    [new GethService.GethService()],
    []
  ).buildConfiguration();

  expect(tekuService.command).toContain("--ee-endpoint=http-endpoint-string");
  expect(tekuService.command).toContain("--network=prater");
  expect(tekuService.volumes).toHaveLength(2);
  expect(tekuService.volumes).toContain("/opt/stereum/teku-" + tekuService.id + "/data:/opt/app/data");
  expect(tekuService.ports).toHaveLength(5);
  expect(tekuService.id).toHaveLength(36);
  expect(tekuService.user).toMatch(/2000/);
  expect(tekuService.image).toMatch(/consensys\/teku/);
  expect(tekuService.configVersion).toBe(2);
});

test("buildConsensusClientHttpEndpointUrl", () => {
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

  const tekuEndpoint = TekuBeaconService.buildByUserInput(
    "prater",
    ports,
    "/opt/stereum/teku",
    [new GethService.GethService()],
    [],
    "stereum.net"
  ).buildConsensusClientHttpEndpointUrl();

  expect(tekuEndpoint).toMatch(/http:\/\/stereum-.{36}:5051/);
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
  const tekuServicePorts = TekuBeaconService.buildByUserInput(
    "prater",
    [],
    "/opt/stereum/teku",
    [new GethService.GethService()],
    [],
    "stereum.net"
  ).getAvailablePorts();

  expect(tekuServicePorts).toHaveLength(5);
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
  const tekuService = TekuBeaconService.buildByUserInput(
    "goerli",
    [],
    "/opt/stereum/teku",
    [new GethService.GethService()],
    [],
    "stereum.net"
  ).buildConfiguration();

  expect(tekuService.network).toMatch(/goerli/);
});

test("buildByConfiguration", () => {
  const tekuService = TekuBeaconService.buildByConfiguration({
    id: "423",
    service: "TekuBeaconService",
    configVersion: 926,
    image: "tekubeacon:v1.3.3.7",
    ports: ["0.0.0.0:1234:5678/tcp", "8.8.8.8:1234:5678/udp"],
    volumes: ["/opt/stereum/foo:/opt/app/data"],
  });

  expect(tekuService.id).toBe("423");
  expect(tekuService.service).toBe("TekuBeaconService");
  expect(tekuService.configVersion).toBe(926);
  expect(tekuService.image).toBe("tekubeacon");
  expect(tekuService.imageVersion).toBe("v1.3.3.7");
  expect(tekuService.ports).toHaveLength(2);
  expect(tekuService.ports[0].destinationPort).toBe("1234");
  expect(tekuService.ports[1].servicePort).toBe("5678");

  expect(tekuService.volumes).toHaveLength(1);
  expect(tekuService.volumes[0]).toBeDefined();
});

test("getDataDir", () => {
  const service = TekuBeaconService.buildByUserInput("goerli", [], "/opt/stereum/app");
  const serviceDataDir = service.getDataDir();
  expect(serviceDataDir).toBe("/opt/stereum/app-" + service.id + "/data");
});

// EOF
