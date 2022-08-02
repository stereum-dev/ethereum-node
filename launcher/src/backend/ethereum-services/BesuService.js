import { NodeService } from "./NodeService";
import { ServiceVolume } from "./ServiceVolume";

export class BesuService extends NodeService {
    static buildByUserInput(network, ports, dir) {
        const service = new BesuService()
        service.setId()
        const workingDir = service.buildWorkingDir(dir)
        const dataDir = '/opt/app/data'
        const JWTDir = '/engine.jwt'
        const volumes = [
            new ServiceVolume(workingDir + '/data', '/opt/app/data'),
            new ServiceVolume(workingDir + '/engine.jwt', JWTDir)
        ]

        service.init(
            'BesuService',  // service
            service.id,     // id
            1,              // configVersion
            'hyperledger/besu', // image
            '22.7.0-RC2',           // imageVersion
            [
                `--network=${network}`,
                `--data-path=${dataDir}`,
                '--data-storage-format=BONSAI',
                '--sync-mode=X_SNAP',
                '--p2p-port=30303',
                '--p2p-host=0.0.0.0',
                '--rpc-http-enabled=true',
                '--rpc-http-host=0.0.0.0',
                '--rpc-http-cors-origins=*',
                '--rpc-ws-enabled=true',
                '--rpc-ws-host=0.0.0.0',
                '--host-allowlist=*',
                '--metrics-enabled',
                '--metrics-host=0.0.0.0',
                '--metrics-port=9545',
                '--logging=INFO',
                '--engine-rpc-enabled=true',
                '--engine-host-allowlist=*',
                '--engine-rpc-port=8551',
                '--engine-jwt-enabled=true',
                '--engine-jwt-secret=/engine.jwt',
                '--Xmerge-support=true',
            ],          // command
            ["besu"],   // entrypoint
            { JAVA_OPTS: '-Xmx4g' },  // env
            ports,      // ports
            volumes,    // volumes
            null,       // user
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
        return 'http://stereum-' + this.id + ':8551'
    }

    buildExecutionClientWsEndpointUrl() {
        return 'ws://stereum-' + this.id + ':8551'
    }

    buildExecutionClientMetricsEndpoint() {
        return 'stereum-' + this.id + ':9545'
    }

    buildPrometheusJob() {
        return `\n  - job_name: stereum-${this.id}\n    static_configs:\n      - targets: [${this.buildExecutionClientMetricsEndpoint()}]`
    }
}

// EOF
