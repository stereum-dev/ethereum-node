import { NodeService } from './NodeService.js'
import { ServicePortDefinition } from './SerivcePortDefinition.js'
import { ServiceVolume } from './ServiceVolume.js'

export class LighthouseBeaconService extends NodeService {
  static buildByUserInput (network, ports, workingDir, executionClients, slasherDbSize) {
    const image = 'sigp/lighthouse'

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
      'LighthouseBeaconService',  //service
      null, //id
      1, // configVersion
      image,  //image
      'v2.1.2', //imageVersion
      [
        'lighthouse',
        'bn',
        '--debug-level=debug',
        `--network=${network}`,
        `--eth1-endpoints=${eth1Nodes}`,
        '--eth1-blocks-per-log-query=150',
        `--datadir=${dataDir}`,
        '--http',
        '--http-address=0.0.0.0',
        '--metrics',
        '--metrics-address=0.0.0.0',
        '--disable-upnp',
        '--validator-monitor-auto',
        '--slasher',
        `--slasher-dir=${slasherDir}`,
        `--slasher-max-db-size=${slasherDbSize}`
      ],  //command
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
