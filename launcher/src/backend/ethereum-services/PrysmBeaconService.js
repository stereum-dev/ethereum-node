import { NodeService } from "./NodeService.js";
import { ServicePortDefinition } from "./SerivcePortDefinition.js";
import { ServiceVolume } from "./ServiceVolume.js";

export class PrysmBeaconService extends NodeService {
  static buildByUserInput(network, ports, dir, executionClients, mevboost, checkpointURL) {
    const service = new PrysmBeaconService();
    service.setId();
    const workingDir = service.buildWorkingDir(dir);

    const image = "prysmaticlabs/prysm-beacon-chain";

    const JWTDir = network === "devnet" ? "/execution/engine.jwt" : "/engine.jwt";
    const dataDir = network === "devnet" ? "/consensus/beacondata" : "/opt/app/beacon";
    const genesisDir = network === "devnet" ? "/consensus" : "/opt/app/genesis";
    const configYamlDir = "/consensus";
    const executionDir = "/execution";

    //volumes

    const volumes =
      network === "devnet"
        ? [new ServiceVolume(workingDir, configYamlDir)]
        : [new ServiceVolume(workingDir + "/beacon", dataDir), new ServiceVolume(workingDir + "/genesis", genesisDir)];

    //execution endpoint
    const executionEndpoint =
      network === "devnet"
        ? executionClients
            .map((client) => {
              const elJWTDir = client.volumes.find(
                (vol) => vol.servicePath === "/execution/engine.jwt" || vol.destinationPath.includes("/engine.jwt")
              ).destinationPath;

              const baseDir = elJWTDir.split("/engine.jwt")[0];
              volumes.push(new ServiceVolume(baseDir, executionDir));
              volumes.push(new ServiceVolume(elJWTDir, JWTDir));

              return client.buildExecutionClientEngineRPCHttpEndpointUrl();
            })
            .join()
        : executionClients
            .map((client) => {
              const elJWTDir = client.volumes.find(
                (vol) => vol.servicePath === "/engine.jwt" || vol.destinationPath.includes("/engine.jwt")
              ).destinationPath;
              volumes.push(new ServiceVolume(elJWTDir, JWTDir));
              return client.buildExecutionClientEngineRPCHttpEndpointUrl();
            })
            .join();

    // mevboost endpoint
    const mevboostEndpoint = mevboost
      .map((mevboost) => {
        return mevboost.buildMevboostEndpointURL();
      })
      .join();

    const cmd =
      network === "devnet"
        ? [
            `--datadir=${dataDir}`,
            "--min-sync-peers=0",
            `--genesis-state=${genesisDir}/genesis.ssz`,
            "--interop-eth1data-votes",
            `--chain-config-file=${configYamlDir}/config.yml`,
            "--contract-deployment-block=0",
            "--chain-id=${CHAIN_ID:-32382}",
            "--rpc-host=0.0.0.0",
            "--grpc-gateway-host=0.0.0.0",
            `--execution-endpoint=${executionEndpoint}`,
            "--accept-terms-of-use=true",
            `--jwt-secret=${JWTDir}`,
            "--suggested-fee-recipient=0x123463a4b065722e99115d6c222f267d9cabb524",
            "--minimum-peers-per-subnet=0",
            "--monitoring-host=0.0.0.0",
            "--monitoring-port=8080",
            "--force-clear-db",
          ]
        : [
            "--accept-terms-of-use=true",
            `--${network}`,
            `--datadir=${dataDir}`,
            `--block-batch-limit=512`,
            "--rpc-host=0.0.0.0",
            "--grpc-gateway-host=0.0.0.0",
            "--p2p-max-peers=100",
            `--execution-endpoint=${executionEndpoint}`,
            `--jwt-secret=${JWTDir}`,
            "--monitoring-host=0.0.0.0",
            "--monitoring-port=8080",
            "--p2p-tcp-port=13001",
            "--p2p-udp-port=12001",
          ];

    const imageVersion = network === "devnet" ? "v5.0.4" : "v5.1.0";

    service.init(
      "PrysmBeaconService", //service
      service.id, //id
      1, // configVersion
      image, //image
      imageVersion, //imageVersion
      cmd, // command
      ["/app/cmd/beacon-chain/beacon-chain"], //entrypoint
      null, //env
      ports, //ports
      volumes, //volumes
      null, //user
      network, //network
      executionClients, //executionClients
      null, //consensusClients
      mevboost //mevboost
    );

    if (network == "holesky" || network == "sepolia") {
      service.command.push(`--genesis-state=/opt/app/genesis/prysm-${network}-genesis.ssz`);
    }

    if (checkpointURL) {
      service.command.push(`--checkpoint-sync-url=${checkpointURL}`);
    }

    if (mevboostEndpoint) {
      service.command.push(`--http-mev-relay=${mevboostEndpoint}`);
    }

    return service;
  }

  static buildByConfiguration(config) {
    const service = new PrysmBeaconService();

    service.initByConfig(config);

    return service;
  }

  buildConsensusClientEndpoint() {
    return "stereum-" + this.id + ":4000";
  }

  buildConsensusClientGateway() {
    return "stereum-" + this.id + ":3500";
  }

  buildConsensusClientHttpEndpointUrl() {
    return "http://stereum-" + this.id + ":3500";
  }

  buildConsensusClientMetricsEndpoint() {
    return "stereum-" + this.id + ":8080";
  }

  buildPrometheusJob() {
    return `\n  - job_name: stereum-${this.id}\n    static_configs:\n      - targets: [${this.buildConsensusClientMetricsEndpoint()}]`;
  }

  getAvailablePorts() {
    return [
      new ServicePortDefinition(13001, "tcp", "P2P connections"),
      new ServicePortDefinition(12001, "udp", "P2P connections"),
      new ServicePortDefinition(4000, "tcp", "Consensus Client API"),
    ];
  }
}
