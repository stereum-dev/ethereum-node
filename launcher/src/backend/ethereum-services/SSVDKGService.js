import { NodeService } from "./NodeService.js";
// import { ServicePortDefinition } from "./SerivcePortDefinition.js";
import { ServiceVolume } from "./ServiceVolume.js";

export class SSVDKGService extends NodeService {
  static buildByUserInput(network, ports, dir, consensusClients, otherServices) {
    const service = new SSVDKGService();
    service.setId();
    const workingDir = service.buildWorkingDir(dir);

    const image = "sigp/lighthouse";

    const dataDir = "/opt/app/validator";
    const graffitiDir = "/opt/app/graffitis";

    const volumes = [
      new ServiceVolume(workingDir + "/validator", dataDir),
      new ServiceVolume(workingDir + "/graffitis", graffitiDir),
    ];

    // const eth2Nodes = consensusClients
    //   .map((client) => {
    //     return client.buildConsensusClientHttpEndpointUrl();
    //   })
    //   .join();

    // build service
    service.init(
      "SSVDKGService", //service
      service.id, //id
      1, //configVersion
      image, //image
      "v3.1.2", //imageVersion
      ["start-operator", "--configPath=/data/config.yaml"], //command
      null, // entrypoint
      null, // env
      ports, //ports
      volumes, //volumes
      null, //user
      network, //network
      null, //executionClients
      otherServices
    );

    // if (consensusClients.some((c) => c.service === "CharonService")) {
    //   service.command.push("--produce-block-v3=false");
    //   service.command = service.command.filter((c) => c !== "--enable-doppelganger-protection");
    // }

    return service;
  }

  static buildByConfiguration(config) {
    const service = new SSVDKGService();

    service.initByConfig(config);

    return service;
  }

  // buildValidatorClientMetricsEndpoint() {
  //   return "stereum-" + this.id + ":5064";
  // }

  // getAvailablePorts() {
  //   return [new ServicePortDefinition(5062, "tcp", "Validator Client API")];
  // }
}

// EOF
