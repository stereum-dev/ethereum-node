import { NodeService } from './NodeService'
import { ServicePortDefinition } from './SerivcePortDefinition'
import { ServiceVolume } from './ServiceVolume'

export class GrafanaService extends NodeService {
  static buildByUserInput (network, ports, workingDir, grafanaProvisioning) {
    const image = 'grafana/grafana'

    const provisioningDir = '/etc/grafana/provisioning'
    const dataDir = '/var/lib/grafana'
    const grafanaDir = '/etc/grafana'

    const volumes = [
      new ServiceVolume(workingDir + '/provisioning', provisioningDir),
      new ServiceVolume(workingDir + '/data', dataDir),
      new ServiceVolume(workingDir, grafanaDir)
    ]

    const service = new GrafanaService()
    service.init(
      'GrafanaService',
      null, // id
      1, // configVersion
      image, // image
      '8.4.0', // imageVersion
      'bash -c "touch /etc/grafana/grafana.ini && echo \\"$GRAFANA_INI\\" > /etc/grafana/grafana.ini && /run.sh"', // command
      null, // entrypoint
      {
        GRAFANA_INI: '[auth.anonymous]\nenabled = true\norg_role = Admin\n',
        GRAFANA_PROVISIONING: grafanaProvisioning
      }, // env
      ports, // ports
      volumes, // volumes
      null, // user
      network // network
      // executionClients
      // consensusClients
    )
    return service
  }

  static buildByConfiguration (config) {
    const service = new GrafanaService()

    service.initByConfig(config)

    return service
  }

  getAvailablePorts () {
    return [
      new ServicePortDefinition(3000, 'tcp', 'add some description')
    ]
  }
}
