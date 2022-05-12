import { NodeService } from './NodeService'
import { ServicePortDefinition } from './SerivcePortDefinition'
import { ServiceVolume } from './ServiceVolume'

export class PrometheusService extends NodeService {
  static getServiceConfiguration (consensusClients, prometheusNodeExporterClients) {
    const consensusEndPoints = (consensusClients.map(client => { return "'" + client.buildConsensusClientHttpEndpointUrl().replace('http://', '') + "'" })).join()
    const prometheusNodeExporterEndPoints = (prometheusNodeExporterClients.map(client => { return "'" + client.buildPrometheusNodeExporterClientHttpEndpointUrl().replace('http://', '') + "'" })).join()
    return { CONFIG: `global:\n  scrape_interval:     15s\n  evaluation_interval: 15s\n\nalerting:\n  alertmanagers:\n  - static_configs:\n    - targets:\n      # - alertmanager:9093\n\nrule_files:\n  # - \"first_rules.yml\"\n  # - \"second_rules.yml\"\n\nscrape_configs:\n  - job_name: 'ConsensusClients'\n    static_configs:\n      - targets: [${consensusEndPoints}]\n  - job_name: 'PrometheusNodeExporterService'\n    static_configs:\n      - targets: [${prometheusNodeExporterEndPoints}]\n` }
  }

  static buildByUserInput (network, ports, workingDir, consensusClients, prometheusNodeExporterClients) {
    const image = 'prom/prometheus'
    const config = this.getServiceConfiguration(consensusClients, prometheusNodeExporterClients)

    const dataDir = '/prometheus'
    const configDir = '/etc/prometheus'

    const volumes = [
      new ServiceVolume(workingDir + '/data/prometheus', dataDir),
      new ServiceVolume(workingDir + '/config', configDir)
    ]

    const service = new PrometheusService()
    service.init(
      'PrometheusService',
      null, // id
      1, // configVersion
      image, // image
      'v2.33.1', // imageVersion
      'sh -c "touch /etc/prometheus/prometheus.yml && echo \\"$CONFIG\\" > /etc/prometheus/prometheus.yml && /bin/prometheus --config.file=/etc/prometheus/prometheus.yml"', // command
      null, // entrypoint
      config, // env
      ports, // ports
      volumes, // volumes
      null, // user
      network, // network
      null, // executionClients
      consensusClients, // consensusClients
      prometheusNodeExporterClients // prometheusNodeExporterClients
    )
    return service
  }

  static buildByConfiguration (config) {
    const service = new PrometheusService()

    service.initByConfig(config)

    return service
  }

  getAvailablePorts () {
    return [
      new ServicePortDefinition(9090, 'tcp', 'add some description')
    ]
  }
}
