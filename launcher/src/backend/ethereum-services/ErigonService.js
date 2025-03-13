import { NodeService } from "./NodeService.js";
import { ServiceVolume } from "./ServiceVolume.js";

export class ErigonService extends NodeService {
  static buildByUserInput(network, ports, dir) {
    const service = new ErigonService();
    service.setId();
    const workingDir = service.buildWorkingDir(dir);

    const JWTDir = "/engine.jwt";
    const dataDir = "/opt/data/erigon";
    const volumes = [new ServiceVolume(workingDir + "/data", dataDir), new ServiceVolume(workingDir + "/engine.jwt", JWTDir)];

    service.init(
      "ErigonService", // service
      service.id, // id
      1, // configVersion
      "erigontech/erigon", // image
      "v2.60.8", // imageVersion
      [
        `erigon`,
        `--chain=${network}`,
        `--datadir=${dataDir}`,
        `--authrpc.addr=0.0.0.0`,
        `--authrpc.vhosts=*`,
        `--authrpc.port=8551`,
        `--authrpc.jwtsecret=/engine.jwt`,
        "--rpc.returndata.limit=1000000",
        `--ws`,
        `--http`,
        `--http.vhosts=*`,
        `--http.corsdomain=*`,
        `--http.addr=0.0.0.0`,
        `--http.port=8545`,
        `--http.api=engine,net,eth,web3`,
        `--metrics`,
        `--metrics.addr=0.0.0.0`,
        `--metrics.port=6060`,
        "--db.pagesize=16K",
        "--db.size.limit=8TB",
      ], // command
      [], // entrypoint
      null, // env
      ports, // ports
      volumes, // volumes
      "root", // user
      network // network
      // executionClients
      // consensusClients
    );

    switch (network) {
      case "mainnet":
        service.command.push("--prune=htc", "--prune.r.before=11052984");
        break;
      case "goerli":
        service.command.push("--prune=htc", "--prune.r.before=4367322");
        break;
      case "sepolia":
        service.command.push("--prune=htc", "--prune.r.before=1273020");
        break;
      case "holesky":
        service.command.push("--prune=htc");
        break;
      case "gnosis":
        service.command.push("--prune=htc", "--prune.r.before=19469077");
        break;
      default:
        service.command.push("--prune=htc");
        break;
    }

    return service;
  }

  static buildByConfiguration(config) {
    const service = new ErigonService();

    service.initByConfig(config);

    return service;
  }

  switchImageTag() {
    this.imageVersion = this.imageVersion.startsWith("v") ? this.imageVersion : "v" + this.imageVersion;
  }

  buildExecutionClientHttpEndpointUrl() {
    return "http://stereum-" + this.id + ":8545";
  }

  buildExecutionClientWsEndpointUrl() {
    return "ws://stereum-" + this.id + ":8545";
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

  buildPrometheusJob() {
    return `\n  - job_name: stereum-${
      this.id
    }\n    metrics_path: /debug/metrics/prometheus\n    static_configs:\n      - targets: [${this.buildExecutionClientMetricsEndpoint()}]`;
  }

  getDataDir() {
    return this.volumes.find((volume) => volume.servicePath === "/opt/data/erigon")?.destinationPath;
  }
}

// EOF
