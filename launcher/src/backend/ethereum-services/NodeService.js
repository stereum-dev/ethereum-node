import { ServicePort } from './ServicePort.js'
import { ServiceVolume } from './ServiceVolume.js'
import { StringUtils } from '../StringUtils.js'

export const networks = {
  goerli: 'goerli',
  prater: 'prater',
  mainnet: 'mainnet'
}

export class NodeService {
  static buildEmpty () {
    return new NodeService()
  }

  static parseImageString (imageString) {
    if (imageString && imageString.includes(':')) {
      const imageInformation = imageString.split(':')

      return {
        image: imageInformation[0],
        version: imageInformation[1]
      }
    } else {
      return {
        image: imageString,
        version: 'latest'
      }
    }
  }

  init (service, id, configVersion, image, imageVersion, command, entrypoint, env, ports, volumes, user, network, executionClients, consensusClients, prometheusNodeExporterClients) {
    this.service = service
    this.setId(id)
    this.configVersion = configVersion
    this.image = image
    this.imageVersion = imageVersion
    this.command = (command === undefined || command === null) ? [] : command
    this.entrypoint = (entrypoint === undefined || entrypoint === null) ? [] : entrypoint
    this.env = (env === undefined || env === null) ? { STEREUM_DUMMY: 'foobar' } : env
    this.ports = (ports === undefined || ports === null) ? [] : ports
    this.volumes = (volumes === undefined || volumes === null) ? [] : volumes
    this.user = (user === undefined || user === null) ? '2000' : user
    this.network = (network === undefined || network === null) ? networks.prater : network

    this.dependencies = {
      executionClients: executionClients,
      consensusClients: consensusClients,
      prometheusNodeExporterClients: prometheusNodeExporterClients
    }
  }

  initByConfig (config) {
    const imageInformation = NodeService.parseImageString(config.image)

    this.setId(config.id)
    this.service = config.service
    this.configVersion = config.configVersion
    this.image = imageInformation.image
    this.imageVersion = imageInformation.version
    this.command = config.command
    this.entrypoint = config.entrypoint
    this.env = config.env
    this.ports = (config.ports || []).map(portString => ServicePort.buildByConfig(portString))
    this.volumes = (config.volumes || []).map(volumeString => ServiceVolume.buildByConfig(volumeString))
    this.user = config.user
    this.network = config.network

    this.dependencies = {
      executionClients: config.dependencies ? config.dependencies.executionClients : [],
      consensusClients: config.dependencies ? config.dependencies.consensusClients : [],
      prometheusNodeExporterClients: config.dependencies ? config.dependencies.prometheusNodeExporterClients : []
    }
  }

  setId (id) {
    this.id = id || StringUtils.createRandomString()
  }

  buildConfiguration () {
    return {
      service: this.service,
      id: this.id,
      configVersion: this.configVersion,
      command: this.command,
      entrypoint: this.entrypoint,
      env: this.env,
      image: this.image + ':' + this.imageVersion,
      ports: (this.ports || new Array()).map(port => { return port.buildPortMapping() }),
      restart_policy: this.restartPolicy,
      volumes: (this.volumes || new Array()).map(volume => { return volume.buildVolumeMapping() }),
      user: this.user,
      autoupdate: true,
      network: this.network,

      dependencies: {
        executionClients: (this.dependencies.executionClients || []).map(service => service.buildMinimalConfiguration()),
        consensusClients: (this.dependencies.consensusClients || []).map(service => service.buildMinimalConfiguration()),
        prometheusNodeExporterClients: (this.dependencies.prometheusNodeExporterClients || []).map(service => service.buildMinimalConfiguration())
      }
    }
  }

  buildMinimalConfiguration () {
    return {
      service: this.constructor.name,
      id: this.id
    }
  }
}

// EOF
