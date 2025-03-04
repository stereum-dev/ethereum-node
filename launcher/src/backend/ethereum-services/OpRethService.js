import { NodeService } from "./NodeService.js";
import { ServiceVolume } from "./ServiceVolume.js";

export class OpRethService extends NodeService {
  static buildByUserInput(network, ports, dir) {
    const service = new OpRethService();
    service.setId();
    const workingDir = service.buildWorkingDir(dir);

    const JWTDir = "/op-engine.jwt";
    const dataDir = "/op-reth";
    const volumes = [new ServiceVolume(workingDir + "/data", dataDir), new ServiceVolume(workingDir + "/op-engine.jwt", JWTDir)];

    network = network.includes("mainnet") ? "optimism-mainnet" : network.includes("sepolia") ? "optimism-sepolia" : network;
    const sequencer = network === "optimism-mainnet" ? "https://mainnet-sequencer.optimism.io" : "https://sepolia-sequencer.optimism.io";

    const cmd = service.generateOpRethCommand(dataDir, JWTDir, sequencer, network);

    service.init(
      "OpRethService", // service
      service.id, // id
      1, // configVersion
      "ghcr.io/paradigmxyz/op-reth", // image
      "v1.2.1", // imageVersion
      cmd, // command
      ["/usr/local/bin/op-reth"], // entrypoint
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

  generateOpRethCommand(dataDir, JWTDir, sequencer, network) {
    const commonCmd = [
      `node`,
      `--full`,
      `--chain=${network}`,
      `--datadir=${dataDir}`,
      `--rollup.sequencer-http=${sequencer}`,
      `--http`,
      `--http.addr=0.0.0.0`,
      `--http.port=8545`,
      `--http.corsdomain=*`,
      `--http.api=all`,
      `--ws`,
      `--ws.addr=0.0.0.0`,
      `--ws.port=8546`,
      `--ws.origins=*`,
      `--ws.api=all`,
      `--authrpc.jwtsecret=${JWTDir}`,
      `--authrpc.addr=0.0.0.0`,
      `--authrpc.port=8551`,
    ];

    return commonCmd;
    // return network === "optimism-mainnet" && l2Geth ? [...commonCmd, `--rollup.historicalrpc=${l2Geth}`] : commonCmd;
  }

  static buildByConfiguration(config) {
    const service = new OpRethService();

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

  buildPrometheusJob() {
    return `\n  - job_name: stereum-${
      this.id
    }\n    metrics_path: /debug/metrics/prometheus\n    static_configs:\n      - targets: [${this.buildExecutionClientMetricsEndpoint()}]`;
  }
}

// EOF
