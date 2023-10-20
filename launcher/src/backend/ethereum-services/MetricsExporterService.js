import { NodeService } from "./NodeService";
import { ServiceVolume } from "./ServiceVolume";

export class MetricsExporterService extends NodeService {
  static buildByUserInput(network) {
    const image = "gobitfly/eth2-client-metrics-exporter";
    const service = new MetricsExporterService();
    const volumes = [
      new ServiceVolume("/sys", "/host/sys", "ro"),
      new ServiceVolume("/proc", "/host/proc", "ro"),
      new ServiceVolume("/", "/host/rootfs", "ro"),
    ];

    service.init(
      "MetricsExporterService", //service
      service.id, // id,
      1, // configVersion
      image, // image,
      "latest", // imageVersion,
      [
        `--server.address=https://beaconcha.in/api/v1/client/metrics?apikey=<API_KEY>&machine=<MACHINE_NAME>`,
        `--system.partition=/host/rootfs`,
        `--beaconnode.type=prysm`,
        `--beaconnode.address=http://stereum-<SERVICE_ID>:8080/metrics`,
        `--validator.type=prysm`,
        `--validator.address=http://stereum-<SERVICE_ID>:8081/metrics`,
      ], // command,
      ["/bin/eth2-client-metrics-exporter"], // entrypoint,
      {
        HOST_PROC: "/host/proc",
        HOST_SYS: "/host/sys",
      }, // env,
      [], // ports,
      volumes, // volumes,
      null, // user,
      network // network,
    );
    return service;
  }

  static buildByConfiguration(config) { 
    const service = new MetricsExporterService();

    service.initByConfig(config);

    return service;
  }
}
