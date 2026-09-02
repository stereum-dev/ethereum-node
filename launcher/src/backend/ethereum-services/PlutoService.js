import { CharonService } from "./CharonService";
import { ServiceVolume } from "./ServiceVolume";

/**
 * Nethermind's Pluto, a Rust reimplementation of Charon. Implements charon's
 * "run" interface, so it inherits every CharonService helper (ENR, DKG, cluster
 * lock) and differs only in image and entrypoint.
 *
 * Behind Docker it stays relay-only until given "--p2p-external-ip": it never
 * advertises the address its autonat confirmed. That address cannot be derived
 * from the configuration, so it is an expert option rather than a default.
 */
export class PlutoService extends CharonService {
  static buildByUserInput(network, ports, dir, consensusClients = []) {
    const service = new PlutoService();
    service.setId();
    const workingDir = service.buildWorkingDir(dir);

    // pluto's defaults are relative to its "/opt/charon" workdir, so the mount
    // point has to match charon's
    const dataDir = "/opt/charon";
    const volumes = [new ServiceVolume(workingDir, dataDir)];

    const beaconNodes = consensusClients
      .map((client) => {
        return client.buildConsensusClientHttpEndpointUrl();
      })
      .join();

    service.init(
      "PlutoService", // service
      service.id, // id
      1, // configVersion
      "nethermindeth/pluto", // image
      "v0.1.4", // imageVersion
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
      ["/app/bin/pluto"], // entrypoint
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
    const service = new PlutoService();

    service.initByConfig(config);

    return service;
  }
}
