import { PrysmBeaconService } from "../../ethereum-services/PrysmBeaconService";
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

  const prysm = PrysmBeaconService.buildByUserInput(
    "prater",
    ports,
    "/opt/stereum/prysm/",
    [new GethService.GethService(), new GethService.GethService()],
    []
  ).buildConfiguration();

  expect(prysm.command).toContain("--execution-endpoint=http-endpoint-string,http-endpoint-string");
  expect(prysm.volumes).toHaveLength(4);
  expect(prysm.volumes).toContain("/opt/stereum/prysm-" + prysm.id + "/beacon:/opt/app/beacon");
  expect(prysm.volumes).toContain("/opt/stereum/prysm-" + prysm.id + "/genesis:/opt/app/genesis");
  expect(prysm.ports).toHaveLength(3);
  expect(prysm.id).toHaveLength(36);
  expect(prysm.user).toMatch(/2000/);
  expect(prysm.image).toMatch(/prysmaticlabs\/prysm-beacon-chain/);
  expect(prysm.configVersion).toBe(1);
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

  const prysm = PrysmBeaconService.buildByUserInput(
    "prater",
    ports,
    "/opt/stereum/prysm",
    [new GethService.GethService()],
    []
  ).buildConsensusClientHttpEndpointUrl();

  expect(prysm).toMatch(/http:\/\/stereum-.{36}:3500/);
});

test("buildConsensusClientGateway", () => {
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

  const prysm = PrysmBeaconService.buildByUserInput(
    "prater",
    ports,
    "/opt/stereum/prysm",
    [new GethService.GethService()],
    []
  ).buildConsensusClientGateway();

  expect(prysm).toMatch(/stereum-.{36}:3500/);
});

test("buildConsensusClientEndpoint", () => {
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

  const prysm = PrysmBeaconService.buildByUserInput(
    "prater",
    ports,
    "/opt/stereum/prysm",
    [new GethService.GethService()],
    []
  ).buildConsensusClientEndpoint();

  expect(prysm).toMatch(/stereum-.{36}:4000/);
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

  const prysmPorts = PrysmBeaconService.buildByUserInput(
    "prater",
    [],
    "/opt/stereum/prysm",
    [new GethService.GethService()],
    []
  ).getAvailablePorts();

  expect(prysmPorts).toHaveLength(3);
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

  const prysmNetwork = PrysmBeaconService.buildByUserInput(
    "prater",
    [],
    "/opt/stereum/prysm",
    [new GethService.GethService()],
    []
  ).buildConfiguration();

  expect(prysmNetwork.network).toMatch(/prater/);
});

test("buildByConfiguration", () => {
  const prysm = PrysmBeaconService.buildByConfiguration({
    id: "321",
    service: "PrysmBeaconService",
    configVersion: 216,
    image: "prysmatic:v3.2.1",
    ports: ["0.0.0.0:1234:5678/tcp", "8.8.8.8:1234:5678/udp"],
    volumes: ["/opt/stereum/foo:/opt/app/data"],
  });

  expect(prysm.id).toBe("321");
  expect(prysm.service).toBe("PrysmBeaconService");
  expect(prysm.configVersion).toBe(216);
  expect(prysm.image).toBe("prysmatic");
  expect(prysm.imageVersion).toBe("v3.2.1");
  expect(prysm.ports).toHaveLength(2);
  expect(prysm.ports[0].destinationPort).toBe("1234");
  expect(prysm.ports[1].servicePort).toBe("5678");

  expect(prysm.volumes).toHaveLength(1);
  expect(prysm.volumes[0]).toBeDefined();
});

test("getDataDir", () => {
  const service = PrysmBeaconService.buildByUserInput("goerli", [], "/opt/stereum/app");
  const serviceDataDir = service.getDataDir();
  expect(serviceDataDir).toBe("/opt/stereum/app-" + service.id + "/beacon");
});

// EOF
