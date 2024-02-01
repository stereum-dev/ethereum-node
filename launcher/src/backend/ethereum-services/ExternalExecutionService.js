import { NodeService } from "./NodeService";
import { ServiceVolume } from "./ServiceVolume";

export class ExternalExecutionService extends NodeService {
  static buildByUserInput(network, dir, source, jwtToken) {
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
      { link: source, jwtToken: jwtToken }, // env
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
