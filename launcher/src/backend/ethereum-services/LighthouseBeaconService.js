import { NodeService } from './NodeService.js'
import { ServicePortDefinition } from './SerivcePortDefinition.js'
import { ServiceVolume } from './ServiceVolume.js'

export class LighthouseBeaconService extends NodeService {
  static buildByUserInput (network, ports, dir, executionClients, slasherDbSize, mevboostURL, checkpointURL) {
    const service = new LighthouseBeaconService()
    service.setId()
    const workingDir = service.buildWorkingDir(dir)
    const elJWTDir = (executionClients[0].volumes.find(vol => vol.servicePath === '/engine.jwt')).destinationPath

    const image = 'sigp/lighthouse'

    const JWTDir = '/engine.jwt'
    const dataDir = '/opt/app/beacon'
    const slasherDir = '/opt/app/slasher'

    // volumes
    const volumes = [
      new ServiceVolume(workingDir + '/beacon', dataDir),
      new ServiceVolume(workingDir + '/slasher', slasherDir),
      new ServiceVolume(elJWTDir, JWTDir)
    ]

    // eth1 nodes
    const eth1Nodes = (executionClients.map(client => { return client.buildExecutionClientEngineRPCHttpEndpointUrl() })).join()

    // mevboost endpoint
    const mevboostEndpoint = (mevboostURL.map(mevboost => { return mevboost.buildMevboostEndpointURL() })).join()

    service.init(
      'LighthouseBeaconService',  //service
      service.id, //id
      1, // configVersion
      image,  //image
      'v3.1.2', //imageVersion
      [
        'lighthouse',
        'bn',
        '--debug-level=info',
        `--network=${network}`,
        `--execution-endpoint=${eth1Nodes}`,
        `--execution-jwt=${JWTDir}`,
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
        `--slasher-max-db-size=${slasherDbSize}`,
        `--builder=${mevboostEndpoint}`
      ],  //command
      null, //entrypoint
      null, //env
      ports,  //ports
      volumes,  //volumes
      null, //user
      network,  //network
      executionClients  //executionClients
      )

    if(checkpointURL)
      service.command.push('--checkpoint-sync-url=' + checkpointURL)

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

  buildConsensusClientMetricsEndpoint () {
    return 'stereum-' + this.id + ':5054'
  }

  buildPrometheusJob () {
    return `\n  - job_name: stereum-${this.id}\n    static_configs:\n      - targets: [${this.buildConsensusClientMetricsEndpoint()}]`
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
