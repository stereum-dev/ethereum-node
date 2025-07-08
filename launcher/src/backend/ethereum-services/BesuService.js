import { NodeService } from "./NodeService";
import { ServiceVolume } from "./ServiceVolume";

export class BesuService extends NodeService {
  static buildByUserInput(network, ports, dir) {
    const service = new BesuService();
    service.setId();
    const workingDir = service.buildWorkingDir(dir);
    const dataDir = "/opt/app/data";
    const JWTDir = "/engine.jwt";
    const volumes = [new ServiceVolume(workingDir + "/data", "/opt/app/data"), new ServiceVolume(workingDir + "/engine.jwt", JWTDir)];
    network = network === "op-mainnet" ? "mainnet" : network === "op-sepolia" ? "sepolia" : network;

    service.init(
      "BesuService", // service
      service.id, // id
      1, // configVersion
      "hyperledger/besu", // image
      "22.7.6", // imageVersion
      [
        `--network=${network}`,
        `--data-path=${dataDir}`,
        "--data-storage-format=BONSAI",
        "--sync-mode=SNAP",
        "--p2p-port=30303",
        "--p2p-host=0.0.0.0",
        "--rpc-http-enabled=true",
        "--rpc-http-host=0.0.0.0",
        "--rpc-http-cors-origins=*",
        "--rpc-http-port=8545",
        "--rpc-ws-enabled=true",
        "--rpc-ws-host=0.0.0.0",
        "--rpc-ws-port=8546",
        "--host-allowlist=*",
        "--metrics-enabled",
        "--metrics-host=0.0.0.0",
        "--metrics-port=9545",
        "--logging=INFO",
        "--engine-host-allowlist=*",
        "--engine-rpc-port=8551",
        "--engine-jwt-secret=/engine.jwt",
      ], // command
      ["besu"], // entrypoint
      { JAVA_OPTS: "-Xmx6g" }, // env
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
    const service = new BesuService();

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
