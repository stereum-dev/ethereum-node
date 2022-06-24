import { NodeService } from './NodeService'
import { ServicePortDefinition } from './SerivcePortDefinition'
import { ServiceVolume } from './ServiceVolume'

export class PrometheusService extends NodeService {
  static getServiceConfiguration (prometheusJobs) {
    const jobs = prometheusJobs.map(service => service.buildPrometheusJob()).join('')
    return { CONFIG: `global:\n  scrape_interval:     15s\n  evaluation_interval: 15s\n\nalerting:\n  alertmanagers:\n  - static_configs:\n    - targets:\n      # - alertmanager:9093\n\nrule_files:\n  # - \"first_rules.yml\"\n  # - \"second_rules.yml\"\n\nscrape_configs:${jobs}` }
  }

  static buildByUserInput (network, ports, dir, prometheusJobs) {
    const service = new PrometheusService()
    service.setId()
    const workingDir = service.buildWorkingDir(dir)
    
    const image = 'prom/prometheus'
    const config = this.getServiceConfiguration(prometheusJobs)

    const dataDir = '/prometheus'
    const configDir = '/etc/prometheus'

    const volumes = [
      new ServiceVolume(workingDir + '/data/prometheus', dataDir),
      new ServiceVolume(workingDir + '/config', configDir)
    ]

    service.init(
      'PrometheusService',
      service.id, // id
      1, // configVersion
      image, // image
      'v2.36.2', // imageVersion
      'sh -c "touch /etc/prometheus/prometheus.yml && echo \\"$CONFIG\\" > /etc/prometheus/prometheus.yml && /bin/prometheus --config.file=/etc/prometheus/prometheus.yml"', // command
      null, // entrypoint
      config, // env
      ports, // ports
      volumes, // volumes
      null, // user
      network, // network
      null, // executionClients
      prometheusJobs, // consensusClients but every single client to monitor is in there should be implemented correctly someday
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
