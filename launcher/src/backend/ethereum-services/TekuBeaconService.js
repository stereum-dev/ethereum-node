import { NodeService } from "./NodeService.js";
import { ServicePortDefinition } from "./SerivcePortDefinition.js";
import { ServiceVolume } from "./ServiceVolume.js";

export class TekuBeaconService extends NodeService {
  static buildByUserInput(network, ports, dir, executionClients, mevboost, checkpointURL) {
    const service = new TekuBeaconService();
    service.setId();
    const workingDir = service.buildWorkingDir(dir);

    const image = "consensys/teku";

    const JWTDir = "/engine.jwt";
    const dataDir = "/opt/app/data";

    const volumes = [new ServiceVolume(workingDir + "/data", dataDir)];

    const executionLayer = executionClients
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
      "TekuBeaconService", // service
      service.id, // id
      2, // configVersion
      image, // image
      "22.10.1", // imageVersion
      [
        `--network=${network}`,
        "--p2p-enabled=true",
        "--p2p-port=9001",
        "--p2p-advertised-port=9001",
        //`--eth1-endpoints=${executionLayer}`,
        `--ee-endpoint=${executionLayer}`,
        `--ee-jwt-secret-file=${JWTDir}`,
        "--metrics-enabled=true",
        "--metrics-port=8008",
        "--metrics-interface=0.0.0.0",
        "--metrics-host-allowlist=*",
        "--metrics-publish-interval=10",
        `--data-path=${dataDir}`,
        "--data-storage-mode=prune",
        "--rest-api-port=5051",
        "--rest-api-host-allowlist=*",
        "--rest-api-interface=0.0.0.0",
        "--rest-api-docs-enabled=true",
        "--rest-api-enabled=true",
        "--log-destination=CONSOLE",
      ], // command
      ["/opt/teku/bin/teku"], // entrypoint
      { JAVA_OPTS: "-Xmx6g" }, // env
      ports, // ports
      volumes, // volumes
      null, // user
      network, // network
      executionClients, // executionClients
      null, //consensusClients
      mevboost //mevboost
    );
    if (checkpointURL) {
      service.command.push("--initial-state=" + checkpointURL);
    } else {
      service.command.push("--ignore-weak-subjectivity-period-enabled");
    }
    if (mevboostEndpoint) service.command.push(`--builder-endpoint=${mevboostEndpoint}`);
    return service;
  }

  static buildByConfiguration(config) {
    const service = new TekuBeaconService();

    service.initByConfig(config);

    return service;
  }

  buildConsensusClientHttpEndpointUrl() {
    return "http://stereum-" + this.id + ":5051";
  }

  buildConsensusClientEndpoint() {
    return "stereum-" + this.id + ":5051";
  }

  buildConsensusClientGateway() {
    return "stereum-" + this.id + ":5051";
  }

  buildConsensusClientMetricsEndpoint() {
    return "stereum-" + this.id + ":8008";
  }

  buildPrometheusJob() {
    return `\n  - job_name: stereum-${
      this.id
    }\n    scrape_timeout: 10s\n    metrics_path: /metrics\n    scheme: http\n    static_configs:\n      - targets: [${this.buildConsensusClientMetricsEndpoint()}]`;
  }

  getDataDir() {
    return this.volumes.find((volume) => volume.servicePath === "/opt/app/data")?.destinationPath;
  }

  getAvailablePorts() {
    return [
      new ServicePortDefinition(9001, "tcp", "P2P connections"),
      new ServicePortDefinition(9001, "udp", "P2P connections"),
      new ServicePortDefinition(5052, "tcp", "Validator API Port"),
      new ServicePortDefinition(5051, "tcp", "REST API Port"),
      new ServicePortDefinition(8008, "tcp", "METRICS Port"),
    ];
  }
}

// EOF
