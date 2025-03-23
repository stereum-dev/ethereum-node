import { PrometheusService } from "../../ethereum-services/PrometheusService";
import { ServicePort, servicePortProtocol } from "../../ethereum-services/ServicePort.js";

test("buildConfiguration", () => {
  const ports = [new ServicePort("127.0.0.1", 9090, 9090, servicePortProtocol.tcp)];

  jest.mock("../../ethereum-services/NimbusBeaconService");
  const NimbusBeaconService = require("../../ethereum-services/NimbusBeaconService");
  NimbusBeaconService.NimbusBeaconService.mockImplementation(() => {
    return {
      buildMinimalConfiguration: jest.fn(() => {
        return {
          id: "nimbus-id",
          service: "NimbusBeaconService",
        };
      }),
    };
  });

  jest.mock("../../ethereum-services/PrometheusNodeExporterService");
  const PrometheusNodeExporterService = require("../../ethereum-services/PrometheusNodeExporterService");
  PrometheusNodeExporterService.PrometheusNodeExporterService.mockImplementation(() => {
    return {
      buildMinimalConfiguration: jest.fn(() => {
        return {
          id: "pne-id",
          service: "PrometheusNodeExporterService",
        };
      }),
    };
  });

  const prometheus = PrometheusService.buildByUserInput("prater", ports, "/opt/stereum/prometheus", [
    new NimbusBeaconService.NimbusBeaconService(),
    new PrometheusNodeExporterService.PrometheusNodeExporterService(),
  ]).buildConfiguration();

  expect(prometheus.volumes).toHaveLength(2);
  expect(prometheus.volumes).toContain("/opt/stereum/prometheus-" + prometheus.id + "/data/prometheus:/prometheus");
  expect(prometheus.volumes).toContain("/opt/stereum/prometheus-" + prometheus.id + "/config:/etc/prometheus");
  expect(prometheus.ports).toHaveLength(1);
  expect(prometheus.id).toHaveLength(36);
  expect(prometheus.user).toMatch(/2000/);
  expect(prometheus.image).toMatch(/prom\/prometheus/);
  expect(prometheus.configVersion).toBe(1);
});

test("getAvailablePorts", () => {
  const prometheus = PrometheusService.buildByUserInput("prater", [], "/opt/stereum/prometheus", [], []).getAvailablePorts();

  expect(prometheus).toHaveLength(1);
});

test("buildByConfiguration", () => {
  const prometheus = PrometheusService.buildByConfiguration({
    id: "123",
    service: "PrometheusService",
    configVersion: 876,
    image: "prometheus:v0.0.1",
    ports: ["0.0.0.0:1234:5678/tcp", "8.8.8.8:1234:5678/udp"],
    volumes: ["/opt/stereum/foo:/opt/app/data"],
  });

  expect(prometheus.id).toBe("123");
  expect(prometheus.service).toBe("PrometheusService");
  expect(prometheus.configVersion).toBe(876);
  expect(prometheus.image).toBe("prometheus");
  expect(prometheus.imageVersion).toBe("v0.0.1");
  expect(prometheus.ports).toHaveLength(2);
  expect(prometheus.ports[0].destinationPort).toBe("1234");
  expect(prometheus.ports[1].servicePort).toBe("5678");

  expect(prometheus.volumes).toHaveLength(1);
  expect(prometheus.volumes[0]).toBeDefined();
});

test("getDataDir", () => {
  const service = PrometheusService.buildByUserInput("goerli", [], "/opt/stereum/app");
  const serviceDataDir = service.getDataDir();
  expect(serviceDataDir).toBeFalsy();
});
