import { NodeService } from "./NodeService.js";
import { ServicePortDefinition } from "./SerivcePortDefinition.js";
import { ServiceVolume } from "./ServiceVolume.js";

export class SSVDKGService extends NodeService {
  static buildByUserInput(network, ports, dir, consensusClients, otherServices) {
    const service = new SSVDKGService();
    service.setId();
    const workingDir = service.buildWorkingDir(dir);

    const image = "bloxstaking/ssv-dkg";

    // TODO: use shared volume with SSVNetworkService!!!!
    const volumes = [
      new ServiceVolume(workingDir + "/data", "/data"),
      new ServiceVolume(workingDir + "/secrets", "/secrets"),
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
      "v2.1.0", //imageVersion
      ["start-operator", "--configPath /data/config.yaml"], //command
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

  getAvailablePorts() {
    return [
      new ServicePortDefinition(3030, "tcp", "TCP connections"),
      new ServicePortDefinition(3030, "udp", "UDP connections"),
    ];
  }
}

// EOF
