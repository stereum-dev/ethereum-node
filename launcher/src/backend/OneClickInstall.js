import { BloxSSVService } from './ethereum-services/BloxSSVService'
import { GethService } from './ethereum-services/GethService'
import { NimbusBeaconService } from './ethereum-services/NimbusBeaconService'
import { PrometheusService } from './ethereum-services/PrometheusService'
import { PrometheusNodeExporterService } from './ethereum-services/PrometheusNodeExporterService'
import { GrafanaService } from './ethereum-services/GrafanaService'
import { ServicePort, servicePortProtocol } from './ethereum-services/ServicePort'
import { ServiceManager } from './ServiceManager'
import { LighthouseBeaconService } from './ethereum-services/LighthouseBeaconService'
import { LighthouseValidatorService } from './ethereum-services/LighthouseValidatorService'
import { PrysmBeaconService } from './ethereum-services/PrysmBeaconService'
import { PrysmValidatorService } from './ethereum-services/PrysmValidatorService'

export class OneClickInstall {
  async prepareNode(installDir, nodeConnection) {
    this.installDir = installDir
    this.nodeConnection = nodeConnection
    this.serviceManager = new ServiceManager(nodeConnection)
    await this.nodeConnection.findStereumSettings()
    if (this.nodeConnection.settings === undefined) {
      await nodeConnection.sshService.exec(` mkdir /etc/stereum &&
      echo "stereum_settings:
      settings:
        controls_install_path: ${this.installDir || '/opt/stereum'}
        os_user: stereum
        updates:
          lane: stable
          unattended:
            install: false
    " > /etc/stereum/stereum.yaml`)
    await this.nodeConnection.findStereumSettings()
    }
    return await this.nodeConnection.prepareStereumNode(this.nodeConnection.settings.stereum.settings.controls_install_path)
  }

  //this is broken
  async chooseClient(clients) {
    clients = {
      PRYSM: 33
    }
    const buffer = {}
    let sum = 0
    Object.keys(clients).forEach(key => {
      sum += (100 / clients[key])
    })
    Object.keys(clients).forEach(key => {
      buffer[key] = ((100 / clients[key]) / sum) * 100
    })
    const ran = Math.random() * 100
    let smallestDiff = Number.MAX_VALUE
    let result = ''
    console.log(ran, buffer)
    Object.keys(buffer).forEach(key => {
      const diff = Math.abs(buffer[key] - ran)
      if (diff < smallestDiff) {
        result = key
        smallestDiff = diff
      }
    })
    return result.toLowerCase()
  }

  getConfigurations() {
    const beacon = this.beaconService.buildConfiguration()
    const geth = this.executionClient.buildConfiguration()
    const prometheusNodeExporter = this.prometheusNodeExporter.buildConfiguration()
    const prometheus = this.prometheus.buildConfiguration()
    const grafana = this.grafana.buildConfiguration()
    if (!this.validatorService) {
      return [beacon, geth, prometheusNodeExporter, prometheus, grafana]
    }
    const validator = this.validatorService.buildConfiguration()
    return [beacon, validator, geth, prometheusNodeExporter, prometheus, grafana]
  }

