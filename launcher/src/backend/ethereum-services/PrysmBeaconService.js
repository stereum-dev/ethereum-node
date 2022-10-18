import { NodeService } from './NodeService.js'
import { ServicePortDefinition } from './SerivcePortDefinition.js'
import { ServiceVolume } from './ServiceVolume.js'

export class PrysmBeaconService extends NodeService {
    static buildByUserInput(network, ports, dir, executionClients, checkpointURL) {
        const service = new PrysmBeaconService()
        service.setId()
        const workingDir = service.buildWorkingDir(dir)

        
        const image = 'prysmaticlabs/prysm-beacon-chain'

        const JWTDir = '/engine.jwt'
        const dataDir = '/opt/app/beacon'
        const genesisDir = '/opt/app/genesis'

        //volumes
        const volumes = [
            new ServiceVolume(workingDir + '/beacon', dataDir),
            new ServiceVolume(workingDir + '/genesis', genesisDir),
        ]

        if(executionClients && executionClients.length > 0){
            const elJWTDir = (executionClients[0].volumes.find(vol => vol.servicePath === '/engine.jwt')).destinationPath
            volumes.push(new ServiceVolume(elJWTDir, JWTDir))
        }

        let genesisFile = ' --genesis-state=/opt/app/genesis/prysm-prater-genesis.ssz'
        if(network === "mainnet"){
            genesisFile = ''
        }

        //execution endpoint
        let executionEndpoint = executionClients[0].buildExecutionClientEngineRPCHttpEndpointUrl()

        let checkpointCommand = checkpointURL ? ' --checkpoint-sync-url=' + checkpointURL : ''

        service.init(
            'PrysmBeaconService',  //service
            service.id, //id
            1, // configVersion 
            image,  //image
            'v2.1.4-rc.0', //imageVersion
            '/app/cmd/beacon-chain/beacon-chain --accept-terms-of-use=true --datadir=' + dataDir + ' --p2p-host-ip="" --p2p-host-dns="" --' + network + '=true --block-batch-limit=512' + genesisFile + ' --rpc-host=0.0.0.0 --grpc-gateway-host=0.0.0.0 --p2p-max-peers=100 --execution-endpoint='+ executionEndpoint +' --monitoring-host=0.0.0.0 --monitoring-port=8080 --p2p-tcp-port=13001 --p2p-udp-port=12001 --jwt-secret=' + JWTDir + checkpointCommand,  //command
            null, //entrypoint
            null, //env
            ports,  //ports
            volumes,  //volumes
            null, //user
            network,  //network
            executionClients  //executionClients
        )
        return service

    }

    static buildByConfiguration(config) {
        const service = new PrysmBeaconService()

        service.initByConfig(config)

        return service
    }

    buildConsensusClientEndpoint() {
        return 'stereum-' + this.id + ':4000'
    }

    buildConsensusClientGateway() {
        return 'stereum-' + this.id + ':3500'
    }

    buildConsensusClientHttpEndpointUrl() {
        return 'http://stereum-' + this.id + ':3500'
    }

    buildConsensusClientMetricsEndpoint () {
        return 'stereum-' + this.id + ':8080'
    }

    buildPrometheusJob () {
        return `\n  - job_name: stereum-${this.id}\n    static_configs:\n      - targets: [${this.buildConsensusClientMetricsEndpoint()}]`
    }

    getAvailablePorts() {
        return [
            new ServicePortDefinition(13001, 'tcp', 'P2P connections'),
            new ServicePortDefinition(12001, 'udp', 'P2P connections'),
            new ServicePortDefinition(4000, 'tcp', 'Consensus Client API')
        ]
    }
}
