import { NodeService } from "./NodeService.js";
import { ServicePortDefinition } from "./SerivcePortDefinition.js";
import { ServiceVolume } from "./ServiceVolume.js";

export class LighthouseValidatorService extends NodeService {
  static buildByUserInput(network, ports, dir, consensusClients = []) {
    const service = new LighthouseValidatorService();
    service.setId();
    const workingDir = service.buildWorkingDir(dir);

    const image = "sigp/lighthouse";

    const dataDir = "/opt/app/validator";
    const graffitiDir = "/opt/app/graffitis";

    const volumes = [new ServiceVolume(workingDir + "/validator", dataDir), new ServiceVolume(workingDir + "/graffitis", graffitiDir)];

    const eth2Nodes = consensusClients
      .map((client) => {
        return client.buildConsensusClientHttpEndpointUrl();
      })
      .join();

    // build service
    service.init(
      "LighthouseValidatorService", //service
      service.id, //id
      1, //configVersion
      image, //image
      "v3.1.2", //imageVersion
      [
        "lighthouse",
        "vc",
        "--enable-doppelganger-protection",
        "--debug-level=debug",
        `--network=${network}`,
        `--beacon-nodes=${eth2Nodes}`,
        "--suggested-fee-recipient=0x0000000000000000000000000000000000000000",
        `--datadir=${dataDir}`,
        "--init-slashing-protection",
        `--graffiti-file=${graffitiDir}/graffitis.yaml`,
        "--metrics",
        "--metrics-address=0.0.0.0",
        "--http",
        "--http-address=0.0.0.0",
        "--http-port=5062",
        "--unencrypted-http-transport",
        "--builder-proposals",
      ], //command
      null, // entrypoint
      null, // env
      ports, //ports
      volumes, //volumes
      null, //user
      network, //network
      null, //executionClients
      consensusClients //consensusClients
    );

    if (consensusClients.some((c) => c.service === "CharonService")) {
      service.command = service.command.filter((c) => c !== "--enable-doppelganger-protection");
    }

    return service;
  }

  static buildByConfiguration(config) {
    const service = new LighthouseValidatorService();

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
