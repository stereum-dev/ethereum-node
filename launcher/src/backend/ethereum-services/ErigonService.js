import { NodeService } from "./NodeService.js";
import { ServiceVolume } from "./ServiceVolume.js";

export class ErigonService extends NodeService {
  static buildByUserInput(network, ports, dir) {
    const service = new ErigonService();
    service.setId();
    const workingDir = service.buildWorkingDir(dir);

    const JWTDir = "/engine.jwt";
    const dataDir = "/opt/data/erigon";
    const volumes = [
      new ServiceVolume(workingDir + "/data", dataDir),
      new ServiceVolume(workingDir + "/engine.jwt", JWTDir),
    ];

    service.init(
      "ErigonService", // service
      service.id, // id
      1, // configVersion
      "thorax/erigon", // image
      "v2.36.1", // imageVersion
      [
        `erigon`,
        `--chain=${network}`,
        `--datadir=${dataDir}`,
        `--authrpc.addr=0.0.0.0`,
        `--authrpc.vhosts=*`,
        `--authrpc.port=8551`,
        `--authrpc.jwtsecret=/engine.jwt`,
        `--prune=default`,
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

    return service;
  }

  static buildByConfiguration(config) {
    const service = new ErigonService();

    service.initByConfig(config);

    return service;
  }

  switchImageTag(arch) {
    const armArchs = ["arm", "arm64", "aarch64_be", "aarch64", "armv8b", "armv8l"] //Possible arm architectures: https://stackoverflow.com/questions/45125516/possible-values-for-uname-m
    if (armArchs.includes(arch)) {
      this.imageVersion = this.imageVersion.endsWith("-arm64") ? this.imageVersion : this.imageVersion + "-arm64";
      this.imageVersion = this.imageVersion.startsWith("v") ? this.imageVersion.slice(1) : this.imageVersion;
    } else {
      this.imageVersion = this.imageVersion.endsWith("-arm64") ? this.imageVersion.replace("-arm64", "") : this.imageVersion
      this.imageVersion = this.imageVersion.startsWith("v") ? this.imageVersion : "v" + this.imageVersion;
    }
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
    return `\n  - job_name: stereum-${this.id
      }\n    metrics_path: /debug/metrics/prometheus\n    static_configs:\n      - targets: [${this.buildExecutionClientMetricsEndpoint()}]`;
  }
}

// EOF
