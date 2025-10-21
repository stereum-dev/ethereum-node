import { NodeService } from "./NodeService.js";
import { ServicePortDefinition } from "./SerivcePortDefinition.js";
import { ServiceVolume } from "./ServiceVolume.js";

export class LighthouseBeaconService extends NodeService {
  static buildByUserInput(network, ports, dir, executionClients = [], mevboost = [], checkpointURL) {
    const service = new LighthouseBeaconService();
    service.setId();
    const workingDir = service.buildWorkingDir(dir);
    const image = "sigp/lighthouse";

    const JWTDir = "/engine.jwt";
    const dataDir = "/opt/app/beacon";
    const slasherDir = "/opt/app/slasher";
    network = network === "op-mainnet" ? "mainnet" : network === "op-sepolia" ? "sepolia" : network;

    // volumes
    const volumes = [new ServiceVolume(workingDir + "/beacon", dataDir), new ServiceVolume(workingDir + "/slasher", slasherDir)];

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
      "LighthouseBeaconService", //service
      service.id, //id
      1, // configVersion
      image, //image
      "v3.1.2", //imageVersion
      [
        "lighthouse",
        "bn",
        "--debug-level=info",
        `--network=${network}`,
        `--execution-endpoint=${eth1Nodes}`,
        `--execution-jwt=${JWTDir}`,
        `--datadir=${dataDir}`,
        "--http",
        "--http-address=0.0.0.0",
        "--metrics",
        "--metrics-address=0.0.0.0",
        "--disable-upnp",
        "--validator-monitor-auto",
        "--slasher",
        `--slasher-dir=${slasherDir}`,
        "--port=9000",
        "--enr-tcp-port=9000",
        "--enr-udp-port=9000",
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
    } else {
      service.command.push("--allow-insecure-genesis-sync");
    }
    if (mevboostEndpoint) service.command.push(`--builder=${mevboostEndpoint}`);

    return service;
  }

  static buildByConfiguration(config) {
    const service = new LighthouseBeaconService();

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
    return this.volumes.find((volume) => volume.servicePath === "/opt/app/beacon")?.destinationPath;
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
