import { NodeService } from './NodeService.js'
import { ServicePortDefinition } from './SerivcePortDefinition.js'
import { ServiceVolume } from './ServiceVolume.js'

export class NimbusBeaconService extends NodeService {
  static buildByUserInput (network, ports, dir, executionClients, mevboost, checkpointURL) {
    const service = new NimbusBeaconService()
    service.setId()
    const workingDir = service.buildWorkingDir(dir)

    const image = 'statusim/nimbus-eth2'

    const executionLayer = (executionClients.map(client => { return client.buildExecutionClientEngineRPCWsEndpointUrl() })).join()

    // mevboost endpoint
    const mevboostEndpoint = (mevboost.map(mevboost => { return mevboost.buildMevboostEndpointURL() })).join()

    const JWTDir = '/engine.jwt'
    const dataDir = '/opt/app/beacon'
    const validatorsDir = '/opt/app/validators'
    const secretsDir = '/opt/app/secrets'
    const volumes = [
      new ServiceVolume(workingDir + '/beacon', dataDir),
      new ServiceVolume(workingDir + '/validator/validators', validatorsDir),
      new ServiceVolume(workingDir + '/validator/secrets', secretsDir),
    ]

    if(executionClients && executionClients.length > 0){
      const elJWTDir = (executionClients[0].volumes.find(vol => vol.servicePath === '/engine.jwt')).destinationPath
      volumes.push(new ServiceVolume(elJWTDir, JWTDir))
    }

    service.init(
      'NimbusBeaconService',  //service
      service.id, // id,
      1, // configVersion
      image, // image,
      'multiarch-v22.10.0', // imageVersion,
      [
        `--network=${network}`,
        `--data-dir=${dataDir}`,
        `--validators-dir=${validatorsDir}`,
        `--secrets-dir=${secretsDir}`,
        `--web3-url=${executionLayer}`,
        '--suggested-fee-recipient=0x0000000000000000000000000000000000000000',
        '--tcp-port=9000',
        '--udp-port=9000',
        '--metrics',
        '--metrics-port=8008',
        '--metrics-address=0.0.0.0',
        '--rest',
        '--rest-address=0.0.0.0',
        '--rest-port=5052',
        `--graffiti=\"stereum.net\"`,
        '--keymanager',
        '--keymanager-address=0.0.0.0',
        '--keymanager-token-file=/opt/app/validators/api-token.txt',
        '--jwt-secret=/engine.jwt',
      ], // command,
      ["/home/user/nimbus-eth2/build/nimbus_beacon_node"], // entrypoint,
      null, // env,
      ports, // ports,
      volumes, // volumes,
      null, // user,
      network, // network,
      executionClients,  //executionClients
      null, //consensusClients
      null,  //prometheusNodeExporterClients
      mevboost  //mevboost
    )
    if(checkpointURL)
      service.command.push('--trusted-node-url=' + checkpointURL)
    if(mevboostEndpoint)
      service.command.push('--payload-builder=true',`--payload-builder-url=${mevboostEndpoint}`)
    return service
  }

  static buildByConfiguration (config) {
    const service = new NimbusBeaconService()

    service.initByConfig(config)

    return service
  }

  buildConsensusClientHttpEndpointUrl () {
    return 'http://stereum-' + this.id + ':5052'
  }

  buildConsensusClientEndpoint () {
    return 'stereum-' + this.id + ':5052'
  }

  buildConsensusClientGateway () {
    return 'stereum-' + this.id + ':5052'
  }
  
  buildConsensusClientMetricsEndpoint () {
    return 'stereum-' + this.id + ':8008'
  }

  buildPrometheusJob () {
    return `\n  - job_name: "nimbus"\n    metrics_path: /metrics\n    static_configs:\n      - targets: [${this.buildConsensusClientMetricsEndpoint()}]`
  }

  getAvailablePorts () {
    return [
      new ServicePortDefinition(9000, 'tcp', 'P2P connections'),
      new ServicePortDefinition(9000, 'udp', 'P2P connections'),
      new ServicePortDefinition(9190, 'tcp', 'RPC Port'),
      new ServicePortDefinition(5052, 'tcp', 'REST Port')
    ]
  }
}
