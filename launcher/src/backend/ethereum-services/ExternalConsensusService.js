import { NodeService } from "./NodeService";
import { ServiceVolume } from "./ServiceVolume";

export class ExternalConsensusService extends NodeService {
  static buildByUserInput(network, dir, source) {
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
      { link: source }, // env
      [], // ports
      volumes, // volumes
      null, // user
      network, // network
      null, // executionClients
      null, // consensusClients
      null // mevboost
    );
    return service;
  }

  buildConsensusClientHttpEndpointUrl(val) {
    return val;
  }

  buildConsensusClientEndpoint(val) {
    return val;
  }

  buildConsensusClientGateway(val) {
    return val;
  }

  static buildByConfiguration(config) {
    const service = new ExternalConsensusService();

    service.initByConfig(config);

    return service;
  }
}

// EOF
