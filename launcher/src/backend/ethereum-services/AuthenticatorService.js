import { NodeService } from "./NodeService";
import { ServicePortDefinition } from "./SerivcePortDefinition";
import { ServiceVolume } from "./ServiceVolume";

export class AuthenticatorService extends NodeService {
  static buildByUserInput(network) {
    const service = new AuthenticatorService();
    service.setId();

    const volumes = [new ServiceVolume("/", "/host", "ro,rslave")];

    service.init(
      "AuthenticatorService", //service
      service.id, // id
      1, // configVersion
      null, // image
      null, // imageVersion
      {}, // command
      null, // entrypoint
      null, // env
      [], // ports
      volumes, // volumes
      null, // user
      network // network
      // executionClients
      // consensusClients
    );
    return service;
  }

  static buildByConfiguration(config) {
    const service = new AuthenticatorService();

    service.initByConfig(config);

    return service;
  }

  getAvailablePorts() {
    return [new ServicePortDefinition(3000, "tcp", "add some description")];
  }
}
