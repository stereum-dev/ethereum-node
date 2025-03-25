import { NodeService } from "./NodeService.js";
import { ServicePortDefinition } from "./SerivcePortDefinition.js";
import { ServiceVolume } from "./ServiceVolume.js";

export class SSVNetworkService extends NodeService {
  getServiceConfiguration(network, executionClients = [], consensusClients = []) {
    return `global:
  # Console output log level 
  LogLevel: info

  # Number of log files preserved (roughly equivalent to number of days)
  # Increase if you want to preserve log files for longer. This would require more disk space
  LogFileBackups: 28
  
  # Debug logs file path
  #LogFilePath: ./data/debug.log

#db:
  # Path to a persistent directory to store the node's database.
  #Path: ./data/db

ssv:
  # The SSV network to join to
  # Mainnet = Network: mainnet (default)
  # Testnet (Goerli) = Network: jato-v2
  # Testnet (Holesky) = Network: holesky
  Network: ${network === "goerli" ? "jato-v2" : network}
  
  ValidatorOptions:
    # Whether to enable MEV block production. Requires the connected Beacon node to be MEV-enabled.
    BuilderProposals: false

eth2:
  BeaconNodeAddr: ${consensusClients.map((client) => client.buildConsensusClientHttpEndpointUrl())[0]}

eth1:
  ETH1Addr: ${executionClients.map((client) => client.buildExecutionClientWsEndpointUrl())[0]}

p2p:
  # HostAddress: 192.168.1.1
  TcpPort: 13000
  UdpPort: 12000

OperatorPrivateKey: ""

MetricsAPIPort: 15000
SSVAPIPort: 16000`;
  }

  static buildByUserInput(network, ports, dir, executionClients = [], consensusClients = []) {
    const service = new SSVNetworkService();
    service.setId();
    const workingDir = service.buildWorkingDir(dir);

    const image = "ssvlabs/ssv-node";

    const volumes = [new ServiceVolume(workingDir + "/data", "/data"), new ServiceVolume(workingDir + "/secrets", "/secrets")];

    // build service
    service.init(
      "SSVNetworkService", // service
      service.id, // id
      1, // configVersion
      image, //image
      "v0.3.4", //imageVersion
      "make BUILD_PATH=/go/bin/ssvnode start-node && docker logs ssv_node", // command
      null, // entrypoint
      {
        CONFIG_PATH: "/data/config.yaml",
      }, // env
      ports, // ports
      volumes, // volumes
      null, // user
      network, // network
      executionClients, // executionClients
      consensusClients // consensusClients
    );

    return service;
  }

  static buildByConfiguration(config) {
    const service = new SSVNetworkService();

    service.initByConfig(config);

    return service;
  }

  buildValidatorClientMetricsEndpoint() {
    return "stereum-" + this.id + ":15000";
  }

  buildSSVNodeApiEndpoint() {
    return "stereum-" + this.id + ":16000";
  }

  buildPrometheusJob() {
    return `\n  - job_name: ssv\n    metrics_path: /metrics\n    static_configs:\n      - targets: [${this.buildValidatorClientMetricsEndpoint()}]\n  - job_name: ssv_health\n    metrics_path: /health\n    static_configs:\n      - targets: [${this.buildValidatorClientMetricsEndpoint()}]`;
  }

  getAvailablePorts() {
    return [
      new ServicePortDefinition(13000, "tcp", "P2P connections"),
      new ServicePortDefinition(12000, "udp", "P2P connections"),
      new ServicePortDefinition(15000, "udp", "Metrics port"),
      new ServicePortDefinition(16000, "tcp", "SSV Node API"),
    ];
  }
}

// EOF
