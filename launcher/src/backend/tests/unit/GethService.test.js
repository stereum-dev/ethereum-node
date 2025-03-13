import { GethService } from "../../ethereum-services/GethService.js";
import { ServicePort, servicePortProtocol } from "../../ethereum-services/ServicePort.js";

test("id test", () => {
  expect(GethService.buildByUserInput("prater").id).toBeDefined();
});

test("network test goerli", () => {
  expect(GethService.buildByUserInput("goerli", null, null).buildConfiguration().command).toContain("--goerli");
});

test("network test mainnet", () => {
  expect(GethService.buildByUserInput("mainnet", null, null).buildConfiguration().command).not.toContain("--goerli");
});

test("user", () => {
  expect(GethService.buildByUserInput("mainnet", null, null).buildConfiguration().user).toMatch(/root/);
});

test("image", () => {
  expect(GethService.buildByUserInput("mainnet", null, null).buildConfiguration().image).toMatch(/ethereum\/client-go/);
});

test("endpoint url", () => {
  expect(GethService.buildByUserInput("mainnet", null, null).buildExecutionClientHttpEndpointUrl()).toMatch(
    new RegExp("^http://stereum-.*:8545")
  );
});

test("endpoint ws url", () => {
  expect(GethService.buildByUserInput("mainnet", null, null).buildExecutionClientWsEndpointUrl()).toMatch(
    new RegExp("^ws://stereum-.*:8546")
  );
});

test("empty ports", () => {
  expect(GethService.buildByUserInput("goerli", null, null).buildConfiguration().ports).toHaveLength(0);
});

test("ports", () => {
  expect(
    GethService.buildByUserInput("goerli", [new ServicePort(null, 100, 200, servicePortProtocol.tcp)], null).buildConfiguration().ports
  ).toHaveLength(1);
  expect(
    GethService.buildByUserInput("goerli", [new ServicePort(null, 100, 200, servicePortProtocol.tcp)], null).buildConfiguration().ports
  ).toContain("0.0.0.0:100:200/tcp");
});

test("multiple ports", () => {
  const ports = [
    new ServicePort(null, 100, 200, servicePortProtocol.tcp),
    new ServicePort(null, 101, 202, servicePortProtocol.udp),
    new ServicePort("1.2.3.4", 303, 404, servicePortProtocol.udp),
  ];

  const gethService = GethService.buildByUserInput("goerli", ports, null).buildConfiguration();

  expect(gethService.ports).toHaveLength(3);
  expect(gethService.ports).toContain("0.0.0.0:100:200/tcp");
  expect(gethService.ports).toContain("0.0.0.0:101:202/udp");
  expect(gethService.ports).toContain("1.2.3.4:303:404/udp");
});

test("workingDir", () => {
  const gethConfig = GethService.buildByUserInput("goerli", null, "opt//stereum/geth/").buildConfiguration();

  expect(gethConfig.volumes).toHaveLength(2);
  expect(gethConfig.volumes).toContain("/opt/stereum/geth-" + gethConfig.id + "/data:/opt/data/geth");
});

test("buildByConfiguration", () => {
  const gethConfig = GethService.buildByConfiguration({
    id: "987",
    service: "GethService",
    configVersion: 1,
    image: "geth:v0.0.1",
  }).buildConfiguration();

  expect(gethConfig.id).toBe("987");
  expect(gethConfig.service).toBe("GethService");
  expect(gethConfig.configVersion).toBe(1);
});

test("getDataDir", () => {
  const service = GethService.buildByUserInput("goerli", [], "/opt/stereum/app");
  const serviceDataDir = service.getDataDir();
  expect(serviceDataDir).toBe("/opt/stereum/app-" + service.id + "/data");
});

// EOF
