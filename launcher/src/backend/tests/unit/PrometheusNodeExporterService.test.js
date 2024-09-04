import { PrometheusNodeExporterService } from "../../ethereum-services/PrometheusNodeExporterService.js";

test("buildConfiguration", () => {
  const pneService = PrometheusNodeExporterService.buildByUserInput().buildConfiguration();

  expect(pneService.image).toMatch(/prom\/node-exporter/);
});

test("buildPrometheusNodeExporterClientHttpEndpointUrl", () => {
  const pneService = PrometheusNodeExporterService.buildByUserInput().buildPrometheusNodeExporterClientHttpEndpointUrl();

  expect(pneService).toMatch(/http:\/\/stereum-.{36}:9100/);
});

test("buildByConfiguration", () => {
  const pne = PrometheusNodeExporterService.buildByConfiguration({
    id: "123",
    service: "PrometheusNodeExporterService",
    configVersion: 654,
    image: "prom/node-exporter:v0.0.1",
    ports: ["0.0.0.0:1234:5678/tcp", "8.8.8.8:1234:5678/udp"],
    volumes: ["/opt/stereum/foo:/opt/app/data"],
  });

  expect(pne.id).toBe("123");
  expect(pne.service).toBe("PrometheusNodeExporterService");
  expect(pne.configVersion).toBe(654);
  expect(pne.image).toBe("prom/node-exporter");
  expect(pne.imageVersion).toBe("v0.0.1");
  expect(pne.ports).toHaveLength(2);
  expect(pne.ports[0].destinationPort).toBe("1234");
  expect(pne.ports[1].servicePort).toBe("5678");

  expect(pne.volumes).toHaveLength(1);
  expect(pne.volumes[0]).toBeDefined();
});
