import { NodeService } from "./NodeService";
import { ServiceVolume } from "./ServiceVolume";

export class CharonService extends NodeService {
  static buildByUserInput(network, ports, dir, consensusClients) {
    const service = new CharonService();
    service.setId();
    const workingDir = service.buildWorkingDir(dir);

    const dataDir = "/opt/charon";
    const volumes = [new ServiceVolume(workingDir, dataDir)];

    const beaconNodes = consensusClients
      .map((client) => {
        return client.buildConsensusClientHttpEndpointUrl();
      })
      .join();

    service.init(
      "CharonService", // service
      service.id, // id
      1, // configVersion
      "obolnetwork/charon", // image
      "v0.19.0", // imageVersion
      [
        "run",
        `--beacon-node-endpoints=${beaconNodes}`,
        "--log-level=info",
        "--log-format=console",
        "--p2p-relays=https://0.relay.obol.tech",
        "--p2p-tcp-address=0.0.0.0:3610",
        "--validator-api-address=0.0.0.0:3600",
        "--monitoring-address=0.0.0.0:3620",
        "--builder-api",
      ], // command
      ["/usr/local/bin/charon"], // entrypoint
      null, // env
      ports, // ports
      volumes, // volumes
      null, // user
      network, // network
      null, // executionClients
      consensusClients // consensusClients
    );

    if (consensusClients.map((s) => s.service).includes("NimbusBeaconService")) {
      service.command.push("--feature-set-enable=json_requests");
    }

    if (consensusClients.map((s) => s.service).includes("TekuBeaconService")) {
      consensusClients
        .filter((s) => s.service === "TekuBeaconService")
        .forEach((s) => {
          s.command.push(`--validators-graffiti-client-append-format=DISABLED`);
        });
    }

    return service;
  }

  static buildByConfiguration(config) {
    const service = new CharonService();

    service.initByConfig(config);

    return service;
  }

  buildConsensusClientHttpEndpointUrl() {
    return "http://stereum-" + this.id + ":3600";
  }

  buildConsensusClientEndpoint() {
    return "stereum-" + this.id + ":3600";
  }

  buildConsensusClientGateway() {
    return "stereum-" + this.id + ":3600";
  }

  getDataDir() {
    return this.volumes.find((volume) => volume.servicePath === "/opt/charon").destinationPath;
  }

  getCreateEnrCommand() {
    return `docker run -u 0 --rm -v "${this.getDataDir()}:/opt/charon" ${this.image + ":" + this.imageVersion} create enr`;
  }

  getReadEnrCommand() {
    return `docker run -u 0 --rm -v "${this.getDataDir()}:/opt/charon" ${this.image + ":" + this.imageVersion} enr`;
  }

  getRemoveEnrCommand() {
    return `rm ${this.getDataDir()}/.charon/charon-enr-private-key`;
  }

  getNukeObolCommand() {
    return `rm -rf ${this.getDataDir()}/.charon`;
  }

  getCreateCharonFolderCommand() {
    return `mkdir -p ${this.getDataDir()}/.charon`;
  }

  getWriteENRPrivateKeyCommand(privateKey) {
    return `echo "${privateKey}" > ${this.getDataDir()}/.charon/charon-enr-private-key`;
  }

  getReadENRPrivateKeyCommand() {
    return `cat ${this.getDataDir()}/.charon/charon-enr-private-key`;
  }

  getListCharonFolderContentsCommand() {
    return `ls -1 -a ${this.getDataDir()}/.charon`;
  }

  //definitionFile as URL or Path to file (default ".charon/cluster-definition.json" by dkg command)
  getDKGCommand(definitionFile) {
    return `docker run -u 0 --name "dkg-container" -d -v "${this.getDataDir()}:/opt/charon" ${this.image + ":" + this.imageVersion} dkg ${
      definitionFile ? "--definition-file=" + definitionFile : ""
    } --publish`;
  }
}
