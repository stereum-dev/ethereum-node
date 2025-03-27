import { BesuService } from "../../ethereum-services/BesuService.js";
import { ServicePort, servicePortProtocol } from "../../ethereum-services/ServicePort.js";

test("buildByUserInput", () => {
  const ports = [new ServicePort(null, 4040, 4040, servicePortProtocol.tcp)];

  const besuService = BesuService.buildByUserInput("goerli", ports, "/opt/stereum/besu").buildConfiguration();

  expect(besuService.service).toBe("BesuService");
  expect(besuService.id).toMatch(/.{8}-.{4}-.{4}-.{4}-.{12}/);
  expect(typeof besuService.configVersion).toBe("number");
  expect(besuService.image).toContain("hyperledger/besu");
  expect(besuService.command).toContain("--network=goerli");
  expect(besuService.command).toContain("--data-path=/opt/app/data");
  expect(besuService.entrypoint).toContain("besu");
  expect(besuService.env).toHaveProperty("JAVA_OPTS", "-Xmx6g");
  expect(besuService.ports).toHaveLength(1);
  expect(besuService.ports).toContain("0.0.0.0:4040:4040/tcp");
  expect(besuService.volumes).toContain("/opt/stereum/besu-" + besuService.id + "/data:/opt/app/data");
  expect(besuService.user).toBe("2000");
  expect(besuService.network).toBe("goerli");
});

test("buildExecutionClientHttpEndpointUrl", () => {
  const besuHttpEndpoint = BesuService.buildByUserInput("goerli", [], "/opt/stereum/besu").buildExecutionClientHttpEndpointUrl();
  expect(besuHttpEndpoint).toMatch(/http:\/\/stereum-.{36}:8545/);
});

test("buildExecutionClientWsEndpointUrl", () => {
  const besuWsEndpoint = BesuService.buildByUserInput("goerli", [], "/opt/stereum/besu").buildExecutionClientWsEndpointUrl();
  expect(besuWsEndpoint).toMatch(/ws:\/\/stereum-.{36}:8546/);
});

test("buildExecutionClientMetricsEndpoint", () => {
  const besuMetricsEndpoint = BesuService.buildByUserInput("goerli", [], "/opt/stereum/besu").buildExecutionClientMetricsEndpoint();
  expect(besuMetricsEndpoint).toMatch(/stereum-.{36}:9545/);
});

test("buildPrometheusJob", () => {
  const besuPrometheusJob = BesuService.buildByUserInput("goerli", [], "/opt/stereum/besu").buildPrometheusJob();
  expect(besuPrometheusJob).toMatch(/\n {2}- job_name: stereum-.{36}\n {4}static_configs:\n {6}- targets: \[stereum-.{36}:9545]/);
});

test("buildByConfiguration", () => {
  const besu = BesuService.buildByConfiguration({
    id: "297",
    service: "BesuService",
    configVersion: 14,
    image: "besu:v3.4.1",
    ports: ["0.0.0.0:1234:5678/tcp", "8.8.8.8:1234:5678/udp"],
    volumes: ["/opt/stereum/foo:/opt/app/data"],
  });

  expect(besu.id).toBe("297");
  expect(besu.service).toBe("BesuService");
  expect(besu.configVersion).toBe(14);
  expect(besu.image).toBe("besu");
  expect(besu.imageVersion).toBe("v3.4.1");
  expect(besu.ports).toHaveLength(2);
  expect(besu.ports[0].destinationPort).toBe("1234");
  expect(besu.ports[1].servicePort).toBe("5678");

  expect(besu.volumes).toHaveLength(1);
  expect(besu.volumes[0]).toBeDefined();
});

test("getDataDir", () => {
  const service = BesuService.buildByUserInput("goerli", [], "/opt/stereum/app");
  const serviceDataDir = service.getDataDir();
  expect(serviceDataDir).toBe("/opt/stereum/app-" + service.id + "/data");
});
