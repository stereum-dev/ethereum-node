import { NodeService } from "./NodeService.js";
import { ServiceVolume } from "./ServiceVolume.js";

export class L2GethService extends NodeService {
  static buildByUserInput(network, ports, dir) {
    const service = new L2GethService();
    service.setId();
    const workingDir = service.buildWorkingDir(dir);

    const dataDir = "/l2-geth";
    const volumes = [new ServiceVolume(workingDir + "/data", dataDir)];

    service.init(
      "L2GethService", // service
      service.id, // id
      1, // configVersion
      "ethereumoptimism/l2geth", // image
      "0.5.31", // imageVersion
      ["--vmodule=eth/*=5,miner=4,rpc=5,rollup=4,consensus/clique=1", `--datadir=${dataDir}`, "--allow-insecure-unlock", "--gcmode=full"], // command
      ["geth"], // entrypoint
      {
        USING_OVM: "true",
        ETH1_SYNC_SERVICE_ENABLE: "false",
        RPC_API: "eth,rollup,net,web3,debug",
        RPC_ADDR: "0.0.0.0",
        RPC_CORS_DOMAIN: "*",
        RPC_ENABLE: "true",
        RPC_PORT: "8545",
        RPC_VHOSTS: "*",
      }, // env
      ports, // ports
      volumes, // volumes
      "root", // user
      network // network
      // executionClients
      // consensusClients
    );

    return service;
  }

  static buildByConfiguration(config) {
    const service = new L2GethService();

    service.initByConfig(config);

    return service;
  }

  buildExecutionClientRPCEndpointUrl() {
    return "http://stereum-" + this.id + ":8545";
  }
}

// EOF
