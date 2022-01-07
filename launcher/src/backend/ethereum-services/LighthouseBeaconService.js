import { NodeService } from './NodeService.js'
import { ServicePortDefinition } from './SerivcePortDefinition.js';
import { ServiceVolume } from './ServiceVolume.js';

export class LighthouseBeaconService extends NodeService {
    constructor(network, ports, workingDir, executionClients) {
        super();

        // volumes
        this.workingDir = workingDir;

        const volumes = [
            new ServiceVolume(workingDir + "/beacon", "/opt/app/beacon"),
            new ServiceVolume(workingDir + "/slasher", "/opt/app/slasher")
        ];

        // eth1 nodes
        this.executionClients = executionClients;

        const eth1Nodes = executionClients.map(client => {return client.buildExecutionClientHttpEndpointUrl()});

        // build service
        super.init(null,
            "stereum/lighthouse",
            "v2.0.1-47",
            null,
            ["/opt/app/start/beacon.sh"],
            {
                DATADIR: "/opt/app/beacon",
                DEBUG_LEVEL: "info",
                ETH1_NODES: eth1Nodes,
                NETWORK: network,
                SLASHERDIR: "/opt/app/slasher",
                SLASHER_DB_SIZE: "16",
            },
            ports,
            volumes,
            null,
            network);
    }

    buildConsensusClientHttpEntpointUrl() {
        return "http://stereum-" + this.id + ":5052";
    }

    getAvailablePorts() {
        return [
            new ServicePortDefinition(9000, "tcp", "P2P connections"),
            new ServicePortDefinition(9000, "udp", "P2P connections"),
            new ServicePortDefinition(5052, "tcp", "Consensus Client API"),
        ];
    }
}

// EOF
