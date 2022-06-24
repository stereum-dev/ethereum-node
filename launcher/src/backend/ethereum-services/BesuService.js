import { NodeService } from "./NodeService";
import { ServiceVolume } from "./ServiceVolume";

export class BesuService extends NodeService {
    static buildByUserInput(network, ports, dir) {
        const service = new BesuService()
        service.setId()
        const workingDir = service.buildWorkingDir(dir)
        const dataDir = '/opt/app/data'
        const volumes = [
            new ServiceVolume(workingDir + '/data', '/opt/app/data')
        ]

        service.init(
            'BesuService',  // service
            service.id,     // id
            1,              // configVersion
            'hyperledger/besu', // image
            '22.4.3',           // imageVersion
            [
                `--network=${network}`,
                `--data-path=${dataDir}`,
                '--data-storage-format=BONSAI',
                '--sync-mode=X_SNAP',
                '--p2p-port=30303',
                '--p2p-host=0.0.0.0',
                '--rpc-http-enabled',
                '--rpc-http-api=WEB3,ETH,NET',
                '--rpc-http-host=0.0.0.0',
                '--rpc-http-cors-origins=*',
                '--rpc-http-port=8545',
                '--rpc-ws-enabled',
                '--rpc-ws-api=WEB3,ETH,NET',
                '--rpc-ws-port=8546',
                '--host-allowlist=*',
                '--metrics-enabled',
                '--metrics-host=0.0.0.0',
                '--metrics-port=9545',
                '--logging=DEBUG',
            ],          // command
            ["besu"],   // entrypoint
            { JAVA_OPTS: '-Xmx4g' },  // env
            ports,      // ports
            volumes,    // volumes
            'root',       // user
            network,    // network
            // executionClients
            // consensusClients
        )
        return service
    }

    static buildByConfiguration(config) {
        const service = new BesuService()

        service.initByConfig(config)

        return service
    }


    buildExecutionClientHttpEndpointUrl() {
        return 'http://stereum-' + this.id + ':8545'
    }

    buildExecutionClientWsEndpointUrl() {
        return 'ws://stereum-' + this.id + ':8546'
    }

    buildExecutionClientMetricsEndpoint() {
        return 'stereum-' + this.id + ':9545'
    }

    buildPrometheusJob() {
        return `\n  - job_name: stereum-${this.id}\n    static_configs:\n      - targets: [${this.buildExecutionClientMetricsEndpoint()}]`
    }
}

// EOF
