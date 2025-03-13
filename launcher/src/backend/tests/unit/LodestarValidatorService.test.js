import { LodestarValidatorService } from "../../ethereum-services/LodestarValidatorService.js";
import { ServicePort, servicePortProtocol } from "../../ethereum-services/ServicePort.js";

test("LodestarValidatorService buildConfiguration", () => {
  jest.mock("../../ethereum-services/LodestarBeaconService");
  const LodestarBeaconService = require("../../ethereum-services/LodestarBeaconService");
  const mMock = jest.fn(() => {
    return "http-endpoint-string";
  });
  LodestarBeaconService.LodestarBeaconService.mockImplementation(() => {
    return {
      buildConsensusClientHttpEndpointUrl: mMock,
      buildMinimalConfiguration: jest.fn(() => {
        return {
          id: "l_bc-id",
          service: "LodestarBeaconService",
        };
      }),
    };
  });
  const ports = [new ServicePort("1.2.3.4", 303, 404, servicePortProtocol.udp)];

  const lService = LodestarValidatorService.buildByUserInput("prater", ports, "/opt/stereum/l", [
    new LodestarBeaconService.LodestarBeaconService(),
  ]).buildConfiguration();

  expect(lService.command).toContain("--beaconNodes=http-endpoint-string");
  expect(lService.volumes).toHaveLength(1);
  expect(lService.volumes).toContain("/opt/stereum/l-" + lService.id + "/validator:/opt/app/validator");
  expect(lService.ports).toHaveLength(1);
  expect(lService.id).toHaveLength(36);
  expect(lService.user).toMatch(/2000/);
  expect(lService.image).toMatch(/chainsafe\/lodestar/);
  expect(lService.configVersion).toBe(1);

  expect(lService.service).toMatch(/LodestarValidatorService/);
});

test("LodestarValidatorService getAvailablePorts", () => {
  const ports = [new ServicePort("1.2.3.4", 303, 404, servicePortProtocol.udp)];
  const lService = LodestarValidatorService.buildByUserInput("prater", ports, "/opt/stereum/l", [], "foobar").getAvailablePorts();

  expect(lService).toHaveLength(1);
});

test("LodestarValidatorService autoupdate", () => {
  const ports = [new ServicePort("1.2.3.4", 303, 404, servicePortProtocol.udp)];
  const lService = LodestarValidatorService.buildByUserInput("prater", ports, "/opt/stereum/l", [], "foobar").buildConfiguration();

  expect(lService.autoupdate).toBe(true);
});

test("LodestarValidatorService network", () => {
  const ports = [new ServicePort("1.2.3.4", 303, 404, servicePortProtocol.udp)];
  const lService = LodestarValidatorService.buildByUserInput("mainnet", ports, "/opt/stereum/l", [], "foobar").buildConfiguration();

  expect(lService.network).toBe("mainnet");
});

test("buildByConfiguration", () => {
  const bn1 = "http://node1:9596";
  const bn2 = "https://node2:999";

  const l = LodestarValidatorService.buildByConfiguration({
    id: "123",
    service: "LodestarValidatorService",
    configVersion: 333,
    image: "lval:v1.0.0",
    command: [
      `validator`,
      `--network=goerli`,
      `--dataDir=/opt/app/validator`,
      `--beaconNodes=${bn1},${bn2}`,
      `--keymanager=true`,
      `--keymanager.address=0.0.0.0`,
      `--keymanager.port=5062`,
      `--metrics=true`,
      `--metrics.port=5064`,
      `--metrics.address=0.0.0.0`,
      `--logLevel=debug`,
    ],
  });

  expect(l.id).toBe("123");
  expect(l.service).toBe("LodestarValidatorService");
  expect(l.configVersion).toBe(333);
  expect(l.image).toBe("lval");
  expect(l.imageVersion).toBe("v1.0.0");
  expect(l.ports).toHaveLength(0);

  expect(l.volumes).toHaveLength(0);

  expect(l.command).toBeDefined();
  expect(l.command).toContain("--logLevel=debug");
  expect(l.command).toContain("--beaconNodes=http://node1:9596,https://node2:999");
});

test("getDataDir", () => {
  const service = LodestarValidatorService.buildByUserInput("goerli", [], "/opt/stereum/app");
  const serviceDataDir = service.getDataDir();
  expect(serviceDataDir).toBeFalsy();
});

// EOF
