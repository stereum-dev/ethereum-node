import { NodeService } from "./NodeService";
import { ServiceVolume } from "./ServiceVolume";

export class ExternalExecutionService extends NodeService {
  static buildByUserInput(network, dir, consensusClients) {
    const service = new ExternalExecutionService();
    service.setId();

    const workingDir = service.buildWorkingDir(dir);
    const volumes = [
      new ServiceVolume(workingDir + "/link.txt", ""),
      new ServiceVolume(workingDir + "/engine.jwt", ""),
    ];

    service.init(
      "ExternalExecutionService", // service
      service.id, // id
      1, // configVersion
      "", // image
      "", // imageVersion
      [], // command
      [], // entrypoint
      {}, // env
      [], // ports
      volumes, // volumes
      null, // user
      network, // network
      // executionClients
      consensusClients
    );
    return service;
  }

  static buildByConfiguration(config) {
    const service = new ExternalExecutionService();

    service.initByConfig(config);

    return service;
  }
}

// EOF
