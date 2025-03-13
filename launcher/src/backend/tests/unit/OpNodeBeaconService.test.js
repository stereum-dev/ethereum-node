import { OpNodeBeaconService } from "../../ethereum-services/OpNodeBeaconService.js";
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
    return "l1-http-endpoint-string";
  });
  GethService.GethService.mockImplementation(() => {
    return {
      service: "GethService",
      buildExecutionClientHttpEndpointUrl: mMock,
      buildMinimalConfiguration: jest.fn(() => {
        return {
          id: "geth-id",
          service: "GethService",
        };
      }),
      volumes: [new ServiceVolume("some/path/data", "some/path/other/data"), new ServiceVolume("some/path/engine.jwt", "/engine.jwt")],
    };
  });

  jest.mock("../../ethereum-services/OpGethService");
  const OpGethService = require("../../ethereum-services/OpGethService");
  const opgethMock = jest.fn(() => {
    return "l2-http-endpoint-string";
  });
  OpGethService.OpGethService.mockImplementation(() => {
    return {
      service: "OpGethService",
      buildExecutionClientEngineRPCHttpEndpointUrl: opgethMock,
      buildMinimalConfiguration: jest.fn(() => {
        return {
          id: "op-geth-id",
          service: "OpGethService",
        };
      }),
      volumes: [
        new ServiceVolume("some/path/data", "some/path/other/data"),
        new ServiceVolume("some/path/op-engine.jwt", "/op-engine.jwt"),
      ],
    };
  });

  jest.mock("../../ethereum-services/LighthouseBeaconService");
  const LighthouseBeaconService = require("../../ethereum-services/LighthouseBeaconService");
  const lhbeaconMock = jest.fn(() => {
    return "lh-http-endpoint-string";
  });
  LighthouseBeaconService.LighthouseBeaconService.mockImplementation(() => {
    return {
      buildConsensusClientHttpEndpointUrl: lhbeaconMock,
      buildMinimalConfiguration: jest.fn(() => {
        return {
          id: "lh_bc-id",
          service: "LighthouseBeaconService",
        };
      }),
    };
  });

  const opNodeService = OpNodeBeaconService.buildByUserInput(
    "op-sepolia",
    ports,
    "/opt/stereum/op-node",
    [new GethService.GethService(), new OpGethService.OpGethService()],
    [new LighthouseBeaconService.LighthouseBeaconService()]
  ).buildConfiguration();

  expect(opNodeService.command).toContain("--l1=l1-http-endpoint-string");
  expect(opNodeService.command).toContain("--l2=l2-http-endpoint-string");
  expect(opNodeService.command).toContain("--l1.beacon=lh-http-endpoint-string");
  expect(opNodeService.volumes).toHaveLength(2);
  expect(opNodeService.volumes).toContain("/opt/stereum/op-node-" + opNodeService.id + ":/p2p");
  expect(opNodeService.ports).toHaveLength(3);
  expect(opNodeService.id).toHaveLength(36);
  expect(opNodeService.user).toMatch(/2000/);
  expect(opNodeService.image).toMatch(/us-docker.pkg.dev\/oplabs-tools-artifacts\/images\/op-node/);
  expect(opNodeService.configVersion).toBe(1);
});

test("getAvailablePorts", () => {
  jest.mock("../../ethereum-services/GethService");
  const GethService = require("../../ethereum-services/GethService");
  const mMock = jest.fn(() => {
    return "l1-http-endpoint-string";
  });
  GethService.GethService.mockImplementation(() => {
    return {
      service: "GethService",
      buildExecutionClientHttpEndpointUrl: mMock,
      buildMinimalConfiguration: jest.fn(() => {
        return {
          id: "geth-id",
          service: "GethService",
        };
      }),
      volumes: [new ServiceVolume("some/path/data", "some/path/other/data"), new ServiceVolume("some/path/engine.jwt", "/engine.jwt")],
    };
  });
  const opNodeServicePorts = OpNodeBeaconService.buildByUserInput(
    "",
    [],
    "/opt/stereum/op-node",
    [new GethService.GethService()],
    []
  ).getAvailablePorts();

  expect(opNodeServicePorts).toHaveLength(3);
});

test("network", () => {
  jest.mock("../../ethereum-services/GethService");
  const GethService = require("../../ethereum-services/GethService");
  const mMock = jest.fn(() => {
    return "l1-http-endpoint-string";
  });
  GethService.GethService.mockImplementation(() => {
    return {
      service: "GethService",
      buildExecutionClientHttpEndpointUrl: mMock,
      buildMinimalConfiguration: jest.fn(() => {
        return {
          id: "geth-id",
          service: "GethService",
        };
      }),
      volumes: [new ServiceVolume("some/path/data", "some/path/other/data"), new ServiceVolume("some/path/engine.jwt", "/engine.jwt")],
    };
  });
  const opNodeServiceNetwork = OpNodeBeaconService.buildByUserInput(
    "op-sepolia",
    [],
    "/opt/stereum/op-node",
    [new GethService.GethService()],
    []
  ).buildConfiguration();

  expect(opNodeServiceNetwork.network).toMatch(/op-sepolia/);
});

test("buildByConfiguration", () => {
  const opNode = OpNodeBeaconService.buildByConfiguration({
    id: "123",
    service: "OpNodeBeaconService",
    configVersion: 678,
    image: "opnodebeacon:v0.0.1",
    ports: ["0.0.0.0:1234:5678/tcp", "8.8.8.8:1234:5678/udp"],
    volumes: ["/opt/stereum/foo:/opt/app/data"],
  });

  expect(opNode.id).toBe("123");
  expect(opNode.service).toBe("OpNodeBeaconService");
  expect(opNode.configVersion).toBe(678);
  expect(opNode.image).toBe("opnodebeacon");
  expect(opNode.imageVersion).toBe("v0.0.1");
  expect(opNode.ports).toHaveLength(2);
  expect(opNode.ports[0].destinationPort).toBe("1234");
  expect(opNode.ports[1].servicePort).toBe("5678");

  expect(opNode.volumes).toHaveLength(1);
  expect(opNode.volumes[0]).toBeDefined();
});

// EOF
