import { NodeService } from './NodeService.js'
import { ServicePortDefinition } from './SerivcePortDefinition.js'
import { ServiceVolume } from './ServiceVolume.js'


export class LighthouseValidatorService extends NodeService {
  static buildByUserInput (network, ports, workingDir, consensusClients, graffiti) {

    const image = 'sigp/lighthouse'

    const dataDir = '/opt/app/validator'

    const volumes = [
      new ServiceVolume(workingDir + '/validator', dataDir)
    ]

    const eth2Nodes = (consensusClients.map(client => { return client.buildConsensusClientHttpEndpointUrl() })).join()

    // build service
    const service = new LighthouseValidatorService()
    service.init(
      'LighthouseValidatorService', //service
      null, //id
      1, //configVersion
      image,  //image
      'v2.1.2', //imageVersion
      [
        'lighthouse',
        'vc',
        '--debug-level=debug',
        `--network=${network}`,
        `--beacon-nodes=${eth2Nodes}`,
        `--datadir=${dataDir}`,
        '--init-slashing-protection',
        `--graffiti=\"${graffiti}\"`,
        '--metrics',
        '--metrics-address=0.0.0.0',
        '--http',
        '--http-address=0.0.0.0',
        '--unencrypted-http-transport'
      ],  //command
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

  static buildByConfiguration (config) {
    const service = new LighthouseValidatorService()

    service.initByConfig(config)

    return service
  }

  getAvailablePorts () {
    return [
      new ServicePortDefinition(5062, 'tcp', 'Validator Client API')
    ]
  }
}

// EOF
