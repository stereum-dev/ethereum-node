import { NodeService } from './NodeService.js'
import { ServicePortDefinition } from './SerivcePortDefinition.js'
import { ServiceVolume } from './ServiceVolume.js'

export class TekuBeaconService extends NodeService {
    static buildByUserInput(network, ports, dir, executionClients, graffiti) {
        const service = new TekuBeaconService()
        service.setId()
        const workingDir = service.buildWorkingDir(dir)

        const image = 'consensys/teku'

        const gethServices = (executionClients.map(client => { return client.buildExecutionClientHttpEndpointUrl() })).join()

        const dataDir = '/opt/app/data'
        const volumes = [
            new ServiceVolume(workingDir + '/data', dataDir)
        ]
    
        service.init(
            'TekuBeaconService',    // service
            service.id,             // id
            1,                      // configVersion
            image,                  // image
            '22.5.0',               // imageVersion
            [
                `--network=${network}`,
                '--p2p-enabled=true',
                '--p2p-port=9001',
                '--validators-keystore-locking-enabled=false',
                `--validators-graffiti="${graffiti}"`,
                `--eth1-endpoints=${gethServices}`,
                '--metrics-enabled=true',
                '--metrics-categories=BEACON,LIBP2P,NETWORK,PROCESS',
                '--metrics-port=8008',
                '--metrics-interface=0.0.0.0',
                '--metrics-host-allowlist=*',
                `--data-path=${dataDir}`,
                '--data-storage-mode=archive',
                '--rest-api-port=5051',
                '--rest-api-host-allowlist="*"',
                '--rest-api-interface=0.0.0.0',
                '--rest-api-docs-enabled=true',
                '--rest-api-enabled=true',
                '--log-destination=CONSOLE',
                '--validator-api-enabled=true',
                '--validator-api-port=5052',
                '--validator-api-host-allowlist=*',
                '--validator-api-cors-origins=*',
                `--validator-api-keystore-file=${dataDir}/teku_api_keystore`,
                `--validator-api-keystore-password-file=${dataDir}/teku_api_password.txt`,
            ],                      // command
            ["/opt/teku/bin/teku"], // entrypoint
            {JAVA_OPTS: '-Xmx4g'},  // env
            ports,                  // ports
            volumes,                // volumes
            null,                   // user
            network,                // network
            executionClients,       // executionClients
            // consensusClients
            // prometheusNodeExporterClients
        )

        return service
    }

    static buildByConfiguration(config) {
        const service = new TekuBeaconService()

        service.initByConfig(config)

        return service
    }

    buildConsensusClientHttpEndpointUrl() {
        return 'http://stereum-' + this.id + ':5051'
    }

    buildConsensusClientMetricsEndpoint () {
        return 'stereum-' + this.id + ':8008'
    }

    getAvailablePorts() {
        return [
            new ServicePortDefinition(9001, 'tcp', 'P2P connections'),
            new ServicePortDefinition(9001, 'udp', 'P2P connections'),
            new ServicePortDefinition(5052, 'tcp', 'Validator API Port'),
            new ServicePortDefinition(5051, 'tcp', 'REST API Port'),
            new ServicePortDefinition(8008, 'tcp', 'METRICS Port')
        ]
    }
}

// EOF