  createServices() {
    let ports = []

    ports = [
      new ServicePort(null, 30303, 30303, servicePortProtocol.tcp),
      new ServicePort(null, 30303, 30303, servicePortProtocol.udp)
    ]
    this.executionClient = GethService.buildByUserInput('goerli', ports, this.installDir + '/geth')

    switch (this.choosenClient) {
      case 'Lighthouse':
        //LighthouseBeaconService   
        ports = [
          new ServicePort(null, 9000, 9000, servicePortProtocol.tcp),
          new ServicePort(null, 9000, 9000, servicePortProtocol.udp),
          new ServicePort('127.0.0.1', 5052, 5052, servicePortProtocol.tcp)
        ]
        this.beaconService = LighthouseBeaconService.buildByUserInput('prater', ports, this.installDir + '/lighthouse', [this.executionClient], '16')

        //LighthouseValidatorService
        ports = [
          new ServicePort('127.0.0.1', 5062, 5062, servicePortProtocol.tcp)
        ]
        this.validatorService = LighthouseValidatorService.buildByUserInput('prater', ports, this.installDir + '/lighthouse', [this.beaconService], 'stereum.net')
        break


      case 'Prysm':
        //PrysmBeaconService
        ports = [
          new ServicePort(null, 13000, 13000, servicePortProtocol.tcp),
          new ServicePort(null, 12000, 12000, servicePortProtocol.udp),
          new ServicePort('127.0.0.1', 4000, 4000, servicePortProtocol.tcp)
        ]
        this.beaconService = PrysmBeaconService.buildByUserInput('prater', ports, this.installDir + '/prysm', [this.executionClient])
        //PrysmValidatorService
        ports = [
          new ServicePort('127.0.0.1', 7500, 7500, servicePortProtocol.tcp)
        ]
        this.validatorService = PrysmValidatorService.buildByUserInput('prater', ports, this.installDir + '/prysm', [this.beaconService], 'stereum.net')
        break


      case 'Nimbus':
        //NimbusBeaconService
        ports = [
          new ServicePort(null, 9000, 9000, servicePortProtocol.tcp),
          new ServicePort(null, 9000, 9000, servicePortProtocol.udp),
          new ServicePort('127.0.0.1', 9190, 9190, servicePortProtocol.tcp),
          new ServicePort('127.0.0.1', 5052, 5052, servicePortProtocol.tcp)
        ]
        this.beaconService = NimbusBeaconService.buildByUserInput('prater', ports, this.installDir + '/nimbus', [this.executionClient], 'stereum.net')
        break


      case 'Teku':
        // to be implemented
        break
    }

    this.prometheusNodeExporter = PrometheusNodeExporterService.buildByUserInput()

    ports = [
      new ServicePort('127.0.0.1', 9090, 9090, servicePortProtocol.tcp)
    ]
    this.prometheus = PrometheusService.buildByUserInput('prater', ports, this.installDir + '/prometheus', [this.beaconService], [this.prometheusNodeExporter])

    ports = [
      new ServicePort('127.0.0.1', 3000, 3000, servicePortProtocol.tcp)
    ]
    this.grafana = GrafanaService.buildByUserInput('prater', ports, this.installDir + '/grafana', this.choosenClient.toLowerCase())
  }

  async writeConfig() {
    const configs = this.getConfigurations()
    if (configs[0] !== undefined) {
      await Promise.all(configs.map(async (config) => {
        await this.nodeConnection.writeServiceConfiguration(config)
      }))
    }
  }

  async startServices() {
    const services = this.getConfigurations()
    const runRefs = []
    if (services[0] !== undefined) {
      await Promise.all(services.map(async (service) => {
        if (service.service === 'GrafanaService') {
          runRefs.push(await this.serviceManager.manageServiceState(service.id, 'started', service.env.GRAFANA_PROVISIONING))
        } else {
          runRefs.push(await this.serviceManager.manageServiceState(service.id, 'started'))
        }
      }))
    }
    return runRefs
  }

  async getSetupConstellation(setup) {
    const services = ['GETH', 'GRAFANA', 'PROMETHEUSNODEEXPORTER', 'PROMETHEUS']
    // make sure API is only called once when implemented
    if (!this.choosenClient) {
      this.choosenClient = await this.chooseClient()
      this.choosenClient = this.choosenClient.charAt(0).toUpperCase() + this.choosenClient.slice(1)
    }
    services.push(this.choosenClient.toUpperCase())

    // TODO: adapt Validator integration on naming of Validator services if "LIGHTHOUSE" (distinguish by category) then do nothing else "LIGHTHOUSEVALIDATOR" or something else
    switch (setup) {
      case 'staking':
        break
      case 'blox ssv':
        services.push('BLOX SSV')
        break
      case 'obol ssv':
        services.push('OBOL SSV')
        break
      case 'rocketpool':
        services.push('ROCKETPOOL')
        break
    }
    return services
  }
}
