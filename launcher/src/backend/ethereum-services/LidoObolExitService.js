import { NodeService } from "./NodeService";
import { ServiceVolume } from "./ServiceVolume";

export class LidoObolExitService extends NodeService {
  static buildByUserInput(network, ports, dir) {
    const service = new LidoObolExitService();
    service.setId();
    const workingDir = service.buildWorkingDir(dir);

    const image = "obolnetwork/lido-dv-exit";

    const exitmessagesDir = "/exitmessages";
    const charonDir = "/charon";

    const volumes = [
      new ServiceVolume(workingDir + "/exitmessages", exitmessagesDir),
      new ServiceVolume(workingDir + "/charon", charonDir),
    ];

    service.init(
      "LidoObolExitService", //service
      service.id, // id
      1, // configVersion
      image, // image
      "latest", // imageVersion
      [
        "run",
        "--beacon-node-url=http://beaconAddress:beaconPort",
        "--charon-runtime-dir=" + charonDir,
        "--ejector-exit-path=" + exitmessagesDir,
        "--exit-epoch=194048",
        "--log-color=auto",
        "--log-format=console",
        "--log-level=info",
        "--obol-api-url=https://api.obol.tech",
        "--validator-query-chunk-size=50"
      ], // command
      ["/usr/local/bin/lido-dv-exit"], // entrypoint
      null, // env
      ports, // ports
      volumes, // volumes
      null, // user
      network // network
      // executionClients
      // consensusClients
    );
    return service;
  }

  static buildByConfiguration(config) {
    const service = new LidoObolExitService();

    service.initByConfig(config);

    return service;
  }
}
