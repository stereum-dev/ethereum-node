import { NodeService } from "./NodeService.js";
import { ServicePortDefinition } from "./SerivcePortDefinition.js";
import { ServiceVolume } from "./ServiceVolume.js";

export class LodestarBeaconService extends NodeService {
  static buildByUserInput(network, ports, dir, executionClients = [], mevboost = [], checkpointURL) {
    const service = new LodestarBeaconService();
    service.setId();
    const workingDir = service.buildWorkingDir(dir);

    const image = "chainsafe/lodestar";

    const JWTDir = "/engine.jwt";
    const dataDir = "/opt/app/beacon";
    network = network === "op-mainnet" ? "mainnet" : network === "op-sepolia" ? "sepolia" : network;

    // volumes
    const volumes = [new ServiceVolume(workingDir + "/beacon", dataDir)];

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
      "LodestarBeaconService", //service
      service.id, //id
      1, // configVersion
      image, //image
      "v1.3.0", //imageVersion
      [
        `beacon`,
        `--network=${network}`,
        `--dataDir=${dataDir}`,
        `--rest.port=9596`,
        `--rest.namespace=*`,
        `--rest.address=0.0.0.0`,
        `--jwt-secret=${JWTDir}`,
        `--execution.urls=${eth1Nodes}`,
        `--metrics=true`,
        `--metrics.port=8008`,
        `--metrics.address=0.0.0.0`,
        `--builder`,
        `--port=9000`,
        `--nat=false`,
        `--enr.tcp=9000`,
        `--enr.udp=9000`,
      ], //command
      ["node", "./packages/cli/bin/lodestar"], //entrypoint
      { NODE_OPTIONS: "--max-old-space-size=8192" }, //env
      ports, //ports
      volumes, //volumes
      null, //user
      network, //network
      executionClients, //executionClients
      null, //consensusClients
      mevboost //mevboost
    );

    if (checkpointURL) service.command.push("--checkpointSyncUrl=" + checkpointURL);
    if (mevboostEndpoint) service.command.push(`--builder.urls=${mevboostEndpoint}`);
    return service;
  }

  static buildByConfiguration(config) {
    const service = new LodestarBeaconService();

    service.initByConfig(config);

    return service;
  }

  buildConsensusClientHttpEndpointUrl() {
    return "http://stereum-" + this.id + ":9596";
  }

  buildConsensusClientEndpoint() {
    return "stereum-" + this.id + ":9596";
  }

  buildConsensusClientGateway() {
    return "stereum-" + this.id + ":9596";
  }

  buildConsensusClientMetricsEndpoint() {
    return "stereum-" + this.id + ":8008";
  }

  getDataDir() {
    return this.volumes.find((volume) => volume.servicePath === "/opt/app/beacon")?.destinationPath;
  }

  getAvailablePorts() {
    return [
      new ServicePortDefinition(9000, "tcp", "P2P connections"),
      new ServicePortDefinition(9000, "udp", "P2P connections"),
      new ServicePortDefinition(9596, "tcp", "Consensus Client API"),
    ];
  }
}

// EOF
