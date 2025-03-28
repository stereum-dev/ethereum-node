import { NodeService } from "./NodeService";
import { ServiceVolume } from "./ServiceVolume";

export class SSVNOMService extends NodeService {
  static buildByUserInput(network, ports, dir, consensusClients = [], executionClients = [], otherServices = []) {
    const service = new SSVNOMService();
    service.setId();
    const workingDir = service.buildWorkingDir(dir);

    const image = "stereum/ssvnoms";

    const logsDir = "/app/logs";

    const volumes = [new ServiceVolume(workingDir + "/logs", logsDir)];

    const ssv_client = otherServices.find((s) => s.service == "SSVNetworkService");

    service.init(
      "SSVNOMService", //service
      service.id, // id
      1, // configVersion
      image, // image
      "latest", // imageVersion
      [], // command
      ["python", "main.py"], // entrypoint
      {
        RPC_API: executionClients[0] ? executionClients[0].buildExecutionClientHttpEndpointUrl() : "http://RPC-api",
        BEACON_API: consensusClients[0] ? consensusClients[0].buildConsensusClientHttpEndpointUrl() : "http://beacon-api",
        SSV_API: ssv_client ? ssv_client.buildSSVNodeApiEndpoint() : "http://SSV-Node-api",
        NO_ID: "12345678",
        LOG_LEVEL: "INFO",

        // Holesky Testnet smart-contract addresses:
        HOLESKY_SSVNETWORKVIEWS_ADDRESS: "0x352A18AEe90cdcd825d1E37d9939dCA86C00e281",
        HOLESKY_SSVNETWORK_ADDRESS: "0x38A4794cCEd47d3baf7370CcC43B560D3a1beEFA",
        //Mainnet smart-contract addresses:
        MAINNET_SSVNETWORKVIEWS_ADDRESS: "0xafE830B6Ee262ba11cce5F32fDCd760FFE6a66e4",
        MAINNET_SSVNETWORK_ADDRESS: "0xDD9BC35aE942eF0cFa76930954a156B3fF30a4E1",
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
    const service = new SSVNOMService();

    service.initByConfig(config);

    return service;
  }
}
