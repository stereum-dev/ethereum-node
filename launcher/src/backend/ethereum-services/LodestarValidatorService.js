import { NodeService } from "./NodeService.js";
import { ServicePortDefinition } from "./SerivcePortDefinition.js";
import { ServiceVolume } from "./ServiceVolume.js";

export class LodestarValidatorService extends NodeService {
  static buildByUserInput(network, ports, dir, consensusClients = []) {
    const service = new LodestarValidatorService();
    service.setId();
    const workingDir = service.buildWorkingDir(dir);

    const image = "chainsafe/lodestar";

    const dataDir = "/opt/app/validator";

    const volumes = [new ServiceVolume(workingDir + "/validator", dataDir)];

    const eth2Nodes = consensusClients
      .map((client) => {
        return client.buildConsensusClientHttpEndpointUrl();
      })
      .join();

    // build service
    service.init(
      "LodestarValidatorService", //service
      service.id, //id
      1, //configVersion
      image, //image
      "v1.3.0", //imageVersion
      [
        `validator`,
        `--network=${network}`,
        `--dataDir=${dataDir}`,
        `--beaconNodes=${eth2Nodes}`,
        `--keymanager=true`,
        `--keymanager.address=0.0.0.0`,
        `--keymanager.port=5062`,
        `--metrics=true`,
        `--metrics.port=5064`,
        `--metrics.address=0.0.0.0`,
        `--builder`,
        `--suggestedFeeRecipient=0x0000000000000000000000000000000000000000`,
        `--doppelgangerProtection=true`,
      ], //command
      ["node", "./packages/cli/bin/lodestar"], // entrypoint
      null, // env
      ports, //ports
      volumes, //volumes
      null, //user
      network, //network
      null, //executionClients
      consensusClients //consensusClients
    );

    if (consensusClients.some((c) => c.service === "CharonService")) {
      service.command.push("--distributed");
      service.command[service.command.findIndex((c) => c === "--doppelgangerProtection=true")] = "--doppelgangerProtection=false";
      service.command.push("--builder.selection=builderalways");
    }

    return service;
  }

  static buildByConfiguration(config) {
    const service = new LodestarValidatorService();

    service.initByConfig(config);

    return service;
  }

  buildValidatorClientMetricsEndpoint() {
    return "stereum-" + this.id + ":5064";
  }

  getAvailablePorts() {
    return [new ServicePortDefinition(5062, "tcp", "Validator Client API")];
  }
}

// EOF
