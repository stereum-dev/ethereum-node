import { NodeService } from "./NodeService";
import { ServiceVolume } from "./ServiceVolume";

export class NethermindService extends NodeService {
    static buildByUserInput (network, ports, dir){
        const service = new NethermindService()
        service.setId()
        const workingDir = service.buildWorkingDir(dir)
        const dataDir = '/opt/app/data'

        const volumes = [
            new ServiceVolume(workingDir + '/data',dataDir)
        ]

        service.init(
            'NethermindService',    // service
            service.id,             // id
            1,                      // configVersion
            'nethermind/nethermind',// image
            '1.13.4',               // imageVersion
            [
                `--config=${network}`,
                '--log=debug',
                `--datadir=${dataDir}`,
                '--Network.DiscoveryPort=30303',
                '--Network.P2PPort=30303',
                '--JsonRpc.Enabled=true',
                '--JsonRpc.Host=0.0.0.0',
                '--JsonRpc.Port=8545',
                '--Init.WebSocketsEnabled=true',
                '--JsonRpc.WebSocketsPort=8546',
                '--JsonRpc.EnabledModules=[web3,eth,subscribe,net]',
                '--Metrics.Enabled=true',
                '--Metrics.ExposePort=6060'
            ],                      // command
            ["./Nethermind.Runner"],// entrypoint
            null,                   // env
            ports,                  // ports
            volumes,                // volumes
            'root',                   // user
            network,                // network
            // executionClients
            // consensusClients
        )
    return service
    }


  static buildByConfiguration (config) {
    const service = new NethermindService()

    service.initByConfig(config)

    return service
  }

  buildExecutionClientHttpEndpointUrl () {
    return 'http://stereum-' + this.id + ':8545'
  }

  buildExecutionClientWsEndpointUrl () {
    return 'ws://stereum-' + this.id + ':8546'
  }

  buildExecutionClientMetricsEndpoint () {
    return 'stereum-' + this.id + ':6060'
  }

  buildPrometheusJob () {
    return `\n  - job_name: stereum-${this.id}\n    static_configs:\n      - targets: [${this.buildExecutionClientMetricsEndpoint()}]`
  }
}