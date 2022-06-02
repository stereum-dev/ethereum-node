import { BloxSSVService } from './ethereum-services/BloxSSVService'
import { GethService } from './ethereum-services/GethService'
import { NimbusBeaconService } from './ethereum-services/NimbusBeaconService'
import { PrometheusService } from './ethereum-services/PrometheusService'
import { PrometheusNodeExporterService } from './ethereum-services/PrometheusNodeExporterService'
import { GrafanaService } from './ethereum-services/GrafanaService'
import { ServicePort, servicePortProtocol } from './ethereum-services/ServicePort'
import { StringUtils } from './StringUtils.js'
import { ServiceManager } from './ServiceManager'
import { LighthouseBeaconService } from './ethereum-services/LighthouseBeaconService'
import { LighthouseValidatorService } from './ethereum-services/LighthouseValidatorService'
import { PrysmBeaconService } from './ethereum-services/PrysmBeaconService'
import { PrysmValidatorService } from './ethereum-services/PrysmValidatorService'
import { TekuBeaconService } from './ethereum-services/TekuBeaconService'

export class OneClickInstall {
  async prepareNode(installDir, nodeConnection) {
    this.installDir = installDir
    this.nodeConnection = nodeConnection
    this.serviceManager = new ServiceManager(this.nodeConnection)
    await this.nodeConnection.findStereumSettings()
    if (this.nodeConnection.settings === undefined) {
      await this.nodeConnection.sshService.exec(` mkdir /etc/stereum &&
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
      PRYSM: 24,
      LIGHTHOUSE: 24,
      NIMBUS: 24,
      TEKU: 20,
    }
    let buffer = []
    let clientDistribution = []
    let sum = 0
    let range = 0
    
    Object.keys(clients).forEach(key => {
      buffer.push({ name: key, coverage: clients[key] })
    })

    buffer.forEach(client => { sum += (100 / client.coverage) })

    buffer.forEach(client => {
      clientDistribution.push({ name: client.name, percentage: (((100 / client.coverage) / sum) * 100) })
    })

    clientDistribution.forEach(client => {
      client.min = range
      range = range + client.percentage
      client.max = range
    })

    const ran = Math.random() * 100
    const winner = clientDistribution.find(client => (client.min <= ran && client.max >= ran))
    console.log(winner,ran)
    return winner.name.toLowerCase()
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

  async createServices() {
    let ports = []
    this.beaconService = undefined
    this.validatorService = undefined

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
        
        //generate validator api-token
        const valDir = (this.beaconService.volumes.find(vol => vol.servicePath === '/opt/app/validators')).destinationPath
        const token = StringUtils.createRandomString()
        await this.nodeConnection.sshService.exec(`sudo mkdir -p ${valDir}`)
        await this.nodeConnection.sshService.exec(`sudo echo ${token} > ${valDir}/api-token.txt`)
        break


      case 'Teku':
        //TekuBeaconService
        ports = [
          new ServicePort(null, 9001, 9001, servicePortProtocol.tcp),
          new ServicePort(null, 9001, 9001, servicePortProtocol.udp),
          new ServicePort('127.0.0.1', 5051, 5051, servicePortProtocol.tcp),
          new ServicePort('127.0.0.1', 5052, 5052, servicePortProtocol.tcp),
        ]
        this.beaconService = TekuBeaconService.buildByUserInput('prater', ports, this.installDir + '/teku', [this.executionClient], 'stereum.net')
        
        //keystore
        const dataDir = (this.beaconService.volumes.find(vol => vol.servicePath === '/opt/app/data')).destinationPath
        const password = StringUtils.createRandomString()
        await this.nodeConnection.sshService.exec('sudo apt install -y openjdk-8-jre-headless')
        await this.nodeConnection.sshService.exec(`sudo mkdir -p ${dataDir}`)
        await this.nodeConnection.sshService.exec(`sudo echo ${password} > ${dataDir}/teku_api_password.txt`)
        await this.nodeConnection.sshService.exec(`sudo bash -c "cd ${dataDir} && keytool -genkeypair -keystore teku_api_keystore -storetype PKCS12 -storepass ${password} -keyalg RSA -keysize 2048 -validity 109500 -dname 'CN=localhost, OU=MyCompanyUnit, O=MyCompany, L=MyCity, ST=MyState, C=AU' -ext san=dns:localhost,ip:127.0.0.1"`)
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
      return configs
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
      this.choosenClient = await this.chooseClient()
      this.choosenClient = this.choosenClient.charAt(0).toUpperCase() + this.choosenClient.slice(1)
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
