import { NodeService } from './NodeService.js'
import { ServiceVolume } from './ServiceVolume.js'

export class GethService extends NodeService {
  static buildByUserInput (network, ports, workingDir) {
    const service = new GethService()
    service.setId()
    workingDir = workingDir + '-' + service.id
    
    const volumes = [
      new ServiceVolume(workingDir + '/data', '/root/.ethereum')
    ]

    service.init(
      'GethService',  // service
      service.id, // id
      1,  // configVersion
      'ethereum/client-go', // image
      'v1.10.11', // imageVersion
      'geth --' + network + ' --http --http.port=8545 --http.addr=0.0.0.0 --http.vhosts="*" --allow-insecure-unlock --http.api="debug,eth,net,web3,personal" --ws --ws.port=8546 --ws.addr=0.0.0.0 --ws.api="debug,eth,net,web3" --ws.origins="*"', // command
      null, // entrypoint
      null, // env
      ports,  // ports
      volumes,  // volumes
      'root', // user
      network // network
      // executionClients
      // consensusClients
    )

    return service
  }

  static buildByConfiguration (config) {
    const service = new GethService()

    service.initByConfig(config)

    return service
  }

  buildExecutionClientHttpEndpointUrl () {
    return 'http://stereum-' + this.id + ':8545'
  }

  buildExecutionClientWsEndpointUrl () {
    return 'ws://stereum-' + this.id + ':8546'
  }
}

// EOF
