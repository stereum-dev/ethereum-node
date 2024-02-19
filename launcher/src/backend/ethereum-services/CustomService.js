import { NodeService } from "./NodeService";
import { ServiceVolume } from "./ServiceVolume";

export class CustomService extends NodeService {
  static buildByUserInput(network, ports, dir) {
    const service = new CustomService();
    service.setId();
    const workingDir = service.buildWorkingDir(dir);

    const dataDir = "/custom";
    const volumes = [
      new ServiceVolume(workingDir, dataDir),
    ];

    service.init(
      "CustomService", // service
      service.id, // id
      1, // configVersion
      "curlimages/curl", // image
      "latest", // imageVersion
      ["test"], // command
      ["curl"], // entrypoint
      null, // env
      ports ? ports : [], // ports
      volumes, // volumes
      null, // user
      network // network
      // executionClients
      // consensusClients
    );
    return service;
  }

  static buildByConfiguration(config) {
    const service = new CustomService();

    service.initByConfig(config);

    return service;
  }
}

// EOF
