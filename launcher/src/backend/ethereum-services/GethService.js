import { NodeService } from './NodeService.js'
import { ServiceVolume } from './ServiceVolume.js';

export class GethService extends NodeService {
    constructor(network, ports, workingDir) {
        super();

        const volumes = [
            new ServiceVolume(workingDir + "/data", "/root/.ethereum")
        ];

        super.init(null,
            "ethereum/client-go",
            "v1.10.11",
            "geth --" + network + " --http --http.port=8545 --http.addr=0.0.0.0 --http.vhosts='*' --allow-insecure-unlock --http.api='db,eth,net,web3,personal' --ws --ws.port=8546 --ws.addr=0.0.0.0 --ws.api='db,eth,net,web3' --ws.origins='*'",
            null,
            null,
            ports,
            volumes,
            "root");
    }

    buildExecutionClientHttpEndpointUrl() {
        return "http://stereum-" + this.id + ":8545";
    }

    buildExecutionClientWsEndpointUrl() {
        return "ws://stereum-" + this.id + ":8546";
    }
}

// EOF
