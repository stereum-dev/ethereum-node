import { NodeService } from "./NodeService.js";
import { ServicePortDefinition } from "./SerivcePortDefinition.js";
import { ServiceVolume } from "./ServiceVolume.js";

export class GrandineBeaconService extends NodeService {
  static buildByUserInput(network, ports, dir, executionClients = [], mevboost = [], checkpointURL) {
    const service = new GrandineBeaconService();
    service.setId();
    const workingDir = service.buildWorkingDir(dir);
    const image = "sifrai/grandine";

    const JWTDir = "/engine.jwt";
    const dataDir = "/opt/app/data";
    network = network === "op-mainnet" ? "mainnet" : network === "op-sepolia" ? "sepolia" : network;

    // volumes
    const volumes = [new ServiceVolume(workingDir + "/data", dataDir)];

    // eth1 nodes
    const eth1Nodes = executionClients
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

    service.init(
      "GrandineBeaconService", //service
      service.id, //id
      1, // configVersion
      image, //image
      "1.0.0", //imageVersion
      [
        "grandine",
        `--network=${network}`,
        `--data-dir=${dataDir}`,
        `--eth1-rpc-urls=${eth1Nodes}`,
        `--jwt-secret=${JWTDir}`,
        "--http-port=5052",
        "--http-address=0.0.0.0",
        "--disable-upnp",
        "--http-allowed-origins=*",
        "--listen-address=0.0.0.0",
        "--libp2p-port=9000",
        "--discovery-port=9000",
        "--quic-port=9001",
        "--target-peers=80",
        "--metrics",
        "--metrics-address=0.0.0.0",
        "--metrics-port=5054",
        "--prune-storage",
      ], //command
      null, //entrypoint
      null, //env
      ports, //ports
      volumes, //volumes
      null, //user
      network, //network
      executionClients, //executionClients
      null, //consensusClients
      mevboost //mevboost
    );

    if (checkpointURL) {
      service.command.push("--checkpoint-sync-url=" + checkpointURL);
    }
    if (mevboostEndpoint) service.command.push(`--builder-api-url=${mevboostEndpoint}`);

    return service;
  }

  static buildByConfiguration(config) {
    const service = new GrandineBeaconService();

    service.initByConfig(config);

    return service;
  }

  buildConsensusClientHttpEndpointUrl() {
    return "http://stereum-" + this.id + ":5052";
  }

  buildConsensusClientEndpoint() {
    return "stereum-" + this.id + ":5052";
  }

  buildConsensusClientGateway() {
    return "stereum-" + this.id + ":5052";
  }

  buildConsensusClientMetricsEndpoint() {
    return "stereum-" + this.id + ":5054";
  }

  getDataDir() {
    return this.volumes.find((volume) => volume.servicePath === "/opt/app/data")?.destinationPath;
  }

  getAvailablePorts() {
    return [
      new ServicePortDefinition(9000, "tcp", "P2P connections"),
      new ServicePortDefinition(9000, "udp", "P2P connections"),
      new ServicePortDefinition(5052, "tcp", "Consensus Client API"),
    ];
  }
}

// EOF
