import { NodeService } from './NodeService'
import { ServicePortDefinition } from './SerivcePortDefinition'
import { ServiceVolume } from './ServiceVolume'

export class PrometheusNodeExporterService extends NodeService {
  static buildByUserInput () {
    const image = 'prom/node-exporter'
    const service = new PrometheusNodeExporterService()
    service.init(
      'PrometheusNodeExporterService',
      null, // id
      1, // configVersion
      image, // image
      'v1.3.1', // imageVersion
      null, // command
      ['/bin/node_exporter'], // entrypoint
      null, // env
      null, // ports
      null, // volumes
      null, // user
      null // network
      // executionClients
      // consensusClients
      // prometheusNodeExporterClients
    )
    return service
  }

  static buildByConfiguration (config) {
    const service = new PrometheusNodeExporterService()

    service.initByConfig(config)

    return service
  }

  buildPrometheusNodeExporterClientHttpEndpointUrl () {
    return 'http://stereum-' + this.id + ':9100'
  }
}
