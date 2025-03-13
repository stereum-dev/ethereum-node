import { OpErigonService } from "../../ethereum-services/OpErigonService.js";
import { ServicePort, servicePortProtocol } from "../../ethereum-services/ServicePort.js";

test("id test", () => {
  expect(OpErigonService.buildByUserInput("op-mainnet").id).toBeDefined();
});

test("network test op-mainnet", () => {
  expect(OpErigonService.buildByUserInput("op-mainnet", null, null, []).buildConfiguration().command).toContain("--chain=op-mainnet");
});

test("network test op-sepolia", () => {
  expect(OpErigonService.buildByUserInput("op-sepolia", null, null, []).buildConfiguration().command).toContain("--chain=op-sepolia");
});

test("user", () => {
  expect(OpErigonService.buildByUserInput("op-mainnet", null, null, []).buildConfiguration().user).toMatch(/root/);
});

test("image", () => {
  expect(OpErigonService.buildByUserInput("op-mainnet", null, null, []).buildConfiguration().image).toMatch(/testinprod\/op-erigon/);
});

test("endpoint url", () => {
  expect(OpErigonService.buildByUserInput("op-mainnet", null, null, []).buildExecutionClientHttpEndpointUrl()).toMatch(
    new RegExp("^http://stereum-.*:8545")
  );
});

test("endpoint ws url", () => {
  expect(OpErigonService.buildByUserInput("op-mainnet", null, null, []).buildExecutionClientWsEndpointUrl()).toMatch(
    new RegExp("^ws://stereum-.*:8546")
  );
});

test("empty ports", () => {
  expect(OpErigonService.buildByUserInput("op-mainnet", null, null, []).buildConfiguration().ports).toHaveLength(0);
});

test("ports", () => {
  expect(
    OpErigonService.buildByUserInput(
      "op-mainnet",
      [new ServicePort(null, 100, 200, servicePortProtocol.tcp)],
      null,
      []
    ).buildConfiguration().ports
  ).toHaveLength(1);
  expect(
    OpErigonService.buildByUserInput(
      "op-mainnet",
      [new ServicePort(null, 100, 200, servicePortProtocol.tcp)],
      null,
      []
    ).buildConfiguration().ports
  ).toContain("0.0.0.0:100:200/tcp");
});

test("multiple ports", () => {
  const ports = [
    new ServicePort(null, 100, 200, servicePortProtocol.tcp),
    new ServicePort(null, 101, 202, servicePortProtocol.udp),
    new ServicePort("1.2.3.4", 303, 404, servicePortProtocol.udp),
  ];

  const opErigonService = OpErigonService.buildByUserInput("op-mainnet", ports, null, []).buildConfiguration();

  expect(opErigonService.ports).toHaveLength(3);
  expect(opErigonService.ports).toContain("0.0.0.0:100:200/tcp");
  expect(opErigonService.ports).toContain("0.0.0.0:101:202/udp");
  expect(opErigonService.ports).toContain("1.2.3.4:303:404/udp");
});

test("workingDir", () => {
  const opErigonConfig = OpErigonService.buildByUserInput("op-mainnet", null, "opt//stereum/op-erigon/", []).buildConfiguration();

  expect(opErigonConfig.volumes).toHaveLength(2);
  expect(opErigonConfig.volumes).toContain("/opt/stereum/op-erigon-" + opErigonConfig.id + "/data:/op-erigon");
});

test("buildByConfiguration", () => {
  const opErigonConfig = OpErigonService.buildByConfiguration({
    id: "987",
    service: "OpErigonService",
    configVersion: 1,
    image: "op-erigon:v0.0.1",
  }).buildConfiguration();

  expect(opErigonConfig.id).toBe("987");
  expect(opErigonConfig.service).toBe("OpErigonService");
  expect(opErigonConfig.configVersion).toBe(1);
});

// EOF
