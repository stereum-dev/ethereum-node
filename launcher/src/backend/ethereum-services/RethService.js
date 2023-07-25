import { NodeService } from "./NodeService";
import { ServiceVolume } from "./ServiceVolume";

export class RethService extends NodeService {
  static buildByUserInput(network, ports, dir) {
    const service = new RethService();
    service.setId();
    const workingDir = service.buildWorkingDir(dir);
    const dataDir = "/opt/app/reth";
    const JWTDir = "/engine.jwt";
    const volumes = [
      new ServiceVolume(workingDir + "/data", dataDir),
      new ServiceVolume(workingDir + "/engine.jwt", JWTDir),
    ];

    service.init(
      "RethService", // service
      service.id, // id
      1, // configVersion
      "ghcr.io/paradigmxyz/reth", // image
      "v0.1.0-alpha.3", // imageVersion
      [
        `--network=${network}`,
        `--data-path=${dataDir}`,
        //"--db.engine=pebble",
        "--http",
        "--http.port=8545",
        "--http.addr=0.0.0.0",
        //"--http.vhosts=*",
        '--http.api="engine,eth,web3,net,debug"',
        "--http.corsdomain=*",
        "--ws",
        "--ws.port=8546",
        "--ws.addr=0.0.0.0",
        '--ws.api="debug,eth,net,web3"',
        "--ws.origins=*",
        "--authrpc.port=8551",
        "--authrpc.addr=0.0.0.0",
        //"--authrpc.vhosts=*",
        "--authrpc.jwtsecret=/engine.jwt",
        "--metrics",
        "--metrics.expensive",
        "--metrics.port=6060",
        "--metrics.addr=0.0.0.0",
      ], // command
      ["reth"], // entrypoint
      { JAVA_OPTS: "-Xmx4g" }, // env
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
    const service = new RethService();

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

  buildPrometheusJob() {
    return `\n  - job_name: stereum-${
      this.id
    }\n    static_configs:\n      - targets: [${this.buildExecutionClientMetricsEndpoint()}]`;
  }
}

// EOF
