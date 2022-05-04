import { NodeService } from './NodeService.js'
import { ServicePortDefinition } from './SerivcePortDefinition.js'
import { ServiceVolume } from './ServiceVolume.js'

export class LighthouseBeaconService extends NodeService {
  static buildByUserInput (network, ports, workingDir, executionClients, slasherDbSize) {
    const image = 'stereum/lighthouse'

    const dataDir = '/opt/app/beacon'
    const slasherDir = '/opt/app/slasher'

    // volumes
    const volumes = [
      new ServiceVolume(workingDir + '/beacon', dataDir),
      new ServiceVolume(workingDir + '/slasher', slasherDir)
    ]

    // eth1 nodes
    const eth1Nodes = (executionClients.map(client => { return client.buildExecutionClientHttpEndpointUrl() })).join()

    const service = new LighthouseBeaconService()
    service.init(
      'LighthouseBeaconService',
      null,
      image,
      'v2.0.1-47',
      null,
      ['/opt/app/start/beacon.sh'],
      {
        DATADIR: dataDir,
        DEBUG_LEVEL: 'info',
        ETH1_NODES: eth1Nodes,
        NETWORK: network,
        SLASHERDIR: slasherDir,
        SLASHER_DB_SIZE: slasherDbSize
      },
      ports,
      volumes,
      null,
      network)

    return service
  }

  static buildByConfiguration (config) {
    const service = new LighthouseBeaconService()

    service.initByConfig(config)

    return service
  }

  buildConsensusClientHttpEndpointUrl () {
    return 'http://stereum-' + this.id + ':5052'
  }

  getAvailablePorts () {
    return [
      new ServicePortDefinition(9000, 'tcp', 'P2P connections'),
      new ServicePortDefinition(9000, 'udp', 'P2P connections'),
      new ServicePortDefinition(5052, 'tcp', 'Consensus Client API')
    ]
  }
}

// EOF
