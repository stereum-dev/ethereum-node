import { NethermindService } from "../../ethereum-services/NethermindService";
import { ServicePort, servicePortProtocol } from "../../ethereum-services/ServicePort";

test("buildByUserInput", () => {
  const ports = [new ServicePort(null, 4040, 4040, servicePortProtocol.tcp)];

  const nethermindService = NethermindService.buildByUserInput("goerli", ports, "/opt/stereum/nethermind").buildConfiguration();

  expect(nethermindService.service).toBe("NethermindService");
  expect(nethermindService.id).toMatch(/.{8}-.{4}-.{4}-.{4}-.{12}/);
  expect(typeof nethermindService.configVersion).toBe("number");
  expect(nethermindService.image).toContain("nethermind/nethermind");
  expect(nethermindService.command).toContain("--config=goerli");
  expect(nethermindService.command).toContain("--datadir=/opt/app/data");
  expect(nethermindService.entrypoint).toContain("./nethermind");
  expect(nethermindService.ports).toHaveLength(1);
  expect(nethermindService.ports).toContain("0.0.0.0:4040:4040/tcp");
  expect(nethermindService.volumes).toContain("/opt/stereum/nethermind-" + nethermindService.id + "/data:/opt/app/data");
  expect(nethermindService.user).toBe("root");
  expect(nethermindService.network).toBe("goerli");
});

test("buildExecutionClientHttpEndpointUrl", () => {
  const nethermindHttpEndpoint = NethermindService.buildByUserInput(
    "goerli",
    [],
    "/opt/stereum/nethermind"
  ).buildExecutionClientHttpEndpointUrl();
  expect(nethermindHttpEndpoint).toMatch(/http:\/\/stereum-.{36}:8545/);
});

test("buildExecutionClientWsEndpointUrl", () => {
  const nethermindWsEndpoint = NethermindService.buildByUserInput(
    "goerli",
    [],
    "/opt/stereum/nethermind"
  ).buildExecutionClientWsEndpointUrl();
  expect(nethermindWsEndpoint).toMatch(/ws:\/\/stereum-.{36}:8546/);
});

test("buildExecutionClientMetricsEndpoint", () => {
  const nethermindMetricsEndpoint = NethermindService.buildByUserInput(
    "goerli",
    [],
    "/opt/stereum/nethermind"
  ).buildExecutionClientMetricsEndpoint();
  expect(nethermindMetricsEndpoint).toMatch(/stereum-.{36}:6060/);
});

test("buildByConfiguration", () => {
  const nethermind = NethermindService.buildByConfiguration({
    id: "297",
    service: "NethermindService",
    configVersion: 14,
    image: "nethermind:v3.4.1",
    ports: ["0.0.0.0:1234:5678/tcp", "8.8.8.8:1234:5678/udp"],
    volumes: ["/opt/stereum/foo:/opt/app/data"],
  });

  expect(nethermind.id).toBe("297");
  expect(nethermind.service).toBe("NethermindService");
  expect(nethermind.configVersion).toBe(14);
  expect(nethermind.image).toBe("nethermind");
  expect(nethermind.imageVersion).toBe("v3.4.1");
  expect(nethermind.ports).toHaveLength(2);
  expect(nethermind.ports[0].destinationPort).toBe("1234");
  expect(nethermind.ports[1].servicePort).toBe("5678");

  expect(nethermind.volumes).toHaveLength(1);
  expect(nethermind.volumes[0]).toBeDefined();
});

test("getDataDir", () => {
  const service = NethermindService.buildByUserInput("goerli", [], "/opt/stereum/app");
  const serviceDataDir = service.getDataDir();
  expect(serviceDataDir).toBe("/opt/stereum/app-" + service.id + "/data");
});
