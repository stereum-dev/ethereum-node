import { NodeService } from "./NodeService";
import { ServiceVolume } from "./ServiceVolume";

export class PrometheusNodeExporterService extends NodeService {
  static buildByUserInput(network) {
    const image = "prom/node-exporter";
    const service = new PrometheusNodeExporterService();
    const volumes = [new ServiceVolume("/", "/host", "ro,rslave")];
    service.init(
      "PrometheusNodeExporterService",
      null, // id
      1, // configVersion
      image, // image
      "v1.3.1", // imageVersion
      ["--path.rootfs=/host"], // command
      ["/bin/node_exporter"], // entrypoint
      null, // env
      null, // ports
      volumes, // volumes
      null, // user
      network // network
      // executionClients
      // consensusClients
    );
    return service;
  }

  static buildByConfiguration(config) {
    const service = new PrometheusNodeExporterService();

    service.initByConfig(config);

    return service;
  }

  buildPrometheusNodeExporterClientHttpEndpointUrl() {
    return "http://stereum-" + this.id + ":9100";
  }

  buildPrometheusNodeExporterClientMetricsEndpoint() {
    return "stereum-" + this.id + ":9100";
  }

  buildPrometheusJob() {
    return `\n  - job_name: stereum-${
      this.id
    }\n    static_configs:\n      - targets: [${this.buildPrometheusNodeExporterClientMetricsEndpoint()}]`;
  }
}
