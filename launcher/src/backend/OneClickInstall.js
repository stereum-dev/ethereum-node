import { SSVNetworkService } from './ethereum-services/SSVNetworkService'
import { GethService } from './ethereum-services/GethService'
import { BesuService } from './ethereum-services/BesuService'
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
import { NethermindService } from './ethereum-services/NethermindService'

const YAML = require('yaml')
const log = require('electron-log')

async function Sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

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
    log.info(winner, ran)
    return winner.name.toLowerCase()
  }

  clearSetup(){
    this.beaconService = undefined
    this.validatorService = undefined
    this.installDir = undefined
    this.executionClient = undefined
    this.prometheusNodeExporter = undefined
    this.prometheus = undefined
    this.grafana = undefined
    this.setup = undefined
    this.choosenClient = undefined
    this.network = undefined
  }

  getConfigurations() {
    const beacon = this.beaconService.buildConfiguration()
    const executionClient = this.executionClient.buildConfiguration()
    const prometheusNodeExporter = this.prometheusNodeExporter.buildConfiguration()
    const prometheus = this.prometheus.buildConfiguration()
    const grafana = this.grafana.buildConfiguration()
    if (!this.validatorService) {
      return [executionClient, beacon, prometheusNodeExporter, prometheus, grafana]
    }
    const validator = this.validatorService.buildConfiguration()
    return [executionClient, beacon, validator, prometheusNodeExporter, prometheus, grafana]
  }

  networkHandler(eth1){
    if(this.network === "mainnet"){
      return "mainnet"
    }else if(this.network === "testnet"){
      if(eth1)
        return "goerli"
      return "prater"
    }
  }

  async createServices(constellation, checkpointURL) {
    let ports = []
    if (constellation.includes('GethService')) {
      ports = [
        new ServicePort(null, 30303, 30303, servicePortProtocol.tcp),
        new ServicePort(null, 30303, 30303, servicePortProtocol.udp),
        new ServicePort('127.0.0.1', 8551, 8551, servicePortProtocol.tcp),
      ]
      this.executionClient = GethService.buildByUserInput(this.networkHandler(true), ports, this.installDir + '/geth')
    }

    if (constellation.includes('BesuService')) {
      ports = [
        new ServicePort(null, 30303, 30303, servicePortProtocol.tcp),
        new ServicePort(null, 30303, 30303, servicePortProtocol.udp),
        new ServicePort('127.0.0.1', 8551, 8551, servicePortProtocol.tcp),
      ]
      this.executionClient = BesuService.buildByUserInput(this.networkHandler(true), ports, this.installDir + '/besu')

    }

    if (constellation.includes('NethermindService')) {
      ports = [
        new ServicePort(null, 30303, 30303, servicePortProtocol.tcp),
        new ServicePort(null, 30303, 30303, servicePortProtocol.udp),
        new ServicePort('127.0.0.1', 8551, 8551, servicePortProtocol.tcp),
      ]
      this.executionClient = NethermindService.buildByUserInput(this.networkHandler(true), ports, this.installDir + '/nethermind')

    }

    if (constellation.includes('LighthouseBeaconService')) {
      //LighthouseBeaconService
      ports = [
        new ServicePort(null, 9000, 9000, servicePortProtocol.tcp),
        new ServicePort(null, 9000, 9000, servicePortProtocol.udp),
        new ServicePort('127.0.0.1', 5052, 5052, servicePortProtocol.tcp)
      ]
      this.beaconService = LighthouseBeaconService.buildByUserInput(this.networkHandler(false), ports, this.installDir + '/lighthouse', [this.executionClient], '16', checkpointURL)
    }

    if (constellation.includes('LighthouseValidatorService')) {
      //LighthouseValidatorService
      ports = [
        new ServicePort('127.0.0.1', 5062, 5062, servicePortProtocol.tcp)
      ]
      this.validatorService = LighthouseValidatorService.buildByUserInput(this.networkHandler(false), ports, this.installDir + '/lighthouse', [this.beaconService], 'stereum.net')
    }

    if (constellation.includes('PrysmBeaconService')) {
      //PrysmBeaconService
      ports = [
        new ServicePort(null, 13001, 13001, servicePortProtocol.tcp),
        new ServicePort(null, 12001, 12001, servicePortProtocol.udp),
        new ServicePort('127.0.0.1', 4000, 4000, servicePortProtocol.tcp)
      ]
      this.beaconService = PrysmBeaconService.buildByUserInput(this.networkHandler(false), ports, this.installDir + '/prysm', [this.executionClient], checkpointURL)
    }

    if (constellation.includes('PrysmValidatorService')) {
      //PrysmValidatorService
      ports = [
        new ServicePort('127.0.0.1', 7500, 7500, servicePortProtocol.tcp)
      ]
      this.validatorService = PrysmValidatorService.buildByUserInput(this.networkHandler(false), ports, this.installDir + '/prysm', [this.beaconService], 'stereum.net')
    }

    if (constellation.includes('NimbusBeaconService')) {
      //NimbusBeaconService
      ports = [
        new ServicePort(null, 9000, 9000, servicePortProtocol.tcp),
        new ServicePort(null, 9000, 9000, servicePortProtocol.udp),
        new ServicePort('127.0.0.1', 9190, 9190, servicePortProtocol.tcp),
        new ServicePort('127.0.0.1', 5052, 5052, servicePortProtocol.tcp)
      ]
      this.beaconService = NimbusBeaconService.buildByUserInput(this.networkHandler(false), ports, this.installDir + '/nimbus', [this.executionClient], 'stereum.net', checkpointURL)

      //generate validator api-token
      const valDir = (this.beaconService.volumes.find(vol => vol.servicePath === '/opt/app/validators')).destinationPath
      const token = StringUtils.createRandomString()
      await this.nodeConnection.sshService.exec(`mkdir -p ${valDir}`)
      await this.nodeConnection.sshService.exec(`echo ${token} > ${valDir}/api-token.txt`)
    }

    if (constellation.includes('TekuBeaconService')) {
      //TekuBeaconService
      ports = [
        new ServicePort(null, 9001, 9001, servicePortProtocol.tcp),
        new ServicePort(null, 9001, 9001, servicePortProtocol.udp),
        new ServicePort('127.0.0.1', 5051, 5051, servicePortProtocol.tcp),
        new ServicePort('127.0.0.1', 5052, 5052, servicePortProtocol.tcp),
      ]
      this.beaconService = TekuBeaconService.buildByUserInput(this.networkHandler(false), ports, this.installDir + '/teku', [this.executionClient], 'stereum.net', checkpointURL)

      //keystore
      const dataDir = (this.beaconService.volumes.find(vol => vol.servicePath === '/opt/app/data')).destinationPath
      const password = StringUtils.createRandomString()
      await this.nodeConnection.sshService.exec('apt install -y openjdk-8-jre-headless')
      await this.nodeConnection.sshService.exec(`mkdir -p ${dataDir}`)
      await this.nodeConnection.sshService.exec(`echo ${password} > ${dataDir}/teku_api_password.txt`)
      await this.nodeConnection.sshService.exec(`cd ${dataDir} && keytool -genkeypair -keystore teku_api_keystore -storetype PKCS12 -storepass ${password} -keyalg RSA -keysize 2048 -validity 109500 -dname 'CN=localhost, OU=MyCompanyUnit, O=MyCompany, L=MyCity, ST=MyState, C=AU' -ext san=dns:localhost,ip:127.0.0.1`)
    }

    if (constellation.includes('SSVNetworkService')) {
      //SSVNetworkService
      ports = [
        new ServicePort(null, 12000, 12000, servicePortProtocol.udp),
        new ServicePort(null, 13000, 13000, servicePortProtocol.tcp),
      ]
      this.validatorService = SSVNetworkService.buildByUserInput(this.networkHandler(false), ports, this.installDir + '/ssv_network', [this.executionClient], [this.beaconService])
    }


    this.prometheusNodeExporter = PrometheusNodeExporterService.buildByUserInput(this.networkHandler(false))

    ports = [
      new ServicePort('127.0.0.1', 9090, 9090, servicePortProtocol.tcp)
    ]
    this.prometheus = PrometheusService.buildByUserInput(this.networkHandler(false), ports, this.installDir + '/prometheus')

    ports = [
      new ServicePort('127.0.0.1', 3000, 3000, servicePortProtocol.tcp)
    ]
    this.grafana = GrafanaService.buildByUserInput(this.networkHandler(false), ports, this.installDir + '/grafana')

    let versions
    try{
      versions = await this.nodeConnection.checkUpdates()
    }catch(err){
      log.error(`Couldn't fetch versions in OneClickInstallation...
      Installing with predefined Versions
      ${err.name}: ${err.message}
      url: ${err.config.url}
      method: ${err.config.method}
      headers: ${err.config.headers}
      timeout: ${err.config.timeout}
      `)
    }
    if(versions){
      this.executionClient.imageVersion = this.getLatestVersion(versions, this.executionClient)
      this.beaconService.imageVersion = this.getLatestVersion(versions, this.beaconService)
      this.prometheus.imageVersion = this.getLatestVersion(versions, this.prometheus)
      this.prometheusNodeExporter.imageVersion = this.getLatestVersion(versions, this.prometheusNodeExporter)
      this.grafana.imageVersion = this.getLatestVersion(versions, this.grafana)
      if(this.validatorService){
        this.validatorService.imageVersion = this.getLatestVersion(versions, this.validatorService)
      }
    }
  }

  getLatestVersion(versions, service){
    return versions[service.network][service.service].slice(-1).pop()
  }

  async generateSSVKeys(){
    await this.nodeConnection.runPlaybook('ssv-key-generator', { stereum_role: 'ssv-key-generator', ssv_key_service: this.validatorService.id })
    const config = await this.nodeConnection.readServiceConfiguration(this.validatorService.id)
    let ssvConfig = this.validatorService.getServiceConfiguration(this.networkHandler(false), [this.executionClient], [this.beaconService])

    // prepare service's config file
    const dataDir = (this.validatorService.volumes.find(vol => vol.servicePath === '/data')).destinationPath
    const escapedConfigFile = StringUtils.escapeStringForShell(ssvConfig.replace(/^OperatorPrivateKey.*/gm,"OperatorPrivateKey: \"" + config.ssv_sk + "\""))
    this.nodeConnection.sshService.exec(`mkdir -p ${dataDir} && echo ${escapedConfigFile} > ${dataDir}/config.yaml`)
  }

  async writeConfig() {
    const configs = this.getConfigurations()
    if (configs[0] !== undefined) {
      await Promise.all(configs.map(async (config) => {
        await this.nodeConnection.writeServiceConfiguration(config)
      }))
      if (this.validatorService && this.validatorService.service === 'SSVNetworkService') {
        await this.generateSSVKeys()
      }
      return configs
    }
  }

  async startServices() {
    const services = this.getConfigurations()
    const runRefs = []
    if (services[0] !== undefined) {
      await Promise.all(services.map(async (service, index) => {
        Sleep(index*1000).then(() => runRefs.push(this.serviceManager.manageServiceState(service.id, 'started')))
      }))
    }
    this.clearSetup()
    return runRefs
  }

  async getSetupConstellation(setup, network) {
    this.clearSetup()
    this.setup = setup
    this.network = network
    const services = ['GethService', 'GrafanaService', 'PrometheusNodeExporterService', 'PrometheusService']

    this.choosenClient = await this.chooseClient()
    this.choosenClient = this.choosenClient.charAt(0).toUpperCase() + this.choosenClient.slice(1)

    services.push(this.choosenClient + 'ValidatorService')
    services.push(this.choosenClient + 'BeaconService')

    switch (setup) {
      case 'staking':
        break
      case 'ssv.network':
        services.push('SSVNetworkService')
        break
      case 'obol ssv':
        services.push('OBOLSSV')
        break
      case 'rocketpool':
        services.push('ROCKETPOOL')
        break
    }
    return services
  }
}
