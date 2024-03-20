import { NodeService } from "./NodeService";
import { ServiceVolume } from "./ServiceVolume";

export class ExternalConsensusService extends NodeService {
  static buildByUserInput(network, dir, source, gateway) {
    const service = new ExternalConsensusService();
    service.setId();

    const workingDir = service.buildWorkingDir(dir);
    const volumes = [
      new ServiceVolume(workingDir + "/link.txt", ""),
      ...(gateway ? [new ServiceVolume(workingDir + "/gateway.txt", "")] : []),
    ];
    service.init(
      "ExternalConsensusService", // service
      service.id, // id
      1, // configVersion
      [], // image
      null, // imageVersion
      [], // command
      [], // entrypoint
      gateway ? { link: source, gateway: gateway } : { link: source }, // env
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

  buildConsensusClientHttpEndpointUrl() {
    return this.env.link === "" || typeof this.env.link === "undefined" ? "" : this.env.link;
  }

  buildConsensusClientEndpoint() {
    return this.env.link === "" || typeof this.env.link === "undefined" ? "" : this.env.link;
  }

  buildConsensusClientGateway() {
    return !this.env.gateway || typeof this.env.gateway === "undefined" ? "" : this.env.gateway;
  }

  static buildByConfiguration(config) {
    const service = new ExternalConsensusService();

    service.initByConfig(config);

    return service;
  }
}

// EOF
