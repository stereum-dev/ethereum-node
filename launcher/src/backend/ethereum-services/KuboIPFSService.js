import { NodeService } from "./NodeService";
import { ServiceVolume } from "./ServiceVolume";

export class KuboIPFSService extends NodeService {
  static buildByUserInput(network, ports, dir) {
    const service = new KuboIPFSService();
    service.setId();
    const workingDir = service.buildWorkingDir(dir);

    const image = "ipfs/kubo";

    const dataDir = "/data/ipfs";
    const exportDir = "/export";

    const volumes = [
      new ServiceVolume(workingDir + dataDir, dataDir),
      new ServiceVolume(workingDir + exportDir, exportDir),
    ];

    service.init(
      "KuboIPFSService", //service
      service.id, // id
      1, // configVersion
      image, // image
      "latest", // imageVersion
      ["daemon", "--migrate=true", "--agent-version-suffix=docker"], // command
      ["/sbin/tini", "--", "/usr/local/bin/start_ipfs"], // entrypoint
      {}, // env
      ports, // ports
      volumes, // volumes
      null, // user
      network // network
    );
    return service;
  }

  static buildByConfiguration(config) {
    const service = new KuboIPFSService();

    service.initByConfig(config);

    return service;
  }

  buildIPFSHttpEndpointUrl() {
    return "http://stereum-" + this.id + ":8080/ipfs/";
  }
}
