import { NodeService } from "./NodeService.js";
import { ServicePortDefinition } from "./SerivcePortDefinition.js";
import { ServiceVolume } from "./ServiceVolume.js";

export class NimbusBeaconService extends NodeService {
  static buildByUserInput(network, ports, dir, executionClients = [], mevboost = [], checkpointURL) {
    const service = new NimbusBeaconService();
    service.setId();
    const workingDir = service.buildWorkingDir(dir);

    const image = "statusim/nimbus-eth2";

    const JWTDir = "/engine.jwt";
    const dataDir = "/opt/app/beacon";

    const volumes = [new ServiceVolume(workingDir + "/beacon", dataDir)];

    const executionLayer = executionClients
      .map((client) => {
        const elJWTDir = client.volumes.find(
          (vol) => vol.servicePath === "/engine.jwt" || vol.destinationPath.includes("/engine.jwt")
        ).destinationPath;
        volumes.push(new ServiceVolume(elJWTDir, JWTDir));
        return client.buildExecutionClientEngineRPCWsEndpointUrl();
      })
      .join();

    // mevboost endpoint
    const mevboostEndpoint = mevboost
      .map((mevboost) => {
        return mevboost.buildMevboostEndpointURL();
      })
      .join();

    service.init(
      "NimbusBeaconService", //service
      service.id, // id,
      2, // configVersion
      image, // image,
      "multiarch-v22.10.0", // imageVersion,
      [
        `--network=${network}`,
        `--data-dir=${dataDir}`,
        `--web3-url=${executionLayer}`,
        "--metrics",
        "--metrics-port=8008",
        "--metrics-address=0.0.0.0",
        "--rest",
        "--rest-address=0.0.0.0",
        "--rest-port=5052",
        "--jwt-secret=/engine.jwt",
        "--history=prune",
        "--tcp-port=9000",
        "--udp-port=9000",
        "--enr-auto-update=false",
      ], // command,
      ["/home/user/nimbus_beacon_node"], // entrypoint,
      null, // env,
      ports, // ports,
      volumes, // volumes,
      null, // user,
      network, // network,
      executionClients, //executionClients
      null, //consensusClients
      mevboost //mevboost
    );
    if (checkpointURL) service.command.push("--trusted-node-url=" + checkpointURL);
    if (mevboostEndpoint) service.command.push("--payload-builder=true", `--payload-builder-url=${mevboostEndpoint}`);
    return service;
  }

  static buildByConfiguration(config) {
    const service = new NimbusBeaconService();

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
    return "stereum-" + this.id + ":8008";
  }

  buildPrometheusJob() {
    return `\n  - job_name: "nimbus"\n    metrics_path: /metrics\n    static_configs:\n      - targets: [${this.buildConsensusClientMetricsEndpoint()}]`;
  }

  getDataDir() {
    return this.volumes.find((volume) => volume.servicePath === "/opt/app/beacon")?.destinationPath;
  }

  getAvailablePorts() {
    return [
      new ServicePortDefinition(9000, "tcp", "P2P connections"),
      new ServicePortDefinition(9000, "udp", "P2P connections"),
      new ServicePortDefinition(9190, "tcp", "RPC Port"),
      new ServicePortDefinition(5052, "tcp", "REST Port"),
    ];
  }
}
