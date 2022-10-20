import { NodeService } from './NodeService'
import { ServicePortDefinition } from './SerivcePortDefinition'
import { ServiceVolume } from './ServiceVolume'

export class FlashbotsMevBoostService extends NodeService {
  static buildByUserInput (network) {
    const image = 'flashbots/mev-boost'
    const service = new FlashbotsMevBoostService()
    let relay_link = 'https://0xac6e77dfe25ecd6110b8e780608cce0dab71fdd5ebea22a16c0205200f2f8e2e3ad3b71d3499c54ad14d6c21b41a37ae@boost-relay.flashbots.net' // default for mainnet
    if ( network === "goerli" )
      relay_link = 'https://0xafa4c6985aa049fb79dd37010438cfebeb0f2bd42b115b89dd678dab0670c1de38da0c4e9138c9290a398ecd9a0b3110@builder-relay-goerli.flashbots.net'
    service.init(
      'FlashbotsMevBoostService',
      null, // id
      1, // configVersion
      image, // image
      'v0.8.2', // imageVersion
      null, // command
      [
        '/app/mev-boost',
        '-addr',
        '0.0.0.0:18550',
        `-${network}`,
        '-relay-check',
        '-relays',
        `${relay_link}`,
      ], // entrypoint
      null, // env
      null, // ports
      null, // volumes
      null, // user
      network // network
      // executionClients
      // consensusClients
      // FlashbotsMevBoostService
    )
    return service
  }

  static buildByConfiguration (config) {
    const service = new FlashbotsMevBoostService()

    service.initByConfig(config)

    return service
  }

  buildMevboostPort () {
    return 'http://stereum-' + this.id + ':18550'
  }


}