import { NodeService } from "./NodeService";
import { ServiceVolume } from "./ServiceVolume";

export class LCOMService extends NodeService {
  static buildByUserInput(network, ports, dir, consensusClients, executionClients, otherServices) {
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
      ["python", "main.py"], // entrypoint
      {
        RPC_API: executionClients[0] ? executionClients[0].buildExecutionClientHttpEndpointUrl() : "http://RPC-api",
        BEACON_API: consensusClients[0] ? consensusClients[0].buildConsensusClientHttpEndpointUrl() : "http://beacon-api",
        IPFS_API: ipfs ? ipfs.buildIPFSHttpEndpointUrl() : "http://IPFS-api",
        NO_ID: "123456",
        LOG_LEVEL: "INFO",

        // Mainnet smart-contract addresses:
        MAINNET_VALIDATORSEXITBUSORACLE_ADDRESS: "0x0De4Ea0184c2ad0BacA7183356Aea5B8d5Bf5c6e",
        MAINNET_CSMODULE_ADDRESS: "0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F",
        MAINNET_CSACCOUNTING_ADDRESS: "0x4d72BFF1BeaC69925F8Bd12526a39BAAb069e5Da",
        MAINNET_CSFEEDISTRIBUTOR_ADDRESS: "0xD99CC66fEC647E68294C6477B40fC7E0F6F618D0",

        // Holesky Testnet smart-contract addresses:
        HOLESKY_VALIDATORSEXITBUSORACLE_ADDRESS: "0xffDDF7025410412deaa05E3E1cE68FE53208afcb",
        HOLESKY_CSMODULE_ADDRESS: "0x4562c3e63c2e586cD1651B958C22F88135aCAd4f",
        HOLESKY_CSACCOUNTING_ADDRESS: "0xc093e53e8F4b55A223c18A2Da6fA00e60DD5EFE1",
        HOLESKY_CSFEEDISTRIBUTOR_ADDRESS: "0xD7ba648C8F72669C6aE649648B516ec03D07c8ED",

        // Hoodini Testnet smart-contract addresses:
        // TBA
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
