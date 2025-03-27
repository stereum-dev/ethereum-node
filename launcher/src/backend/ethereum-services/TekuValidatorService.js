import { NodeService } from "./NodeService.js";
import { ServicePortDefinition } from "./SerivcePortDefinition.js";
import { ServiceVolume } from "./ServiceVolume.js";

export class TekuValidatorService extends NodeService {
  static buildByUserInput(network, ports, dir, consensusClients = []) {
    const service = new TekuValidatorService();
    service.setId();
    const workingDir = service.buildWorkingDir(dir);

    const image = "consensys/teku";

    const beaconNodes = consensusClients
      .map((client) => {
        return client.buildConsensusClientHttpEndpointUrl();
      })
      .join();

    const dataDir = "/opt/app/data";
    const graffitiDir = "/opt/app/graffitis";

    const volumes = [new ServiceVolume(workingDir + "/data", dataDir), new ServiceVolume(workingDir + "/graffitis", graffitiDir)];

    service.init(
      "TekuValidatorService", // service
      service.id, // id
      1, // configVersion
      image, // image
      "23.4.0", // imageVersion
      [
        "vc",
        `--beacon-node-api-endpoint=${beaconNodes}`,
        `--network=${network}`,
        "--logging=INFO",
        `--data-path=${dataDir}`,
        "--validators-keystore-locking-enabled=true",
        `--validators-proposer-default-fee-recipient=0x0000000000000000000000000000000000000000`,
        `--validators-graffiti-file=${graffitiDir}/graffitis.yaml`,
        "--log-destination=CONSOLE",
        "--metrics-enabled=true",
        "--metrics-port=8008",
        "--metrics-interface=0.0.0.0",
        "--metrics-host-allowlist=*",
        "--metrics-publish-interval=10",
        "--validator-api-enabled=true",
        "--validator-api-port=5052",
        "--validator-api-host-allowlist=*",
        "--validator-api-cors-origins=*",
        `--validator-api-keystore-file=${dataDir}/teku_api_keystore`,
        `--validator-api-keystore-password-file=${dataDir}/teku_api_password.txt`,
        "--validators-builder-registration-default-enabled=true",
        "--validators-proposer-blinded-blocks-enabled=true",
        "--doppelganger-detection-enabled=true",
      ], // command
      ["/opt/teku/bin/teku"], // entrypoint
      { JAVA_OPTS: "-Xmx4g" }, // env
      ports, // ports
      volumes, // volumes
      null, // user
      network, // network
      null, // executionClients
      consensusClients //consensusClients
    );

    if (consensusClients.some((c) => c.service === "CharonService")) {
      service.command[service.command.findIndex((c) => c === "--doppelganger-detection-enabled=true")] =
        "--doppelganger-detection-enabled=false";
    }

    return service;
  }

  static buildByConfiguration(config) {
    const service = new TekuValidatorService();

    service.initByConfig(config);

    return service;
  }

  getAvailablePorts() {
    return [new ServicePortDefinition(5052, "tcp", "Validator API Port")];
  }
}

// EOF
