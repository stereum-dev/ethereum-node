import { NodeService } from "./NodeService";
import { ServiceVolume } from "./ServiceVolume";

export class ExternalConsensusService extends NodeService {
  static buildByUserInput(network, dir, validatorClients) {
    const service = new ExternalConsensusService();
    service.setId();

    const workingDir = service.buildWorkingDir(dir);
    const volumes = [new ServiceVolume(workingDir + "/link.txt", "")];
    service.init(
      "ExternalConsensusService", // service
      service.id, // id
      1, // configVersion
      [], // image
      null, // imageVersion
      [], // command
      [], // entrypoint
      {}, // env
      [], // ports
      volumes, // volumes
      null, // user
      network, // network
      null, // executionClients
      null, // consensusClients
      validatorClients, // validator Client
      null // mevboost
    );
    return service;
  }

  static buildByConfiguration(config) {
    const service = new ExternalConsensusService();

    service.initByConfig(config);

    return service;
  }
}

// EOF
