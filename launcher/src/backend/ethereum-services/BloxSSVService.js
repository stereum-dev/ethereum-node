import { networks, NodeService } from './NodeService.js'
import { StringUtils } from '../StringUtils.js'
import { ServicePortDefinition } from './SerivcePortDefinition.js'
import { ServiceVolume } from './ServiceVolume.js'

export class BloxSSVService extends NodeService {
  getServiceConfiguration (network, executionClients, consensusClients) {
    /*
eth2:
  Network: "prater"
  BeaconNodeAddr: "http://beacon:5052"
eth1:
  ETH1Addr: ""
  RegistryContractAddr: "0x687fb596F3892904F879118e2113e1EEe8746C2E"
OperatorPrivateKey: ""
global:
  LogLevel: "debug"
MetricsAPIPort: 15000
        */
    return {
      eth2: {
        Network: network,
        BeaconNodeAddr: consensusClients.map(client => client.buildConsensusClientHttpEndpointUrl())[0]
      },
      eth1: {
        ETH1Addr: executionClients.map(client => client.buildExecutionClientHttpEndpointUrl())[0],
        RegistryContractAddr: ''
      },
      OperatorPrivateKey: '', // somehow generate them?
      global: {
        LogLevel: 'info'
      },
      MetricsAPIPort: 15000
    }
  }

  static buildByUserInput (network, ports, dir, executionClients, consensusClients) {
    const service = new BloxSSVService()
    service.setId()
    const workingDir = service.buildWorkingDir(dir)

    const image = 'bloxstaking/ssv-node'


    const volumes = [
      new ServiceVolume(workingDir + '/data/blox/ssv', '/data')
    ]

    // build service
    service.init(
      'BloxSSVService', // service
      service.id, // id
      1,  // configVersion
      image, //image
      'v0.2.0',  //imageVersion
      'make BUILD_PATH=/go/bin/ssvnode start-node && docker logs ssv_node', // command
      null, // entrypoint
      {
        CONFIG_PATH: '/data/config.yaml',
      },  // env
      ports,  // ports
      volumes,  // volumes
      null, // user
      network,  // network
      executionClients, // executionClients
      consensusClients  // consensusClients
      )

    return service
  }

  static buildByConfiguration (config) {
    const service = new BloxSSVService()

    service.initByConfig(config)

    return service
  }

  buildValidatorClientMetricsEndpoint () {
    return 'stereum-' + this.id + ':15000'
  }

  buildPrometheusJob () {
    return `\n  - job_name: ssv\n    metrics_path: /metrics\n    static_configs:\n      - targets: [${this.buildValidatorClientMetricsEndpoint()}]\n  - job_name: ssv_health\n    metrics_path: /health\n    static_configs:\n      - targets: [${this.buildValidatorClientMetricsEndpoint()}]`
  }

  getAvailablePorts () {
    return [
      new ServicePortDefinition(13000, 'tcp', 'P2P connections'),
      new ServicePortDefinition(12000, 'udp', 'P2P connections'),
      new ServicePortDefinition(15000, 'udp', 'Metrics port'),
    ]
  }
}

// EOF
