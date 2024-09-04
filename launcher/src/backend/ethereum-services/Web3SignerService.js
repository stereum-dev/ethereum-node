import { NodeService } from "./NodeService.js";
import { ServicePortDefinition } from "./SerivcePortDefinition.js";
import { ServiceVolume } from "./ServiceVolume.js";

export class Web3SignerService extends NodeService {
  static buildByUserInput(network, ports, dir) {
    const service = new Web3SignerService();
    service.setId();
    const workingDir = service.buildWorkingDir(dir);

    const image = "consensys/web3signer";

    const dataDir = "/opt/web3signer/data";
    const keysDir = "/opt/web3signer/keys";

    const volumes = [new ServiceVolume(workingDir + "/data", dataDir), new ServiceVolume(workingDir + "/keys", keysDir)];

    service.init(
      "Web3SignerService", // service
      service.id, // id
      1, // configVersion
      image, // image
      "23.2.1", // imageVersion
      [
        `--key-store-path=${keysDir}`,
        `--data-path=${dataDir}`,
        "--logging=INFO",
        "--http-cors-origins=*",
        "--http-listen-host=0.0.0.0",
        "--http-listen-port=9000",
        "--http-host-allowlist=*",
        "--metrics-enabled=true",
        "--metrics-host=0.0.0.0",
        "--metrics-port=9001",
        "--metrics-host-allowlist=*",
        "eth2",
        `--network=${network}`,
        "--key-manager-api-enabled=true",
        "--slashing-protection-enabled=false",
      ], // command
      ["/opt/web3signer/bin/web3signer"], // entrypoint
      {}, // env
      ports, // ports
      volumes, // volumes
      null, // user
      network, // network
      null, // executionClients
      null, //consensusClients
      null //mevboost
    );
    return service;
  }

  static buildByConfiguration(config) {
    const service = new Web3SignerService();

    service.initByConfig(config);

    return service;
  }

  buildWeb3SignerHttpEndpointUrl() {
    return "http://stereum-" + this.id + ":9000";
  }

  buildWeb3SignerEndpoint() {
    return "stereum-" + this.id + ":9000";
  }

  buildWeb3SignerMetricsEndpoint() {
    return "stereum-" + this.id + ":9001";
  }

  getAvailablePorts() {
    return [new ServicePortDefinition(9000, "tcp", "REST API Port"), new ServicePortDefinition(9001, "tcp", "METRICS Port")];
  }
}

// EOF
