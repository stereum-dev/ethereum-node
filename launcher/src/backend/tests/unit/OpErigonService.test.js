import { OpErigonService } from "../../ethereum-services/OpErigonService.js";
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

  const opErigon = OpErigonService.buildByUserInput("op-mainnet", ports, "/opt/stereum/op-erigon", [
    new L2GethService.L2GethService(),
  ]).buildConfiguration();

  expect(opErigon.command).toContain("--rollup.historicalrpc=l2geth-http-endpoint-string");
  expect(opErigon.volumes).toHaveLength(2);
  expect(opErigon.volumes).toContain("/opt/stereum/op-erigon-" + opErigon.id + "/data:/op-erigon");
  expect(opErigon.ports).toHaveLength(4);
  expect(opErigon.id).toHaveLength(36);
  expect(opErigon.user).toMatch(/root/);
  expect(opErigon.image).toMatch(/testinprod\/op-erigon/);
  expect(opErigon.configVersion).toBe(1);
});

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
