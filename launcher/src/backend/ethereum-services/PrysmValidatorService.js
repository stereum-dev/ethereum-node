import { NodeService } from './NodeService.js'
import { ServicePortDefinition } from './SerivcePortDefinition.js'
import { ServiceVolume } from './ServiceVolume.js'

export class PrysmValidatorService extends NodeService {
    static buildByUserInput(network, ports, workingDir, consensusClients, graffiti) {
        const service = new PrysmValidatorService()
        service.setId()
        workingDir = workingDir + '-' + service.id
        const image = 'prysmaticlabs/prysm-validator'

        network = 'prater'

        const dataDir = '/opt/app/data/db'
        const walletDir = '/opt/app/data/wallets'
        const passwordDir = '/opt/app/data/passwords'

        const volumes = [
            new ServiceVolume(workingDir + '/data/db', dataDir),
            new ServiceVolume(workingDir + '/data/wallets', walletDir),
            new ServiceVolume(workingDir + '/data/passwords', passwordDir)
        ]

        const provider = (consensusClients.map(client => { return client.buildConsensusClientEndpoint() })).shift()
        const providerGateway = (consensusClients.map(client => { return client.buildConsensusClientGateway() })).shift()

        service.init(
            'PrysmValidatorService', //service
            service.id, //id
            1, // configVersion 
            image,  //image
            'HEAD-c8a7f6-debug', //imageVersion
            '/app/cmd/validator/validator --accept-terms-of-use=true --beacon-rpc-provider="' + provider + '" --beacon-rpc-gateway-provider="' + providerGateway + '" --web=true --' + network + '=true --datadir=' + dataDir + ' --wallet-dir=' + walletDir + ' --wallet-password-file=' + passwordDir + '/wallet-password --monitoring-host=0.0.0.0 --grpc-gateway-port=7500 --grpc-gateway-host=0.0.0.0 --grpc-gateway-corsdomain="*"',  //command
            null, // entrypoint
            null, // env
            ports, //ports
            volumes,  //volumes
            null, //user
            network, //network
            null, //executionClients
            consensusClients //consensusClients
        )

        return service
    }

    static buildByConfiguration(config) {
        const service = new PrysmValidatorService()

        service.initByConfig(config)

        return service
    }

    getAvailablePorts() {
        return [
            new ServicePortDefinition(7500, 'tcp', 'Validator Client API and Web Interface')
        ]
    }
}