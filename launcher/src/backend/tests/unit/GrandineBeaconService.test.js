import { GrandineBeaconService } from "../../ethereum-services/GrandineBeaconService.js";
import { ServicePort, servicePortProtocol } from "../../ethereum-services/ServicePort.js";
import { ServiceVolume } from "../../ethereum-services/ServiceVolume.js";
import { GethService } from "../../ethereum-services/GethService.js";
import { FlashbotsMevBoostService } from "../../ethereum-services/FlashbotsMevBoostService.js";
import { ServiceManager } from "../../ServiceManager.js";
jest.mock("../../ethereum-services/GethService");
jest.mock("../../ethereum-services/FlashbotsMevBoostService");

beforeAll(() => {
  // Mock GethService
  GethService.mockImplementation(() => {
    return {
      buildExecutionClientEngineRPCHttpEndpointUrl: jest.fn(() => {
        return "http-geth-endpoint-string";
      }),
      buildMinimalConfiguration: jest.fn(() => {
        return {
          id: "geth-id",
          service: "GethService",
        };
      }),
      volumes: [new ServiceVolume("/opt/stereum/geth/engine.jwt", "/engine.jwt")],
    };
  });

  // Mock FlashbotsMevBoostService
  FlashbotsMevBoostService.mockImplementation(() => {
    return {
      buildMevboostEndpointURL: jest.fn(() => {
        return "http-mev-endpoint-string";
      }),
      buildMinimalConfiguration: jest.fn(() => {
        return {
          id: "mev-id",
          service: "FlashbotsMevBoostService",
        };
      }),
    };
  });
});

test("buildConfiguration via ServiceManager", () => {
  const geth = new GethService();
  const mev = new FlashbotsMevBoostService();
  const grandine = new ServiceManager().getService("GrandineBeaconService", {
    network: "holesky",
    installDir: "/opt/stereum",
    executionClients: [geth],
    mevboost: [mev],
    checkpointURL: "http://checkpoint-url",
  });

  const configuration = grandine.buildConfiguration();

  expect(configuration.command).toContain("--eth1-rpc-urls=http-geth-endpoint-string");
  expect(configuration.command).toContain("--checkpoint-sync-url=http://checkpoint-url");
  expect(configuration.command).toContain("--builder-api-url=http-mev-endpoint-string");
  expect(configuration.volumes).toHaveLength(2);
  expect(configuration.volumes).toContain("/opt/stereum/geth/engine.jwt:/engine.jwt");
  expect(configuration.volumes).toContain("/opt/stereum/grandine-" + configuration.id + "/data:/opt/app/data");
  expect(configuration.ports).toHaveLength(4);
  expect(configuration.id).toHaveLength(36);
  expect(configuration.user).toMatch(/2000/);
  expect(configuration.image).toMatch(/sifrai\/grandine/);
  expect(configuration.dependencies.executionClients).toHaveLength(1);
  expect(configuration.dependencies.executionClients).toContainEqual(geth.buildMinimalConfiguration());
  expect(configuration.dependencies.mevboost).toHaveLength(1);
  expect(configuration.dependencies.mevboost).toContainEqual(mev.buildMinimalConfiguration());
});

test("buildConfiguration via buildByUserInput", () => {
  const geth = new GethService();
  const mev = new FlashbotsMevBoostService();
  const grandine = GrandineBeaconService.buildByUserInput(
    "holesky",
    [new ServicePort(null, 5052, 5052, servicePortProtocol.tcp)],
    "/opt/stereum",
    [geth],
    [mev],
    "http://checkpoint-url"
  );

  const configuration = grandine.buildConfiguration();

  expect(configuration.command).toContain("--eth1-rpc-urls=http-geth-endpoint-string");
  expect(configuration.command).toContain("--checkpoint-sync-url=http://checkpoint-url");
  expect(configuration.command).toContain("--builder-api-url=http-mev-endpoint-string");
  expect(configuration.volumes).toHaveLength(2);
  expect(configuration.volumes).toContain("/opt/stereum/geth/engine.jwt:/engine.jwt");
  expect(configuration.volumes).toContain("/opt/stereum-" + configuration.id + "/data:/opt/app/data");
  expect(configuration.ports).toHaveLength(1);
  expect(configuration.id).toHaveLength(36);
  expect(configuration.user).toMatch(/2000/);
  expect(configuration.image).toMatch(/sifrai\/grandine/);
  expect(configuration.dependencies.executionClients).toHaveLength(1);
  expect(configuration.dependencies.executionClients).toContainEqual(geth.buildMinimalConfiguration());
  expect(configuration.dependencies.mevboost).toHaveLength(1);
  expect(configuration.dependencies.mevboost).toContainEqual(mev.buildMinimalConfiguration());
});

test("buildByConfiguration", () => {
  const grandine = GrandineBeaconService.buildByConfiguration({
    service: "GrandineBeaconService",
    id: "grandine-id",
    configVersion: 1,
    image: "sifrai/grandine:v1.0.0",
    ports: [new ServicePort(null, 5052, 5052, servicePortProtocol.tcp).buildPortMapping()],
    volumes: [new ServiceVolume("/foo/bar", "/opt/app/data").buildVolumeMapping()],
    network: "holesky",
  });
  console.log(new ServicePort(null, 5052, 5052, servicePortProtocol.tcp));
  expect(grandine.id).toBe("grandine-id");
  expect(grandine.image).toBe("sifrai/grandine");
  expect(grandine.imageVersion).toBe("v1.0.0");
  expect(grandine.ports).toHaveLength(1);
  expect(grandine.ports).toContainEqual(
    ServicePort.buildByConfig(new ServicePort(null, 5052, 5052, servicePortProtocol.tcp).buildPortMapping())
  );
  expect(grandine.volumes).toHaveLength(1);
  expect(grandine.volumes).toContainEqual(ServiceVolume.buildByConfig(new ServiceVolume("/foo/bar", "/opt/app/data").buildVolumeMapping()));
  expect(grandine.network).toBe("holesky");
});

test("buildConsensusClientHttpEndpointUrl", () => {
  const grandine = new GrandineBeaconService();
  grandine.id = "grandine-id";

  expect(grandine.buildConsensusClientHttpEndpointUrl()).toBe("http://stereum-grandine-id:5052");
});

test("buildConsensusClientEndpoint", () => {
  const grandine = new GrandineBeaconService();
  grandine.id = "grandine-id";

  expect(grandine.buildConsensusClientEndpoint()).toBe("stereum-grandine-id:5052");
});

test("buildConsensusClientGateway", () => {
  const grandine = new GrandineBeaconService();
  grandine.id = "grandine-id";

  expect(grandine.buildConsensusClientGateway()).toBe("stereum-grandine-id:5052");
});

test("buildMinimalConfiguration", () => {
  const grandine = new GrandineBeaconService();
  console.log(grandine);
  grandine.id = "grandine-id";
  grandine.service = "GrandineBeaconService";

  expect(grandine.buildMinimalConfiguration()).toEqual({
    id: "grandine-id",
    service: "GrandineBeaconService",
  });
});

test("getDataDir", () => {
  const grandine = new GrandineBeaconService();
  grandine.id = "grandine-id";
  grandine.volumes = [new ServiceVolume("/foo/bar", "/opt/app/data")];

  expect(grandine.getDataDir()).toBe("/foo/bar");
});
