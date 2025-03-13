import { NodeService } from "./NodeService.js";
import { ServicePortDefinition } from "./SerivcePortDefinition.js";
import { ServiceVolume } from "./ServiceVolume.js";

export class NimbusValidatorService extends NodeService {
  static buildByUserInput(network, ports, dir, consensusClients = []) {
    const service = new NimbusValidatorService();
    service.setId();
    const workingDir = service.buildWorkingDir(dir);

    const dataDir = "/opt/app/data";
    const validatorsDir = "/opt/app/validators";
    const secretsDir = "/opt/app/secrets";
    const volumes = [
      new ServiceVolume(workingDir + "/data", dataDir),
      new ServiceVolume(workingDir + "/validator/validators", validatorsDir),
      new ServiceVolume(workingDir + "/validator/secrets", secretsDir),
    ];
    const image = "statusim/nimbus-validator-client";

    const beaconNodes = consensusClients
      .map((client) => {
        return client.buildConsensusClientHttpEndpointUrl();
      })
      .join();

    service.init(
      "NimbusValidatorService", //service
      service.id, // id,
      1, // configVersion
      image, // image,
      "multiarch-v23.4.0", // imageVersion,
      [
        "--log-level=INFO",
        `--data-dir=${dataDir}`,
        `--validators-dir=${validatorsDir}`,
        `--secrets-dir=${secretsDir}`,
        "--suggested-fee-recipient=0x0000000000000000000000000000000000000000",
        "--keymanager",
        "--keymanager-port=5052",
        "--keymanager-address=0.0.0.0",
        "--keymanager-token-file=/opt/app/validators/api-token.txt",
        "--metrics",
        "--metrics-address=0.0.0.0",
        "--metrics-port=8108",
        `--graffiti=stereum.net`,
        "--payload-builder",
        `--beacon-node=${beaconNodes}`,
        "--doppelganger-detection=true",
      ], // command,
      ["/home/user/nimbus_validator_client"], // entrypoint,
      null, // env,
      ports, // ports,
      volumes, // volumes,
      null, // user,
      network, // network,
      null, //executionClients
      consensusClients //consensusClients
    );

    if (consensusClients.some((c) => c.service === "CharonService")) {
      service.command[service.command.findIndex((c) => c === "--doppelganger-detection=true")] = "--doppelganger-detection=false";
    }

    return service;
  }

  static buildByConfiguration(config) {
    const service = new NimbusValidatorService();

    service.initByConfig(config);

    return service;
  }

  buildValidatorClientMetricsEndpoint() {
    return "stereum-" + this.id + ":8108";
  }

  getAvailablePorts() {
    return [new ServicePortDefinition(8108, "tcp", "Metrics Port"), new ServicePortDefinition(5052, "tcp", "Keymanager Port")];
  }
}
