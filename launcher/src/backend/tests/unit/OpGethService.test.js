import { OpGethService } from "../../ethereum-services/OpGethService.js";
import { ServicePort, servicePortProtocol } from "../../ethereum-services/ServicePort.js";
import { ServiceVolume } from "../../ethereum-services/ServiceVolume.js";

test("buildConfiguration", () => {
  const ports = [
    new ServicePort(null, 100, 200, servicePortProtocol.tcp),
    new ServicePort(null, 101, 202, servicePortProtocol.udp),
    new ServicePort("1.2.3.4", 303, 404, servicePortProtocol.udp),
    new ServicePort("5.6.7.8", 305, 406, servicePortProtocol.udp),
  ];

  jest.mock("../../ethereum-services/L2GethService");
  const L2GethService = require("../../ethereum-services/L2GethService");
  const l2gethMock = jest.fn(() => {
    return "l2geth-http-endpoint-string";
  });
  L2GethService.L2GethService.mockImplementation(() => {
    return {
      service: "L2GethService",
      buildExecutionClientRPCEndpointUrl: l2gethMock,
      buildMinimalConfiguration: jest.fn(() => {
        return {
          id: "l2-geth-id",
          service: "L2GethService",
        };
      }),
      volumes: [new ServiceVolume("some/path/data", "some/path/other/data")],
    };
  });

  const opGeth = OpGethService.buildByUserInput("op-mainnet", ports, "/opt/stereum/op-geth", [
    new L2GethService.L2GethService(),
  ]).buildConfiguration();

  expect(opGeth.command).toContain("--rollup.historicalrpc=l2geth-http-endpoint-string");
  expect(opGeth.volumes).toHaveLength(2);
  expect(opGeth.volumes).toContain("/opt/stereum/op-geth-" + opGeth.id + "/data:/op-geth");
  expect(opGeth.ports).toHaveLength(4);
  expect(opGeth.id).toHaveLength(36);
  expect(opGeth.user).toMatch(/root/);
  expect(opGeth.image).toMatch(/us-docker.pkg.dev\/oplabs-tools-artifacts\/images\/op-geth/);
  expect(opGeth.configVersion).toBe(1);
});

test("id test", () => {
  expect(OpGethService.buildByUserInput("op-mainnet").id).toBeDefined();
});

test("network test op-mainnet", () => {
  expect(OpGethService.buildByUserInput("op-mainnet", null, null, []).buildConfiguration().command).toContain("--op-network=op-mainnet");
});

test("network test op-sepolia", () => {
  expect(OpGethService.buildByUserInput("op-sepolia", null, null, []).buildConfiguration().command).toContain("--op-network=op-sepolia");
});

test("user", () => {
  expect(OpGethService.buildByUserInput("op-mainnet", null, null, []).buildConfiguration().user).toMatch(/root/);
});

test("image", () => {
  expect(OpGethService.buildByUserInput("op-mainnet", null, null, []).buildConfiguration().image).toMatch(
    /us-docker.pkg.dev\/oplabs-tools-artifacts\/images\/op-geth/
  );
});

test("endpoint url", () => {
  expect(OpGethService.buildByUserInput("op-mainnet", null, null, []).buildExecutionClientHttpEndpointUrl()).toMatch(
    new RegExp("^http://stereum-.*:8545")
  );
});

test("endpoint ws url", () => {
  expect(OpGethService.buildByUserInput("op-mainnet", null, null, []).buildExecutionClientWsEndpointUrl()).toMatch(
    new RegExp("^ws://stereum-.*:8546")
  );
});

test("empty ports", () => {
  expect(OpGethService.buildByUserInput("op-mainnet", null, null, []).buildConfiguration().ports).toHaveLength(0);
});

test("ports", () => {
  expect(
    OpGethService.buildByUserInput("op-mainnet", [new ServicePort(null, 100, 200, servicePortProtocol.tcp)], null, []).buildConfiguration()
      .ports
  ).toHaveLength(1);
  expect(
    OpGethService.buildByUserInput("op-mainnet", [new ServicePort(null, 100, 200, servicePortProtocol.tcp)], null, []).buildConfiguration()
      .ports
  ).toContain("0.0.0.0:100:200/tcp");
});

test("multiple ports", () => {
  const ports = [
    new ServicePort(null, 100, 200, servicePortProtocol.tcp),
    new ServicePort(null, 101, 202, servicePortProtocol.udp),
    new ServicePort("1.2.3.4", 303, 404, servicePortProtocol.udp),
  ];

  const opGethService = OpGethService.buildByUserInput("op-mainnet", ports, null, []).buildConfiguration();

  expect(opGethService.ports).toHaveLength(3);
  expect(opGethService.ports).toContain("0.0.0.0:100:200/tcp");
  expect(opGethService.ports).toContain("0.0.0.0:101:202/udp");
  expect(opGethService.ports).toContain("1.2.3.4:303:404/udp");
});

test("workingDir", () => {
  const opGethConfig = OpGethService.buildByUserInput("op-mainnet", null, "opt//stereum/op-geth/", []).buildConfiguration();

  expect(opGethConfig.volumes).toHaveLength(2);
  expect(opGethConfig.volumes).toContain("/opt/stereum/op-geth-" + opGethConfig.id + "/data:/op-geth");
});

test("buildByConfiguration", () => {
  const opGethConfig = OpGethService.buildByConfiguration({
    id: "987",
    service: "OpGethService",
    configVersion: 1,
    image: "op-geth:v0.0.1",
  }).buildConfiguration();

  expect(opGethConfig.id).toBe("987");
  expect(opGethConfig.service).toBe("OpGethService");
  expect(opGethConfig.configVersion).toBe(1);
});

// EOF
