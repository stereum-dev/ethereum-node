import { NodeService } from './NodeService.js'
import { ServicePortDefinition } from './SerivcePortDefinition.js'
import { ServiceVolume } from './ServiceVolume.js'

export class NimbusBeaconService extends NodeService {
  static buildByUserInput (network, ports, workingDir, executionClients, graffiti) {
    const image = 'statusim/nimbus-eth2'

    const gethServices = (executionClients.map(client => { return client.buildExecutionClientWsEndpointUrl() })).join()

    const dataDir = '/opt/app/beacon'
    const validatorsDir = '/opt/app/validators'
    const secretsDir = '/opt/app/secrets'
    const volumes = [
      new ServiceVolume(workingDir + '/beacon', dataDir),
      new ServiceVolume(workingDir + '/validator/validators', validatorsDir),
      new ServiceVolume(workingDir + '/validator/secrets', secretsDir)
    ]

    const service = new NimbusBeaconService()
    service.init(
      'NimbusBeaconService',  //service
      null, // id,
      1, // configVersion
      image, // image,
      'multiarch-v22.3.0', // imageVersion,
      [
        `--network=${network}`,
        `--data-dir=${dataDir}`,
        `--validators-dir=${validatorsDir}`,
        `--secrets-dir=${secretsDir}`,
        `--web3-url=${gethServices}`,
        '--tcp-port=9000',
        '--udp-port=9000',
        '--rpc',
        '--rpc-port=9190',  //should this be a variable? (more than one service)
        '--rpc-address=0.0.0.0',
        '--metrics',
        '--metrics-port=8008',
        '--metrics-address=0.0.0.0',
        '--rest',
        '--rest-address=0.0.0.0',
        '--rest-port=5052',
        `--graffiti=\"${graffiti}\"`,
        '--keymanager',
        '--keymanager-address=0.0.0.0',
        '--keymanager-token-file=/opt/app/validators/api-token.txt'
      ], // command,
      ["/home/user/nimbus-eth2/build/nimbus_beacon_node"], // entrypoint,
      null, // env,
      ports, // ports,
      volumes, // volumes,
      null, // user,
      network, // network,
      executionClients // executionClients,
    )

    return service
  }

  static buildByConfiguration (config) {
    const service = new NimbusBeaconService()

    service.initByConfig(config)

    return service
  }

  buildConsensusClientHttpEndpointUrl () {
    return 'http://stereum-' + this.id + ':9190'
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
