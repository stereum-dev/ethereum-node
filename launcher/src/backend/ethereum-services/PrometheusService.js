import { NodeService } from "./NodeService";
import { ServicePortDefinition } from "./SerivcePortDefinition";
import { ServiceVolume } from "./ServiceVolume";

export class PrometheusService extends NodeService {
  static buildByUserInput(network, ports, dir, prometheusJobs) {
    const service = new PrometheusService();
    service.setId();
    const workingDir = service.buildWorkingDir(dir);

    const image = "prom/prometheus";

    const dataDir = "/prometheus";
    const configDir = "/etc/prometheus";

    const volumes = [new ServiceVolume(workingDir + "/data/prometheus", dataDir), new ServiceVolume(workingDir + "/config", configDir)];

    service.init(
      "PrometheusService",
      service.id, // id
      1, // configVersion
      image, // image
      "v2.38.0", // imageVersion
      'sh -c "/bin/prometheus --config.file=/etc/prometheus/prometheus.yml --web.enable-lifecycle --storage.tsdb.retention.time=15d"', // command
      null, // entrypoint
      null, // env
      ports, // ports
      volumes, // volumes
      null, // user
      network, // network
      null, // executionClients
      prometheusJobs // consensusClients but every single client to monitor is in there should be implemented correctly someday
    );
    return service;
  }

  static buildByConfiguration(config) {
    const service = new PrometheusService();

    service.initByConfig(config);

    return service;
  }

  getAvailablePorts() {
    return [new ServicePortDefinition(9090, "tcp", "add some description")];
  }
}
