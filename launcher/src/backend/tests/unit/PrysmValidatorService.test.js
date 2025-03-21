import { PrysmValidatorService } from "../../ethereum-services/PrysmValidatorService";
import { ServicePort, servicePortProtocol } from "../../ethereum-services/ServicePort.js";

test("buildConfiguration", () => {
  jest.mock("../../ethereum-services/PrysmBeaconService");
  const PrysmBeaconService = require("../../ethereum-services/PrysmBeaconService");
  PrysmBeaconService.PrysmBeaconService.mockImplementation(() => {
    return {
      buildConsensusClientEndpoint: jest.fn(() => {
        return "buildConsensusClientEndpoint";
      }),
      buildConsensusClientGateway: jest.fn(() => {
        return "buildConsensusClientGateway";
      }),
      buildConsensusClientHttpEndpointUrl: jest.fn(() => {
        return "buildConsensusClientHttpEndpointUrl";
      }),
      buildMinimalConfiguration: jest.fn(() => {
        return {
          id: "prysm_bc-id",
          service: "PrysmBeaconService",
        };
      }),
    };
  });
  const ports = [new ServicePort("1.2.3.4", 303, 404, servicePortProtocol.udp)];

  const prysm = PrysmValidatorService.buildByUserInput("prater", ports, "/opt/stereum/prysm", [
    new PrysmBeaconService.PrysmBeaconService(),
  ]).buildConfiguration();

  expect(prysm.command).toContain("--beacon-rest-api-provider=buildConsensusClientHttpEndpointUrl");
  expect(prysm.volumes).toHaveLength(4);
  expect(prysm.volumes).toContain("/opt/stereum/prysm-" + prysm.id + "/data/db:/opt/app/data/db");
  expect(prysm.volumes).toContain("/opt/stereum/prysm-" + prysm.id + "/data/wallets:/opt/app/data/wallets");
  expect(prysm.volumes).toContain("/opt/stereum/prysm-" + prysm.id + "/data/passwords:/opt/app/data/passwords");
  expect(prysm.volumes).toContain("/opt/stereum/prysm-" + prysm.id + "/graffitis:/opt/app/graffitis");
  expect(prysm.ports).toHaveLength(1);
  expect(prysm.id).toHaveLength(36);
  expect(prysm.user).toMatch(/2000/);
  expect(prysm.image).toMatch(/prysmaticlabs\/prysm-validator/);
  expect(prysm.configVersion).toBe(1);

  expect(prysm.service).toMatch(/PrysmValidatorService/);
});

test("getAvailablePorts", () => {
  const ports = [new ServicePort("1.2.3.4", 303, 404, servicePortProtocol.udp)];
  const prysm = PrysmValidatorService.buildByUserInput("prater", ports, "/opt/stereum/prysm", []).getAvailablePorts();

  expect(prysm).toHaveLength(1);
});

test("autoupdate", () => {
  const ports = [new ServicePort("1.2.3.4", 303, 404, servicePortProtocol.udp)];
  const prysm = PrysmValidatorService.buildByUserInput("prater", ports, "/opt/stereum/prysm", []).buildConfiguration();

  expect(prysm.autoupdate).toBe(true);
});

test("autoupdate", () => {
  const ports = [new ServicePort("1.2.3.4", 303, 404, servicePortProtocol.udp)];
  const prysm = PrysmValidatorService.buildByUserInput("prater", ports, "/opt/stereum/prysm", []).buildConfiguration();

  expect(prysm.network).toBe("prater");
});

test("buildByConfiguration", () => {
  const provider = "provider";
  const providerGateway = "gateway";

  const network = "prater";

  const dataDir = "/opt/app/data/db";
  const walletDir = "/opt/app/data/wallets";
  const passwordDir = "/opt/app/data/passwords";

  const prysm = PrysmValidatorService.buildByConfiguration({
    id: "312",
    service: "PrysmValidatorService",
    configVersion: 555,
    image: "prysm:v1.8.7",
    command:
      "/app/cmd/validator/validator" +
      '--accept-terms-of-use=true --beacon-rpc-provider="' +
      provider +
      '" --beacon-rpc-gateway-provider="' +
      providerGateway +
      '" --web=true --' +
      network +
      "=true --datadir=" +
      dataDir +
      " --wallet-dir=" +
      walletDir +
      " --wallet-password-file=" +
      passwordDir +
      '/wallet-password --monitoring-host=0.0.0.0 --grpc-gateway-port=7500 --grpc-gateway-host=0.0.0.0 --grpc-gateway-corsdomain="*"', //command
  });

  expect(prysm.id).toBe("312");
  expect(prysm.service).toBe("PrysmValidatorService");
  expect(prysm.configVersion).toBe(555);
  expect(prysm.image).toBe("prysm");
  expect(prysm.imageVersion).toBe("v1.8.7");
  expect(prysm.ports).toHaveLength(0);

  expect(prysm.volumes).toHaveLength(0);

  expect(prysm.command).toBeDefined();
  expect(prysm.command).toMatch(/--beacon-rpc-provider="provider"/);
  expect(prysm.command).toMatch(/--beacon-rpc-gateway-provider="gateway"/);
  expect(prysm.command).toMatch(/--prater=true/);
  expect(prysm.command).toMatch(/--datadir=\/opt\/app\/data\/db/);
  expect(prysm.command).toMatch(/--wallet-dir=\/opt\/app\/data\/wallets/);
  expect(prysm.command).toMatch(/--wallet-password-file=\/opt\/app\/data\/passwords/);
});

test("getDataDir", () => {
  const service = PrysmValidatorService.buildByUserInput("goerli", [], "/opt/stereum/app");
  const serviceDataDir = service.getDataDir();
  expect(serviceDataDir).toBeFalsy();
});
