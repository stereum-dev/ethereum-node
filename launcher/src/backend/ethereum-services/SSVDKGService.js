import { NodeService } from "./NodeService.js";
import { ServicePortDefinition } from "./SerivcePortDefinition.js";
import { ServiceVolume } from "./ServiceVolume.js";

export class SSVDKGService extends NodeService {
  getServiceConfiguration(operatorID = 0, executionClients = []) {
    if (!operatorID) operatorID = 0;
    let ethEndpointURL = executionClients && executionClients.length > 0 ? executionClients[0].buildExecutionClientHttpEndpointUrl() : null;
    if (!ethEndpointURL) ethEndpointURL = "http://ethnode:8545";
    return `privKey: ./secrets/encrypted_private_key.json
privKeyPassword: ./secrets/password
operatorID: ${operatorID}
port: 3030
logLevel: info
logFormat: json
logLevelFormat: capitalColor
logFilePath: ./data/debug.log
outputPath: ./data/output
ethEndpointURL: ${ethEndpointURL} #HTTP Address of Execution Node`;
  }

  static buildByUserInput(network, ports, dir, executionClients = [], otherServices = []) {
    const service = new SSVDKGService();
    service.setId();
    const workingDir = service.buildWorkingDir(dir);

    const image = "ssvlabs/ssv-dkg";

    // Note that local secrets volume will be replaced with
    // shared volume from SSVNetworkService later on...
    const volumes = [
      new ServiceVolume(workingDir + "/data", "/data"),
      new ServiceVolume(workingDir + "/data", "/ssv-dkg/data"),
      new ServiceVolume(workingDir + "/secrets", "/secrets"),
      new ServiceVolume(workingDir + "/secrets", "/ssv-dkg/secrets"),
    ];

    // build service
    service.init(
      "SSVDKGService", //service
      service.id, //id
      1, //configVersion
      image, //image
      "v2.1.0", //imageVersion
      ["start-operator", "--configPath=./data/config.yaml"], //command
      ["/entry-point.sh"], // entrypoint
      null, // env
      ports, //ports
      volumes, //volumes
      "root", //user
      network, //network
      executionClients, //executionClients
      null, //consensusClients
      null, //mevboost
      otherServices
    );

    return service;
  }

  static buildByConfiguration(config) {
    const service = new SSVDKGService();

    service.initByConfig(config);

    return service;
  }

  getAvailablePorts() {
    return [new ServicePortDefinition(3030, "tcp", "TCP connections"), new ServicePortDefinition(3030, "udp", "UDP connections")];
  }
}

// EOF
