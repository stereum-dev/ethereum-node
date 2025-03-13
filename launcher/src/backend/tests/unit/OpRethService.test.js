import { OpRethService } from "../../ethereum-services/OpRethService.js";
import { ServicePort, servicePortProtocol } from "../../ethereum-services/ServicePort.js";

test("id test", () => {
  expect(OpRethService.buildByUserInput("op-mainnet").id).toBeDefined();
});

test("network test op-mainnet", () => {
  expect(OpRethService.buildByUserInput("op-mainnet", null, null).buildConfiguration().command).toContain("--chain=optimism");
});

test("network test op-sepolia", () => {
  expect(OpRethService.buildByUserInput("op-sepolia", null, null).buildConfiguration().command).toContain("--chain=optimism-sepolia");
});

test("user", () => {
  expect(OpRethService.buildByUserInput("op-mainnet", null, null).buildConfiguration().user).toMatch(/root/);
});

test("image", () => {
  expect(OpRethService.buildByUserInput("op-mainnet", null, null).buildConfiguration().image).toMatch(/ghcr.io\/paradigmxyz\/op-reth/);
});

test("endpoint url", () => {
  expect(OpRethService.buildByUserInput("op-mainnet", null, null).buildExecutionClientHttpEndpointUrl()).toMatch(
    new RegExp("^http://stereum-.*:8545")
  );
});

test("endpoint ws url", () => {
  expect(OpRethService.buildByUserInput("op-mainnet", null, null).buildExecutionClientWsEndpointUrl()).toMatch(
    new RegExp("^ws://stereum-.*:8546")
  );
});

test("empty ports", () => {
  expect(OpRethService.buildByUserInput("op-mainnet", null, null).buildConfiguration().ports).toHaveLength(0);
});

test("ports", () => {
  expect(
    OpRethService.buildByUserInput("op-mainnet", [new ServicePort(null, 100, 200, servicePortProtocol.tcp)], null).buildConfiguration()
      .ports
  ).toHaveLength(1);
  expect(
    OpRethService.buildByUserInput("op-mainnet", [new ServicePort(null, 100, 200, servicePortProtocol.tcp)], null).buildConfiguration()
      .ports
  ).toContain("0.0.0.0:100:200/tcp");
});

test("multiple ports", () => {
  const ports = [
    new ServicePort(null, 100, 200, servicePortProtocol.tcp),
    new ServicePort(null, 101, 202, servicePortProtocol.udp),
    new ServicePort("1.2.3.4", 303, 404, servicePortProtocol.udp),
  ];

  const opRethService = OpRethService.buildByUserInput("op-mainnet", ports, null).buildConfiguration();

  expect(opRethService.ports).toHaveLength(3);
  expect(opRethService.ports).toContain("0.0.0.0:100:200/tcp");
  expect(opRethService.ports).toContain("0.0.0.0:101:202/udp");
  expect(opRethService.ports).toContain("1.2.3.4:303:404/udp");
});

test("workingDir", () => {
  const opRethConfig = OpRethService.buildByUserInput("op-mainnet", null, "opt//stereum/op-reth/").buildConfiguration();

  expect(opRethConfig.volumes).toHaveLength(2);
  expect(opRethConfig.volumes).toContain("/opt/stereum/op-reth-" + opRethConfig.id + "/data:/op-reth");
});

test("buildByConfiguration", () => {
  const opRethConfig = OpRethService.buildByConfiguration({
    id: "987",
    service: "OpRethService",
    configVersion: 1,
    image: "op-reth:v0.0.1",
  }).buildConfiguration();

  expect(opRethConfig.id).toBe("987");
  expect(opRethConfig.service).toBe("OpRethService");
  expect(opRethConfig.configVersion).toBe(1);
});

// EOF
