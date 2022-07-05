import { NodeService } from './NodeService'
import { ServicePortDefinition } from './SerivcePortDefinition'
import { ServiceVolume } from './ServiceVolume'

export class GrafanaService extends NodeService {
  static buildByUserInput (network, ports, dir) {
    const service = new GrafanaService()
    service.setId()
    const workingDir = service.buildWorkingDir(dir)
    
    const image = 'grafana/grafana'

    const provisioningDir = '/etc/grafana/provisioning'
    const dataDir = '/var/lib/grafana'
    const grafanaDir = '/etc/grafana'

    const volumes = [
      new ServiceVolume(workingDir + '/provisioning', provisioningDir),
      new ServiceVolume(workingDir + '/data', dataDir),
      new ServiceVolume(workingDir, grafanaDir)
    ]

    service.init(
      'GrafanaService', //service
      service.id, // id
      1, // configVersion
      image, // image
      '8.5.6', // imageVersion
      'bash -c "touch /etc/grafana/grafana.ini && echo \\"$GRAFANA_INI\\" > /etc/grafana/grafana.ini && /run.sh"', // command
      null, // entrypoint
      {
        GRAFANA_INI: 'force_migration = true\n\n[auth.anonymous]\nenabled = true\norg_role = Admin\n',
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
