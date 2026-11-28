import { NodeService } from "./NodeService";
import { ServiceVolume } from "./ServiceVolume";

// xOneRS (https://xone.sh) - experimental execution client, BUSL-1.1 licensed.
// Ethereum networks are selected with --chain (mainnet, sepolia or hoodi).
export class XoneService extends NodeService {
  static buildByUserInput(network, ports, dir) {
    const service = new XoneService();
    service.setId();
    const workingDir = service.buildWorkingDir(dir);
    const dataDir = "/opt/data/xone";
    const JWTDir = "/engine.jwt";
    const volumes = [new ServiceVolume(workingDir + "/data", dataDir), new ServiceVolume(workingDir + "/engine.jwt", JWTDir)];

    service.init(
      "XoneService", // service
      service.id, // id
      1, // configVersion
      "xonesh/xone", // image
      "0.2.9", // imageVersion
      [
        `--chain=${network}`,
        `--datadir=${dataDir}`,
        "--port=30303",
        "--discovery.port=30303",
        "--maxpeers=50",
        "--http",
        "--http.addr=0.0.0.0",
        "--http.port=8545",
        "--http.api=eth,web3,net",
        "--http.corsdomain=*",
        "--http.vhosts=*",
        "--ws",
        "--ws.addr=0.0.0.0",
        "--ws.port=8546",
        "--ws.api=eth,net,web3",
        "--ws.origins=*",
        "--authrpc.addr=0.0.0.0",
        "--authrpc.port=8551",
        "--authrpc.vhosts=*",
        `--authrpc.jwtsecret=${JWTDir}`,
        "--metrics",
        "--metrics.addr=0.0.0.0",
        "--metrics.port=6060",
        "--metrics.compat=geth",
        "--verbosity=3",
      ], // command
      ["/opt/xone/xone"], // entrypoint
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

  static buildByConfiguration(config) {
    const service = new XoneService();

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
    return this.volumes.find((volume) => volume.servicePath === "/opt/data/xone")?.destinationPath;
  }
}

// EOF
