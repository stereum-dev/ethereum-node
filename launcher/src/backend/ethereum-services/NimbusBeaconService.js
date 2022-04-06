import { NodeService } from "./NodeService.js";
import { ServicePortDefinition } from "./SerivcePortDefinition.js";
import { ServiceVolume } from "./ServiceVolume.js";

export class NimbusBeaconService extends NodeService {
    static buildByUserInput() {
        const service = new NimbusBeaconService();
        service.init(
            //id,
            //image,
            //imageVersion,
            //command,
            //entrypoint,
            //env,
            //ports,
            //volumes,
            //user,
            //network,
            //executionClients,
            //consensusClients
            );

        return service;
    }

    static buildByConfiguration(config) {
        const service = new NimbusBeaconService();

        service.initByConfig(config);

        return service;
    }

    buildConsensusClientHttpEntpointUrl() {
        return "http://stereum-" + this.id + ":9190";
    }

    getAvailablePorts() {
        return [
            new ServicePortDefinition(9000, "tcp", "P2P connections"),
            new ServicePortDefinition(9000, "udp", "P2P connections"),
            new ServicePortDefinition(9190, "tcp", "Consensus Client API")
        ]
    }
}