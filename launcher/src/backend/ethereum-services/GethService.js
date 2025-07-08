import { NodeService } from "./NodeService.js";
import { ServiceVolume } from "./ServiceVolume.js";

export class GethService extends NodeService {
  static buildByUserInput(network, ports, dir) {
    const service = new GethService();
    service.setId();
    const workingDir = service.buildWorkingDir(dir);

    network = network === "op-mainnet" ? "mainnet" : network === "op-sepolia" ? "sepolia" : network;

    const JWTDir = network === "devnet" ? "/execution/engine.jwt" : "/engine.jwt";
    const dataDir = network === "devnet" ? "/execution" : "/opt/data/geth";
    const volumes =
      network === "devnet"
        ? [new ServiceVolume(workingDir, dataDir), new ServiceVolume(workingDir + "/engine.jwt", JWTDir)]
        : [new ServiceVolume(workingDir + "/data", dataDir), new ServiceVolume(workingDir + "/engine.jwt", JWTDir)];

    const cmd = service.generateGethCommand(network, dataDir, JWTDir);

    service.init(
      "GethService", // service
      service.id, // id
      1, // configVersion
      "ethereum/client-go", // image
      "v1.14.10-amd64", // imageVersion
      cmd, // command
      ["geth"], // entrypoint
      null, // env
      ports, // ports
      volumes, // volumes
      "root", // user
      network // network
      // executionClients
      // consensusClients
    );

    return service;
  }

  generateGethCommand(network, dataDir, JWTDir) {
    const commonCmd = [
      "--http",
      "--http.api=eth,web3,net",
      "--http.port=8545",
      "--http.addr=0.0.0.0",
      "--http.corsdomain=*",
      "--http.vhosts=*",
      "--ws",
      "--ws.api=eth,net,web3",
      "--ws.port=8546",
      "--ws.addr=0.0.0.0",
      "--ws.origins=*",
      "--authrpc.port=8551",
      "--authrpc.vhosts=*",
      "--authrpc.addr=0.0.0.0",
      `--authrpc.jwtsecret=${JWTDir}`,
      `--datadir=${dataDir}`,
      "--metrics",
      "--metrics.expensive",
      "--metrics.port=6060",
      "--metrics.addr=0.0.0.0",
    ];

    if (network === "devnet") {
      return [...commonCmd, "--allow-insecure-unlock", "--nodiscover", "--syncmode=full"];
    } else {
      return [`--${network}`, "--state.scheme=path", ...commonCmd];
    }
  }

  static buildByConfiguration(config) {
    const service = new GethService();

    service.initByConfig(config);

    return service;
  }

  buildExecutionClientHttpEndpointUrl() {
    return "http://stereum-" + this.id + ":8545";
  }

  buildExecutionClientWsEndpointUrl() {
    return "ws://stereum-" + this.id + ":8546";
  }

  buildExecutionClientEngineRPCHttpEndpointUrl() {
    return "http://stereum-" + this.id + ":8551";
  }

  buildExecutionClientEngineRPCWsEndpointUrl() {
    return "ws://stereum-" + this.id + ":8551";
  }

  buildExecutionClientMetricsEndpoint() {
    return "stereum-" + this.id + ":6060";
  }

  getDataDir() {
    return this.volumes.find((volume) => volume.servicePath === "/opt/data/geth")?.destinationPath;
  }
}

// EOF
