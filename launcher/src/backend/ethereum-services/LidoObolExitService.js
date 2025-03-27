import { NodeService } from "./NodeService";
import { ServiceVolume } from "./ServiceVolume";

export class LidoObolExitService extends NodeService {
  static buildByUserInput(network, ports, dir, consensusClients = [], otherServices = []) {
    let ejector = otherServices.find((service) => service.service === "ValidatorEjectorService");
    let charon = consensusClients.find((service) => service.service === "CharonService");
    if (charon) otherServices.push(charon);
    consensusClients = consensusClients.filter((service) => !(service.service === "CharonService"));

    const service = new LidoObolExitService();
    service.setId();
    const workingDir = service.buildWorkingDir(dir);

    const image = "obolnetwork/lido-dv-exit";

    const exitmessagesDir = "/exitmessages";
    const charonDir = "/charon";

    const charonFoler = charon ? `${charon.getDataDir()}/.charon` : workingDir + "/charon";

    let messageVolume = ejector ? ejector.volumes.find((volume) => volume.servicePath === "/app/messages") : "";
    const messageDir = messageVolume ? messageVolume.destinationPath : workingDir + "/exitmessages";

    const volumes = [new ServiceVolume(messageDir, exitmessagesDir), new ServiceVolume(charonFoler, charonDir)];

    service.init(
      "LidoObolExitService", //service
      service.id, // id
      1, // configVersion
      image, // image
      "latest", // imageVersion
      [
        "run",
        `--beacon-node-url=${consensusClients[0] ? consensusClients[0].buildConsensusClientHttpEndpointUrl() : ""}`,
        "--charon-runtime-dir=" + charonDir,
        "--ejector-exit-path=" + exitmessagesDir,
        `--exit-epoch=${network === "mainnet" ? "194048" : "256"}`,
        "--log-color=auto",
        "--log-format=console",
        "--log-level=info",
        "--obol-api-url=https://api.obol.tech",
        "--validator-query-chunk-size=50",
      ], // command
      ["/usr/local/bin/lido-dv-exit"], // entrypoint
      null, // env
      ports, // ports
      volumes, // volumes
      "root", // user
      network, // network
      [], // executionClients
      consensusClients[0] ? [consensusClients[0]] : [], // consensusClients
      [], // MevBoost
      otherServices // otherServices
    );
    return service;
  }

  static buildByConfiguration(config) {
    const service = new LidoObolExitService();

    service.initByConfig(config);

    return service;
  }
}
