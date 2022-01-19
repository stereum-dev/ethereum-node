import { NodeService } from './NodeService.js'
import { ServiceVolume } from './ServiceVolume.js';

const image = "stereum/lighthouse";

export class LighthouseValidatorService extends NodeService {
    static buildByUserInput(network, workingDir, consensusClients, graffiti) {
        const dataDir = "/opt/app/validator";
        const launchpadDir = "/opt/app/launchpad";

        const volumes = [
            new ServiceVolume(workingDir + "/wallets", dataDir),
            new ServiceVolume(workingDir + "/launchpad", launchpadDir)
        ];

        const eth2Nodes = consensusClients.map(client => {return client.buildConsensusClientHttpEntpointUrl()});

        // build service
        const service = new LighthouseValidatorService();
        service.init(null,
            image,
            "v2.0.1-47",
            null,
            ["/opt/app/start/validator.sh"],
            {
                DATADIR: dataDir,
                DEBUG_LEVEL: "info",
                BEACON_NODES: eth2Nodes,
                NETWORK: network,
                GRAFFITI: graffiti,
                LAUNCHPADDIR: launchpadDir,
            },
            null,
            volumes,
            null,
            network);

        return service;
    }

    static buildByConfiguration(config) {
        const service = new LighthouseValidatorService();

        service.initByConfig(config);

        return service;
    }

    getAvailablePorts() {
        return [];
    }
}

// EOF
