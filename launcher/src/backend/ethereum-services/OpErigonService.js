import { NodeService } from "./NodeService.js";
import { ServiceVolume } from "./ServiceVolume.js";

export class OpErigonService extends NodeService {
  static buildByUserInput(network, ports, dir, executionClients) {
    const service = new OpErigonService();
    service.setId();
    const workingDir = service.buildWorkingDir(dir);

    const JWTDir = "/op-engine.jwt";
    const dataDir = "/op-erigon";
    const volumes = [new ServiceVolume(workingDir + "/data", dataDir), new ServiceVolume(workingDir + "/op-engine.jwt", JWTDir)];
    const sequencer = network === "op-mainnet" ? "https://mainnet-sequencer.optimism.io" : "https://sepolia-sequencer.optimism.io";

    // L2 geth
    const l2Geth = executionClients
      .filter((client) => client.service.includes("L2GethService"))
      .map((client) => {
        return client.buildExecutionClientRPCEndpointUrl();
      })
      .join();

    const cmd = service.generateOpErigonCommand(dataDir, JWTDir, sequencer, network, l2Geth);

    service.init(
      "OpErigonService", // service
      service.id, // id
      1, // configVersion
      "testinprod/op-erigon", // image
      "v2.60.10-0.8.2", // imageVersion
      cmd, // command
      ["/usr/local/bin/erigon"], // entrypoint
      null, // env
      ports, // ports
      volumes, // volumes
      "root", // user
      network, // network
      executionClients ? executionClients : [] // executionClients
      // consensusClients
    );

    return service;
  }

  generateOpErigonCommand(dataDir, JWTDir, sequencer, network, l2Geth) {
    const commonCmd = [
      `--datadir=${dataDir}`,
      `--private.api.addr=localhost:9090`,
      `--http`,
      `--http.api=eth,erigon,web3,net,debug,trace,txpool,db`,
      `--http.addr=0.0.0.0`,
      `--http.port=8545`,
      `--http.corsdomain=*`,
      `--http.vhosts=*`,
      `--ws`,
      `--ws.port=8546`,
      `--authrpc.vhosts=*`,
      `--authrpc.addr=0.0.0.0`,
      `--authrpc.port=8551`,
      `--authrpc.jwtsecret=${JWTDir}`,
      `--rollup.sequencerhttp=${sequencer}`,
      `--txpool.gossip.disable=true`,
      `--chain=${network}`,
      `--db.size.limit=8TB`,
      `--nodiscover`,
      `--metrics`,
      `--metrics.addr=0.0.0.0`,
      `--metrics.port=6060`,
    ];

    return network === "op-mainnet" && l2Geth ? [...commonCmd, `--rollup.historicalrpc=${l2Geth}`] : commonCmd;
  }

  static buildByConfiguration(config) {
    const service = new OpErigonService();

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
