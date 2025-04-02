import { L2GethService } from "../../ethereum-services/L2GethService.js";
import { ServicePort, servicePortProtocol } from "../../ethereum-services/ServicePort.js";

test("id test", () => {
  expect(L2GethService.buildByUserInput("op-mainnet").id).toBeDefined();
});

test("user", () => {
  expect(L2GethService.buildByUserInput("op-mainnet", null, null).buildConfiguration().user).toMatch(/root/);
});

test("image", () => {
  expect(L2GethService.buildByUserInput("op-mainnet", null, null).buildConfiguration().image).toMatch(/ethereumoptimism\/l2geth/);
});

test("endpoint url", () => {
  expect(L2GethService.buildByUserInput("op-mainnet", null, null).buildExecutionClientRPCEndpointUrl()).toMatch(
    new RegExp("^http://stereum-.*:8545")
  );
});

test("empty ports", () => {
  expect(L2GethService.buildByUserInput("op-mainnet", null, null).buildConfiguration().ports).toHaveLength(0);
});

test("ports", () => {
  expect(
    L2GethService.buildByUserInput("op-mainnet", [new ServicePort(null, 100, 200, servicePortProtocol.tcp)], null).buildConfiguration()
      .ports
  ).toHaveLength(1);
  expect(
    L2GethService.buildByUserInput("op-mainnet", [new ServicePort(null, 100, 200, servicePortProtocol.tcp)], null).buildConfiguration()
      .ports
  ).toContain("0.0.0.0:100:200/tcp");
});

test("multiple ports", () => {
  const ports = [
    new ServicePort(null, 100, 200, servicePortProtocol.tcp),
    new ServicePort(null, 101, 202, servicePortProtocol.udp),
    new ServicePort("1.2.3.4", 303, 404, servicePortProtocol.udp),
  ];

  const l2GethService = L2GethService.buildByUserInput("op-mainnet", ports, null).buildConfiguration();

  expect(l2GethService.ports).toHaveLength(3);
  expect(l2GethService.ports).toContain("0.0.0.0:100:200/tcp");
  expect(l2GethService.ports).toContain("0.0.0.0:101:202/udp");
  expect(l2GethService.ports).toContain("1.2.3.4:303:404/udp");
});

test("workingDir", () => {
  const l2GethConfig = L2GethService.buildByUserInput("op-mainnet", null, "opt//stereum/l2-geth/").buildConfiguration();

  expect(l2GethConfig.volumes).toHaveLength(1);
  expect(l2GethConfig.volumes).toContain("/opt/stereum/l2-geth-" + l2GethConfig.id + "/data:/l2-geth");
});

test("buildByConfiguration", () => {
  const l2GethConfig = L2GethService.buildByConfiguration({
    id: "987",
    service: "L2GethService",
    configVersion: 1,
    image: "l2geth:v0.0.1",
  }).buildConfiguration();

  expect(l2GethConfig.id).toBe("987");
  expect(l2GethConfig.service).toBe("L2GethService");
  expect(l2GethConfig.configVersion).toBe(1);
});

// EOF
