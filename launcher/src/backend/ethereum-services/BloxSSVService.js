import { networks, NodeService } from './NodeService.js'
import { StringUtils } from '../StringUtils.js'
import { ServicePortDefinition } from './SerivcePortDefinition.js'
import { ServiceVolume } from './ServiceVolume.js'

const YAML = require('yaml')

export class BloxSSVService extends NodeService {
  static getServiceConfiguration (network, executionClients, consensusClients) {
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
        RegistryContractAddr: '0x687fb596F3892904F879118e2113e1EEe8746C2E'
      },
      OperatorPrivateKey: '', // somehow generate them?
      global: {
        LogLevel: 'info'
      },
      MetricsAPIPort: 15000
    }
  }

  static buildByUserInput (network, ports, workingDir, executionClients, consensusClients) {
    const volumes = [
      new ServiceVolume(workingDir + '/data', '/data')
    ]

    // prepare service's config file
    const configFile = new YAML.Document()
    configFile.contents = BloxSSVService.getServiceConfiguration(network, executionClients, consensusClients)
    const escapedConfigFile = StringUtils.escapeStringForShell(configFile.toString())

    // build service
    const service = new BloxSSVService()
    service.init(
      'BloxSSVService',
      null,
      1,
      'bloxstaking/ssv-node',
      'ubuntu-latest',
      null,
      'echo "$SSV_CONFIG_CONTENT" > /data/config.yaml && make BUILD_PATH=/go/bin/ssvnode start-node && docker logs ssv_node',
      {
        CONFIG_PATH: '/data/config.yaml',
        SSV_CONFIG_CONTENT: escapedConfigFile
      },
      ports,
      volumes,
      'root',
      network,
      executionClients,
      consensusClients)

    return service
  }

  static buildByConfiguration (config) {
    const service = new BloxSSVService()

    service.initByConfig(config)

    return service
  }

  getAvailablePorts () {
    return [
      new ServicePortDefinition(13000, 'tcp', 'P2P connections'),
      new ServicePortDefinition(12000, 'udp', 'P2P connections')
    ]
  }
}

// EOF
