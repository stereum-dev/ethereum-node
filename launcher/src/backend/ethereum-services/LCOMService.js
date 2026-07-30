import { NodeService } from "./NodeService";
import { ServiceVolume } from "./ServiceVolume";

export class LCOMService extends NodeService {
  static buildByUserInput(network, ports, dir, consensusClients = [], executionClients = [], otherServices = []) {
    const service = new LCOMService();
    service.setId();
    const workingDir = service.buildWorkingDir(dir);

    const image = "stereum/lcoms";

    const logsDir = "/app/logs";

    const volumes = [new ServiceVolume(workingDir + "/logs", logsDir)];

    const ipfs = otherServices.find((s) => s.service == "KuboIPFSService");

    service.init(
      "LCOMService", //service
      service.id, // id
      1, // configVersion
      image, // image
      "latest", // imageVersion
      [], // command
      ["python", "-m", "app.main"], // entrypoint
      {
        RPC_API: executionClients[0] ? executionClients[0].buildExecutionClientHttpEndpointUrl() : "http://RPC-api",
        BEACON_API: consensusClients[0] ? consensusClients[0].buildConsensusClientHttpEndpointUrl() : "http://beacon-api",
        IPFS_API: ipfs ? ipfs.buildIPFSHttpEndpointUrl() : "http://IPFS-api",
        NO_ID: "123456",
        LOG_LEVEL: "INFO",
      }, // env
      ports, // ports
      volumes, // volumes
      null, // user
      network, // network
      executionClients[0] ? [executionClients[0]] : [], // executionClients
      consensusClients[0] ? [consensusClients[0]] : [], // consensusClients
      [], // MevBoost
      otherServices // otherServices
    );
    return service;
  }

  static buildByConfiguration(config) {
    const service = new LCOMService();

    service.initByConfig(config);

    return service;
  }
}
