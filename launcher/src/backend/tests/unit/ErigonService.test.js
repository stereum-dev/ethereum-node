import { ErigonService } from "../../ethereum-services/ErigonService.js";
import { ServicePort, servicePortProtocol } from "../../ethereum-services/ServicePort.js";

test("id test", () => {
  expect(ErigonService.buildByUserInput("prater").id).toBeDefined();
});

test("network test goerli", () => {
  expect(ErigonService.buildByUserInput("goerli", null, null).buildConfiguration().command).toContain("--chain=goerli");
});

test("network test mainnet", () => {
  expect(ErigonService.buildByUserInput("mainnet", null, null).buildConfiguration().command).not.toContain("--chain=goerli");
});

test("user", () => {
  expect(ErigonService.buildByUserInput("mainnet", null, null).buildConfiguration().user).toMatch(/root/);
});

test("image", () => {
  expect(ErigonService.buildByUserInput("mainnet", null, null).buildConfiguration().image).toMatch(/erigontech\/erigon/);
});

test("endpoint url", () => {
  expect(ErigonService.buildByUserInput("mainnet", null, null).buildExecutionClientHttpEndpointUrl()).toMatch(
    new RegExp("^http://stereum-.*:8545")
  );
});

test("endpoint ws url", () => {
  expect(ErigonService.buildByUserInput("mainnet", null, null).buildExecutionClientWsEndpointUrl()).toMatch(
    new RegExp("^ws://stereum-.*:8545")
  );
});

test("empty ports", () => {
  expect(ErigonService.buildByUserInput("goerli", null, null).buildConfiguration().ports).toHaveLength(0);
});

test("ports", () => {
  expect(
    ErigonService.buildByUserInput("goerli", [new ServicePort(null, 100, 200, servicePortProtocol.tcp)], null).buildConfiguration().ports
  ).toHaveLength(1);
  expect(
    ErigonService.buildByUserInput("goerli", [new ServicePort(null, 100, 200, servicePortProtocol.tcp)], null).buildConfiguration().ports
  ).toContain("0.0.0.0:100:200/tcp");
});

test("multiple ports", () => {
  const ports = [
    new ServicePort(null, 100, 200, servicePortProtocol.tcp),
    new ServicePort(null, 101, 202, servicePortProtocol.udp),
    new ServicePort("1.2.3.4", 303, 404, servicePortProtocol.udp),
  ];

  const erigonService = ErigonService.buildByUserInput("goerli", ports, null).buildConfiguration();

  expect(erigonService.ports).toHaveLength(3);
  expect(erigonService.ports).toContain("0.0.0.0:100:200/tcp");
  expect(erigonService.ports).toContain("0.0.0.0:101:202/udp");
  expect(erigonService.ports).toContain("1.2.3.4:303:404/udp");
});

test("workingDir", () => {
  const erigonConfig = ErigonService.buildByUserInput("goerli", null, "/opt/stereum/erigon").buildConfiguration();

  expect(erigonConfig.volumes).toHaveLength(2);
  expect(erigonConfig.volumes).toContain("/opt/stereum/erigon-" + erigonConfig.id + "/data:/opt/data/erigon");
});

test("buildByConfiguration", () => {
  const erigonConfig = ErigonService.buildByConfiguration({
    id: "987",
    service: "ErigonService",
    configVersion: 1,
    image: "erigon:v2022.09.03",
  }).buildConfiguration();

  expect(erigonConfig.id).toBe("987");
  expect(erigonConfig.service).toBe("ErigonService");
  expect(erigonConfig.configVersion).toBe(1);
});

test("getDataDir", () => {
  const service = ErigonService.buildByUserInput("goerli", [], "/opt/stereum/app");
  const serviceDataDir = service.getDataDir();
  expect(serviceDataDir).toBe("/opt/stereum/app-" + service.id + "/data");
});

// EOF
