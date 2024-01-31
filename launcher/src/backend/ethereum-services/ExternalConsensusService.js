import { NodeService } from "./NodeService";
import { ServiceVolume } from "./ServiceVolume";
const envMap = new WeakMap();

export class ExternalConsensusService extends NodeService {
  static get env() {
    return envMap.get(this);
  }

  static set env(val) {
    envMap.set(this, val);
  }
  static buildByUserInput(network, dir) {
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
      ExternalConsensusService.env, // env
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
