import { NodeService } from "./NodeService";
import { ServiceVolume } from "./ServiceVolume";

export class CharonService extends NodeService {
    static buildByUserInput(network, ports, dir, consensusClients) {
        const service = new CharonService();
        service.setId();
        const workingDir = service.buildWorkingDir(dir);

        const dataDir = "/opt/charon";
        const volumes = [
            new ServiceVolume(workingDir, dataDir),
        ];

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
            "v0.15.0", // imageVersion
            [
                "run",
                `--beacon-node-endpoints=${beaconNodes}`,
                "--log-level=info",
                "--log-format=console",
                "--p2p-relays=https://0.relay.obol.tech",
                "--p2p-tcp-address=0.0.0.0:3610",
                "--validator-api-address=0.0.0.0:3600",
                "--monitoring-address=0.0.0.0:3620",
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

    getCharonCreateEnrCommand() {
        const dataDir = this.volumes.find((volume) => volume.servicePath === "/opt/charon").destinationPath
        return `docker run -u 0 --rm -v "${dataDir}:/opt/charon" ${this.image + ":" + this.imageVersion} create enr`;
    }
}
