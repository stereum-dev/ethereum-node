import { NodeService } from "./NodeService";
import { ServiceVolume } from "./ServiceVolume";

const envMap = new WeakMap();
export class ExternalExecutionService extends NodeService {
  static get env() {
    return envMap.get(this);
  }

  static set env(val) {
    envMap.set(this, val);
  }
  static buildByUserInput(network, dir) {
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
      null, // image
      "", // imageVersion
      [], // command
      [], // entrypoint
      ExternalExecutionService.env, // env
      [], // ports
      volumes, // volumes
      null, // user
      network, // network
      null // executionClients
      // consensusClient
    );
    return service;
  }

  buildExecutionClientHttpEndpointUrl(val) {
    return val;
  }

  buildExecutionClientWsEndpointUrl(val) {
    return val;
  }

  buildExecutionClientEngineRPCHttpEndpointUrl(val) {
    return val;
  }

  buildExecutionClientEngineRPCWsEndpointUrl(val) {
    return val;
  }
  static buildByConfiguration(config) {
    const service = new ExternalExecutionService();

    service.initByConfig(config);

    return service;
  }
}

// EOF
