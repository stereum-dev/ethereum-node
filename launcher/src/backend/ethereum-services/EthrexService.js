import { NodeService } from "./NodeService";
import { ServiceVolume } from "./ServiceVolume";

export class EthrexService extends NodeService {
  static buildByUserInput(network, ports, dir) {
    const service = new EthrexService();
    service.setId();
    const workingDir = service.buildWorkingDir(dir);
    const dataDir = "/opt/app/data";
    const JWTDir = "/engine.jwt";
    const volumes = [new ServiceVolume(workingDir + "/data", "/opt/app/data"), new ServiceVolume(workingDir + "/engine.jwt", JWTDir)];
    network = network === "op-mainnet" ? "mainnet" : network === "op-sepolia" ? "sepolia" : network;

    service.init(
      "EthrexService", // service
      service.id, // id
      1, // configVersion
      "ghcr.io/lambdaclass/ethrex", // image
      "9.0.0", // imageVersion
      [
        `--network=${network}`,
        `--datadir=${dataDir}`,
        "--syncmode=snap",
        "--p2p.addr=0.0.0.0",
        "--p2p.port=30303", //tcp
        "--discovery.port=30303", //udp
        "--http.addr=0.0.0.0",
        "--http.port=8545",
        "--ws.enabled",
        "--ws.addr=0.0.0.0",
        "--ws.port=8546",
        "--authrpc.addr=0.0.0.0",
        "--authrpc.port=8551",
        `--authrpc.jwtsecret=${JWTDir}`,
        "--log.level=info",
        "--log.color=never",
        "--metrics",
        "--metrics.addr=0.0.0.0",
        "--metrics.port=9090",
      ], // command
      ["ethrex"], // entrypoint
      null, // env
      ports, // ports
      volumes, // volumes
      null, // user
      network // network
      // executionClients
      // consensusClients
    );
    return service;
  }

  static buildByConfiguration(config) {
    const service = new EthrexService();

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
    return "stereum-" + this.id + ":9545";
  }

  getDataDir() {
    return this.volumes.find((volume) => volume.servicePath === "/opt/app/data")?.destinationPath;
  }
}

// EOF
