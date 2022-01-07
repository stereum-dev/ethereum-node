import { NodeService } from './NodeService.js'
import { ServiceVolume } from './ServiceVolume.js';

export class LighthouseValidatorService extends NodeService {
    constructor(network, workingDir, consensusClients, graffiti) {
        super();

        const dataDir = "/opt/app/validator";
        const launchpadDir = "/opt/app/launchpad";

        // volumes
        this.workingDir = workingDir;

        const volumes = [
            new ServiceVolume(workingDir + "/wallets", dataDir),
            new ServiceVolume(workingDir + "/launchpad", launchpadDir)
        ];

        // eth1 nodes
        this.consensusClients = consensusClients;

        const eth2Nodes = consensusClients.map(client => {return client.buildConsensusClientHttpEntpointUrl()});

        // build service
        super.init(null,
            "stereum/lighthouse",
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
    }

    getAvailablePorts() {
        return [];
    }
}

// EOF
