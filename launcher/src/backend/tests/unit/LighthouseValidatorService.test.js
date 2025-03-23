import { LighthouseValidatorService } from "../../ethereum-services/LighthouseValidatorService.js";
import { ServicePort, servicePortProtocol } from "../../ethereum-services/ServicePort.js";

test("LighthouseValidatorService buildConfiguration", () => {
  jest.mock("../../ethereum-services/LighthouseBeaconService");
  const LighthouseBeaconService = require("../../ethereum-services/LighthouseBeaconService");
  const mMock = jest.fn(() => {
    return "http-endpoint-string";
  });
  LighthouseBeaconService.LighthouseBeaconService.mockImplementation(() => {
    return {
      buildConsensusClientHttpEndpointUrl: mMock,
      buildMinimalConfiguration: jest.fn(() => {
        return {
          id: "lh_bc-id",
          service: "LighthouseBeaconService",
        };
      }),
    };
  });
  const ports = [new ServicePort("1.2.3.4", 303, 404, servicePortProtocol.udp)];

  const lhService = LighthouseValidatorService.buildByUserInput("prater", ports, "/opt/stereum/lh", [
    new LighthouseBeaconService.LighthouseBeaconService(),
  ]).buildConfiguration();

  expect(lhService.command).toContain("--beacon-nodes=http-endpoint-string");
  expect(lhService.volumes).toHaveLength(2);
  expect(lhService.volumes).toContain("/opt/stereum/lh-" + lhService.id + "/validator:/opt/app/validator");
  expect(lhService.volumes).toContain("/opt/stereum/lh-" + lhService.id + "/graffitis:/opt/app/graffitis");
  expect(lhService.ports).toHaveLength(1);
  expect(lhService.id).toHaveLength(36);
  expect(lhService.user).toMatch(/2000/);
  expect(lhService.image).toMatch(/sigp\/lighthouse/);
  expect(lhService.configVersion).toBe(1);

  expect(lhService.service).toMatch(/LighthouseValidatorService/);
});

test("LighthouseValidatorService getAvailablePorts", () => {
  const ports = [new ServicePort("1.2.3.4", 303, 404, servicePortProtocol.udp)];
  const lhService = LighthouseValidatorService.buildByUserInput("prater", ports, "/opt/stereum/lh", [], "foobar").getAvailablePorts();

  expect(lhService).toHaveLength(1);
});

test("LighthouseValidatorService autoupdate", () => {
  const ports = [new ServicePort("1.2.3.4", 303, 404, servicePortProtocol.udp)];
  const lhService = LighthouseValidatorService.buildByUserInput("prater", ports, "/opt/stereum/lh", [], "foobar").buildConfiguration();

  expect(lhService.autoupdate).toBe(true);
});

test("LighthouseValidatorService network", () => {
  const ports = [new ServicePort("1.2.3.4", 303, 404, servicePortProtocol.udp)];
  const lhService = LighthouseValidatorService.buildByUserInput("mainnet", ports, "/opt/stereum/lh", [], "foobar").buildConfiguration();

  expect(lhService.network).toBe("mainnet");
});

test("buildByConfiguration", () => {
  const bn1 = "http://node1:5052";
  const bn2 = "https://node2:999";

  const lh = LighthouseValidatorService.buildByConfiguration({
    id: "123",
    service: "LighthouseValidatorService",
    configVersion: 333,
    image: "lhval:v0.0.1",
    command: [
      "lighthouse",
      "vc",
      "--debug-level=debug",
      "--network=prater",
      `--beacon-nodes=${bn1},${bn2}`,
      `--datadir=/opt/app/validator`,
      "--init-slashing-protection",
      '--graffiti="stereum.net"',
      "--metrics",
      "--metrics-address=0.0.0.0",
      "--http",
      "--http-address=0.0.0.0",
      "--unencrypted-http-transport",
    ],
  });

  expect(lh.id).toBe("123");
  expect(lh.service).toBe("LighthouseValidatorService");
  expect(lh.configVersion).toBe(333);
  expect(lh.image).toBe("lhval");
  expect(lh.imageVersion).toBe("v0.0.1");
  expect(lh.ports).toHaveLength(0);

  expect(lh.volumes).toHaveLength(0);

  expect(lh.command).toBeDefined();
  expect(lh.command).toContain("--debug-level=debug");
  expect(lh.command).toContain("--beacon-nodes=http://node1:5052,https://node2:999");
});

test("getDataDir", () => {
  const service = LighthouseValidatorService.buildByUserInput("goerli", [], "/opt/stereum/app");
  const serviceDataDir = service.getDataDir();
  expect(serviceDataDir).toBeFalsy();
});

// EOF
