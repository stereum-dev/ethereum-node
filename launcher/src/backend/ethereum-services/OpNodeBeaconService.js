import { NodeService } from "./NodeService.js";
import { ServicePortDefinition } from "./SerivcePortDefinition.js";
import { ServiceVolume } from "./ServiceVolume.js";

export class OpNodeBeaconService extends NodeService {
  static buildByUserInput(network, ports, dir, executionClients, consensusClients) {
    const service = new OpNodeBeaconService();
    service.setId();
    const workingDir = service.buildWorkingDir(dir);
    const image = "us-docker.pkg.dev/oplabs-tools-artifacts/images/op-node";

    const JWTDir = "/op-engine.jwt";
    const dataDir = "/p2p";

    // volumes
    const volumes = [new ServiceVolume(workingDir, dataDir)];

    // eth1 nodes
    const l1Execution = executionClients
      .filter((client) => !client.service.includes("OpGethService"))
      .map((client) => {
        return client.buildExecutionClientHttpEndpointUrl();
      })
      .join();

    const l1Consensus = consensusClients
      .map((client) => {
        return client.buildConsensusClientHttpEndpointUrl();
      })
      .join();

    // l2 clients
    const l2Execution = executionClients
      .filter((client) => client.service.includes("OpGethService"))
      .map((client) => {
        const elJWTDir = client.volumes.find(
          (vol) => vol.servicePath === "/op-engine.jwt" || vol.destinationPath.includes("/op-engine.jwt")
        ).destinationPath;
        volumes.push(new ServiceVolume(elJWTDir, JWTDir));
        return client.buildExecutionClientEngineRPCHttpEndpointUrl();
      })
      .join();

    service.init(
      "OpNodeBeaconService", //service
      service.id, //id
      1, // configVersion
      image, //image
      "v1.10.2", //imageVersion
      [
        "op-node",
        ...(l1Execution ? [`--l1=${l1Execution}`] : []),
        `--l2=${l2Execution}`,
        "--rpc.addr=0.0.0.0",
        "--rpc.port=9545",
        "--l2.jwt-secret=/op-engine.jwt",
        "--l1.trustrpc=false",
        "--l1.rpckind=standard",
        ...(l1Consensus ? [`--l1.beacon=${l1Consensus}`] : []),
        "--metrics.enabled",
        "--metrics.addr=0.0.0.0",
        "--metrics.port=7300",
        "--syncmode=execution-layer",
        `--network=${network}`,
        "--rollup.load-protocol-versions=true",
        "--rollup.halt=major",
        "--p2p.priv.path=/p2p/opnode_p2p_priv.txt",
        "--p2p.peerstore.path=/p2p/opnode_peerstore_db",
        "--p2p.discovery.path=/p2p/opnode_discovery_db",
      ], //command
      null, //entrypoint
      null, //env
      ports, //ports
      volumes, //volumes
      null, //user
      network, //network
      executionClients, //executionClients
      consensusClients, //consensusClients
      null //mevboost
    );

    return service;
  }

  static buildByConfiguration(config) {
    const service = new OpNodeBeaconService();

    service.initByConfig(config);

    return service;
  }

  buildConsensusClientHttpEndpointUrl() {
    return "http://stereum-" + this.id + ":9545";
  }

  buildConsensusClientMetricsEndpoint() {
    return "stereum-" + this.id + ":7300";
  }

  buildPrometheusJob() {
    return `\n  - job_name: stereum-${this.id}\n    static_configs:\n      - targets: [${this.buildConsensusClientMetricsEndpoint()}]`;
  }

  getAvailablePorts() {
    return [
      new ServicePortDefinition(9003, "tcp", "P2P connections"),
      new ServicePortDefinition(9003, "udp", "P2P connections"),
      new ServicePortDefinition(9545, "", "Op Node Consensus Client HTTP"),
    ];
  }
}

// EOF
