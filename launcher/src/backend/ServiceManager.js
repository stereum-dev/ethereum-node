import { LighthouseBeaconService } from './ethereum-services/LighthouseBeaconService'
import { LighthouseValidatorService } from './ethereum-services/LighthouseValidatorService'
import { LodestarBeaconService } from './ethereum-services/LodestarBeaconService'
import { LodestarValidatorService } from './ethereum-services/LodestarValidatorService'
import { GethService } from './ethereum-services/GethService'
import { ErigonService } from './ethereum-services/ErigonService'
import { BesuService } from './ethereum-services/BesuService'
import { SSVNetworkService } from './ethereum-services/SSVNetworkService'
import { NimbusBeaconService } from './ethereum-services/NimbusBeaconService'
import { PrometheusService } from './ethereum-services/PrometheusService'
import { PrometheusNodeExporterService } from './ethereum-services/PrometheusNodeExporterService'
import { GrafanaService } from './ethereum-services/GrafanaService'
import { PrysmBeaconService } from './ethereum-services/PrysmBeaconService'
import { PrysmValidatorService } from './ethereum-services/PrysmValidatorService'
import { TekuBeaconService } from './ethereum-services/TekuBeaconService'
import { NethermindService } from './ethereum-services/NethermindService'
import { FlashbotsMevBoostService } from './ethereum-services/FlashbotsMevBoostService'
import { ServicePort, servicePortProtocol, changeablePorts } from './ethereum-services/ServicePort'
import { StringUtils } from './StringUtils'
import { ServiceVolume } from './ethereum-services/ServiceVolume'

const log = require('electron-log')

/**
 * desired states of a service
 */
export const serivceState = {
  restarted: 'restarted',
  started: 'started',
  stopped: 'stopped'
}

export class ServiceManager {
  constructor(nodeConnection) {
    this.nodeConnection = nodeConnection
  }

  /**
     * Set the desired state of a service.
     *
     * @param serviceId service's id
     * @param state a string with the desired state, see serivceState
     * @returns an object containing a reference to the ansible process output, usable with NodeConnection.playbookStatus
     */
  manageServiceState(serviceId, state) {
    const extraVars = {
      stereum_role: 'manage-service',
      stereum_args: {
        manage_service: {
          state: state,
          configuration: {
            id: serviceId
          }
        }
      }
    }
    return this.nodeConnection.runPlaybook(state.replace("ed", "ing Service"), extraVars)
  }

  /**
     * Read the service configurations.
     *
     * @returns an array of all service configurations
     */
  readServiceConfigurations() {
    return this.nodeConnection.listServicesConfigurations().then(async services => {

      const serviceConfigurations = new Array()
      for (let i = 0; i < services.length; i++) {
        const service = services[i]
        await this.nodeConnection.readServiceConfiguration(service).then(config => {
          serviceConfigurations.push(config)
        })
      }

      return serviceConfigurations
    }).then(serviceConfigurations => {

      const services = new Array()

      for (let i = 0; i < serviceConfigurations.length; i++) {
        const config = serviceConfigurations[i]

        if (config.service) {
          if (config.service == 'LighthouseBeaconService') {
            services.push(LighthouseBeaconService.buildByConfiguration(config))
          } else if (config.service == 'LighthouseValidatorService') {
            services.push(LighthouseValidatorService.buildByConfiguration(config))
          } else if (config.service == 'LodestarBeaconService') {
            services.push(LodestarBeaconService.buildByConfiguration(config))
          } else if (config.service == 'LodestarValidatorService') {
            services.push(LodestarValidatorService.buildByConfiguration(config))
          } else if (config.service == 'GethService') {
            services.push(GethService.buildByConfiguration(config))
          } else if (config.service == 'ErigonService') {
            services.push(ErigonService.buildByConfiguration(config))
          } else if (config.service == 'BesuService') {
            services.push(BesuService.buildByConfiguration(config))
          } else if (config.service == 'NethermindService') {
            services.push(NethermindService.buildByConfiguration(config))
          } else if (config.service == 'SSVNetworkService') {
            services.push(SSVNetworkService.buildByConfiguration(config))
          } else if (config.service == 'NimbusBeaconService') {
            services.push(NimbusBeaconService.buildByConfiguration(config))
          } else if (config.service == 'PrometheusService') {
            services.push(PrometheusService.buildByConfiguration(config))
          } else if (config.service == 'PrometheusNodeExporterService') {
            services.push(PrometheusNodeExporterService.buildByConfiguration(config))
          } else if (config.service == 'GrafanaService') {
            services.push(GrafanaService.buildByConfiguration(config))
          } else if (config.service == 'PrysmBeaconService') {
            services.push(PrysmBeaconService.buildByConfiguration(config))
          } else if (config.service == 'PrysmValidatorService') {
            services.push(PrysmValidatorService.buildByConfiguration(config))
          } else if (config.service == 'TekuBeaconService') {
            services.push(TekuBeaconService.buildByConfiguration(config))
          } else if (config.service == 'FlashbotsMevBoostService') {
            services.push(FlashbotsMevBoostService.buildByConfiguration(config))
          }
        } else {
          log.error('found configuration without service!')
          log.error(config)
          throw new Error('configuration without service specified')
        }
      }
      //retrieve full service out of minimal config
      services.forEach(service => {
        if (service.dependencies.executionClients.length > 0) {
          service.dependencies.executionClients = service.dependencies.executionClients.map(client => {
            return services.find(dependency => dependency.id === client.id)
          })
        }
        if (service.dependencies.consensusClients.length > 0) {
          service.dependencies.consensusClients = service.dependencies.consensusClients.map(client => {
            return services.find(dependency => dependency.id === client.id)
          })
        }
        if (service.dependencies.prometheusNodeExporterClients.length > 0) {
          service.dependencies.prometheusNodeExporterClients = service.dependencies.prometheusNodeExporterClients.map(client => {
            return services.find(dependency => dependency.id === client.id)
          })
        }
        if (service.dependencies.mevboost.length > 0) {
          service.dependencies.mevboost = service.dependencies.mevboost.map(client => {
            return services.find(dependency => dependency.id === client.id)
          })
        }
      })
      return services
    }).catch(err => {
      log.error(err)
      return []
    })
  }

  async chooseServiceAction(action, service, data) {
    switch (action) {
      case "pruneGeth":
        if (service.service === "GethService") {
          let data = service.yaml + "\nisPruning: true"
          await this.nodeConnection.writeServiceYAML({ id: service.config.serviceID, data: data, service: service.service })
          this.nodeConnection.runPlaybook("Pruning Geth", { stereum_role: 'prune-geth', geth_service: service.config.serviceID })
        }
        break;

      case "reSync":
        //initiate resync
        break;

      default:
        break;
    }
  }

  changePort(service, port){
    let portIndex = service.ports.findIndex(p => p.servicePort == changeablePorts[service.service])
    if(portIndex != -1){
      service.ports[portIndex].destinationPort = port
    }
    return service
  }

  async modifyServices(tasks, services, newInstallTasks){
    let modifiedServices = []

    tasks.forEach(task => {
      let service = services.find(s => s.id === task.service.config.serviceID)
      let dependencies = task.data.executionClients.concat(task.data.beaconServices).map(s => services.find(e => {
        if(e.id === s.config.serviceID){
          return true
        }else if(e.id === newInstallTasks.find(i => i.service.id === s.id).service.config.serviceID){
          return true
        }
        return false
      }))
      
      if(service.service === "FlashbotsMevBoostService"){
        service.entrypoint[service.entrypoint.findIndex(e => e === "-relays")+1] = task.data.relays
        modifiedServices.push(service)
        let dependenciesToRemove = (services.filter(s => s.dependencies.mevboost.map(m => m.id).includes(service.id))).filter(m => !dependencies.map(d => d.id).includes(m.id))
        dependenciesToRemove.forEach(dependency => {
          modifiedServices.push(this.removeDependencies(dependency,service))
        })
      }

      if(task.data.port){
        service = this.changePort(service, task.data.port)
      }
      let updated = this.addDependencies(service, dependencies)
      if(!Array.isArray(updated))
        updated = [updated]
      updated.forEach(dep => {
        let index = modifiedServices.findIndex(s => s.id === dep.id)
        if(index != -1){
          modifiedServices[index] = dep
        }else{
          modifiedServices.push(dep)
        }
      })
    })

    await Promise.all(modifiedServices.map(async (service) => {
      await this.nodeConnection.writeServiceConfiguration(service.buildConfiguration())
    }))

  }

  addDependencies(service, dependencies) {
    let command = ""
    let filter

      switch(service.service.replace(/(Beacon|Validator|Service)/gm, '')){
        case "Lighthouse":
          if(service.service.includes("Beacon")){
            filter = (e) => e.buildExecutionClientEngineRPCHttpEndpointUrl()
            command = "--execution-endpoint="
          }
          if(service.service.includes("Validator")){
            filter = (e) => e.buildConsensusClientHttpEndpointUrl()
            command = "--beacon-nodes="
          }
          break;
        case "Prysm":
          if(service.service.includes("Beacon")){
            filter = (e) => e.buildExecutionClientEngineRPCHttpEndpointUrl()
            command = "--execution-endpoint="
          }
          if(service.service.includes("Validator")){
            filter = (e) => e.buildConsensusClientEndpoint()
            command = "--beacon-rpc-provider="
            service.command = this.addCommandConnection(service, command, dependencies, filter)
            filter = (e) => e.buildConsensusClientGateway()
            command = "--beacon-rpc-gateway-provider="
          }
          break;
        case "Nimbus":
            filter = (e) => e.buildExecutionClientEngineRPCWsEndpointUrl()
            command = "--web3-url="
          break;
        case "Teku":
            filter = (e) => e.buildExecutionClientEngineRPCHttpEndpointUrl()
            command = "--ee-endpoint="
          break;
        case "FlashbotsMevBoost":
          return dependencies.map(client => {
            client.command = this.addMevBoostConnection(service, client)
            client.dependencies.mevboost.push(service)
            return client
          })
      }
      service.command = this.addCommandConnection(service, command, dependencies, filter)

      if(service.service.includes("Beacon")){
        service.dependencies.executionClients = dependencies
        let volumes = dependencies.map(client => new ServiceVolume(client.volumes.find(vol => vol.servicePath === '/engine.jwt').destinationPath, '/engine.jwt'))
        service.volumes = service.volumes.filter(v => v.destinationPath.includes(service.id))
        service.volumes = service.volumes.concat(volumes)
      } else if(service.service.includes("Validator")){
        service.dependencies.executionClients = dependencies
      }
      return service
  }

  addCommandConnection(service, endpointCommand, dependencies, filter){
    let isString = false
    let command = service.command
    if (typeof command === "string") {
      isString = true
      command = command.replaceAll(/\n/gm, '').replaceAll(/\s\s+/gm, ' ').split(' ')
    }
    log.info(command)
    let fullCommand = command.find(c => c.includes(endpointCommand))
    command = command.filter(c => !c.includes(endpointCommand))
    let newProps
    if(fullCommand){
      newProps = [this.formatCommand(fullCommand, endpointCommand, filter, dependencies)]
    }else{
      newProps = endpointCommand + dependencies.map(filter).join()
    }
    if (isString){
      return (command.concat(newProps)).join(' ').trim()
    }
    return command.concat(newProps)
  }

  addMevBoostConnection(service, dependency){
      let command = dependency.command
      let isString = false
      if (typeof command === "string") {
        isString = true
        command = command.replaceAll(/\n/gm, '').replaceAll(/\s\s+/gm, ' ').split(' ')
      }
      let builderCommand = ""
      switch(dependency.service){
        case'LighthouseBeaconService':
          builderCommand = "--builder="
          break;
        case'PrysmBeaconService':
          builderCommand = "--http-mev-relay="
          break;
        case'NimbusBeaconService':
          command.push('--payload-builder=true')
          builderCommand = "--payload-builder-url="
          break;
        case'TekuBeaconService':
          builderCommand = "--builder-endpoint="
          break;

      }
      let fullCommand = command.find(c => c.includes(builderCommand))
      command = command.filter(c => !c.includes(builderCommand))
      if(fullCommand){
        fullCommand = this.formatCommand(fullCommand, builderCommand, undefined, [service.buildMevboostEndpointURL()])
      } else {
        fullCommand = builderCommand + service.buildMevboostEndpointURL()
      }

      if (isString)
        return (command.concat([fullCommand])).join(' ')
      return command.concat([fullCommand])
  }

  removeDependencies(service, serviceToDelete) {
    //update command
    service.command = this.removeCommandConnection(service.command, serviceToDelete.id)

    //update volumes
    service.volumes = service.volumes.filter(v => !v.destinationPath.includes(serviceToDelete.id))

    //update dependencies arrays
    for (const dependency in service.dependencies) {
      service.dependencies[dependency] = service.dependencies[dependency].filter(s => s.id != serviceToDelete.id)
    }
    return service
  }

  removeCommandConnection(command, id) {
    let isString = false
    if (typeof command === "string") {
      isString = true
      command = command.replaceAll(/\n/gm, '').replaceAll(/\s\s+/gm, ' ').split(' ')
    }
    let includesID = command.filter(c => c.includes(id))
    command = command.filter(c => !includesID.includes(c))

    let newProps = includesID.map(c => {
      let command = c.match(/.*=/)[0]
      return this.formatCommand(c,command,(e) => !e.includes(id))
    }).filter(c => c !== undefined)

    if (isString)
      return (command.concat(newProps)).join(' ')
    return command.concat(newProps)
  }

  formatCommand(fullCommand, command, filter, dependencies) {
    let value = fullCommand.replace(command, '')
    let quotes = false
    if (value.startsWith('"') && value.endsWith('"')) {
      quotes = true
      value = value.substring(1, value.length - 1)
    }
    let newValue
    if(dependencies && filter){
      newValue = dependencies.map(filter).join()
    } else if (dependencies){
      newValue = value.split(',').concat(dependencies).join()
    } else {
      newValue = value.split(',').filter(filter).join()
    }
    if(!newValue){
      return undefined
    }
    if (quotes)
      newValue = '"' + newValue + '"'
    return command + newValue
  }

  async deleteService(task, tasks, services) {
    let serviceToDelete = services.find(service => service.id === task.service.config.serviceID)
    let dependents = []
    services.forEach(service => {
      for (const dependency in service.dependencies) {
        service.dependencies[dependency].forEach(s => {
          if (s.id === serviceToDelete.id)
            dependents.push(service)
        })
      }
    })
    dependents.forEach(service => {
      service = this.removeDependencies(service, serviceToDelete)
      this.nodeConnection.writeServiceConfiguration(service.buildConfiguration())
    })
    await this.nodeConnection.runPlaybook("Delete Service", { stereum_role: 'delete-service', service: task.service.config.serviceID })
  }
  //args: network, installDir, port, executionClients, checkpointURL, beaconServices
  getService(name, args) {
    let ports
    switch (name) {
      case "GethService":
        ports = [
          new ServicePort(null, 30303, 30303, servicePortProtocol.tcp),
          new ServicePort(null, 30303, 30303, servicePortProtocol.udp),
          new ServicePort('127.0.0.1', args.port ? args.port : 8545, 8545, servicePortProtocol.tcp),
        ]
        return GethService.buildByUserInput(args.network, ports, args.installDir + '/geth')

      case "BesuService":
        ports = [
          new ServicePort(null, 30303, 30303, servicePortProtocol.tcp),
          new ServicePort(null, 30303, 30303, servicePortProtocol.udp),
          new ServicePort('127.0.0.1', args.port ? args.port : 8545, 8545, servicePortProtocol.tcp),
        ]
        return BesuService.buildByUserInput(args.network, ports, args.installDir + '/besu')

      case "NethermindService":
        ports = [
          new ServicePort(null, 30303, 30303, servicePortProtocol.tcp),
          new ServicePort(null, 30303, 30303, servicePortProtocol.udp),
          new ServicePort('127.0.0.1', args.port ? args.port : 8545, 8545, servicePortProtocol.tcp),
        ]
        return NethermindService.buildByUserInput(args.network, ports, args.installDir + '/nethermind')

      case "LighthouseBeaconService":
        ports = [
          new ServicePort(null, 9000, 9000, servicePortProtocol.tcp),
          new ServicePort(null, 9000, 9000, servicePortProtocol.udp),
          new ServicePort('127.0.0.1', args.port ? args.port : 5052, 5052, servicePortProtocol.tcp),
        ]
        return LighthouseBeaconService.buildByUserInput(args.network, ports, args.installDir + '/lighthouse', args.executionClients, '16', [], args.checkpointURL)

      case "LighthouseValidatorService":
        ports = [
          new ServicePort('127.0.0.1', args.port ? args.port : 5062, 5062, servicePortProtocol.tcp),
        ]
        return LighthouseValidatorService.buildByUserInput(args.network, ports, args.installDir + '/lighthouse', args.beaconServices)

      case "PrysmBeaconService":
        ports = [
          new ServicePort(null, 13001, 13001, servicePortProtocol.tcp),
          new ServicePort(null, 12001, 12001, servicePortProtocol.udp),
          new ServicePort('127.0.0.1', 4000, 4000, servicePortProtocol.tcp),
          new ServicePort('127.0.0.1', args.port ? args.port : 3500, 3500, servicePortProtocol.tcp)
        ]
        return PrysmBeaconService.buildByUserInput(args.network, ports, args.installDir + '/prysm', args.executionClients, [], args.checkpointURL)

      case "PrysmValidatorService":
        ports = [
          new ServicePort('127.0.0.1', args.port ? args.port : 7500, 7500, servicePortProtocol.tcp),
        ]
        return PrysmValidatorService.buildByUserInput(args.network, ports, args.installDir + '/prysm', args.beaconServices)

      case "NimbusBeaconService":
        ports = [
          new ServicePort(null, 9000, 9000, servicePortProtocol.tcp),
          new ServicePort(null, 9000, 9000, servicePortProtocol.udp),
          new ServicePort('127.0.0.1', args.port ? args.port : 5052, 5052, servicePortProtocol.tcp)
        ]
        return NimbusBeaconService.buildByUserInput(args.network, ports, args.installDir + '/nimbus', args.executionClients, [], args.checkpointURL)

      case "TekuBeaconService":
        ports = [
          new ServicePort(null, 9001, 9001, servicePortProtocol.tcp),
          new ServicePort(null, 9001, 9001, servicePortProtocol.udp),
          new ServicePort('127.0.0.1', 5052, 5052, servicePortProtocol.tcp),
          new ServicePort('127.0.0.1', args.port ? args.port : 5051, 5051, servicePortProtocol.tcp)
        ]
        return TekuBeaconService.buildByUserInput(args.network, ports, args.installDir + '/teku', args.executionClients, [], args.checkpointURL)

      case "PrometheusNodeExporterService":
        return PrometheusNodeExporterService.buildByUserInput(args.network)

      case "PrometheusService":
        ports = [
          new ServicePort('127.0.0.1', args.port ? args.port : 9090, 9090, servicePortProtocol.tcp)
        ]
        return PrometheusService.buildByUserInput(args.network, ports, args.installDir + '/prometheus')

      case "GrafanaService":
        ports = [
          new ServicePort('127.0.0.1', args.port ? args.port : 3000, 3000, servicePortProtocol.tcp)
        ]
        return GrafanaService.buildByUserInput(args.network, ports, args.installDir + '/grafana')

      case "FlashbotsMevBoostService":
        return FlashbotsMevBoostService.buildByUserInput(args.network, args.relays)
    }
  }

  async createKeystores(services){
    for(const service of services){
      if(service.service.includes("Nimbus")){
        const valDir = (service.volumes.find(vol => vol.servicePath === '/opt/app/validators')).destinationPath
        const token = StringUtils.createRandomString()
        await this.nodeConnection.sshService.exec(`mkdir -p ${valDir}`)
        await this.nodeConnection.sshService.exec(`echo ${token} > ${valDir}/api-token.txt`)
      } else if(service.service.includes("Teku")) {
        const dataDir = (service.volumes.find(vol => vol.servicePath === '/opt/app/data')).destinationPath
        const password = StringUtils.createRandomString()
        await this.nodeConnection.sshService.exec('apt install -y openjdk-8-jre-headless')
        await this.nodeConnection.sshService.exec(`mkdir -p ${dataDir}`)
        await this.nodeConnection.sshService.exec(`echo ${password} > ${dataDir}/teku_api_password.txt`)
        await this.nodeConnection.sshService.exec(`cd ${dataDir} && keytool -genkeypair -keystore teku_api_keystore -storetype PKCS12 -storepass ${password} -keyalg RSA -keysize 2048 -validity 109500 -dname 'CN=localhost, OU=MyCompanyUnit, O=MyCompany, L=MyCity, ST=MyState, C=AU' -ext san=dns:localhost,ip:127.0.0.1`)
      }
    }
  }

  async addServices(tasks, services) {
    let newServices = []
    let ELInstalls = tasks.filter(t => t.service.category === "execution")
    ELInstalls.forEach(t => {
      let service = this.getService(t.service.service, t.data)
      t.service.config.serviceID = service.id
      newServices.push(service)
    })
    let CLInstalls = tasks.filter(t => t.service.category === "consensus")
    CLInstalls.forEach(t => {
      if(t.data.executionClients.length > 0){
        t.data.executionClients = t.data.executionClients.map(ec => {
          let id = ec.config.serviceID
          if(id){
            return services.find(s => s.id === id)
          }
          id = (ELInstalls.find(el => el.service.id === ec.id)).service.config.serviceID
          return newServices.find(s => s.id === id)
        })
      }
      let service = this.getService(t.service.service, t.data)
      t.service.config.serviceID = service.id
      newServices.push(service)
    })
    let VLInstalls = tasks.filter(t => t.service.category === "validator")
    VLInstalls.forEach(t => {
      if(t.data.beaconServices.length > 0){
        t.data.beaconServices = t.data.beaconServices.map(bc => {
          let id = bc.config.serviceID
          if(id){
            return services.find(s => s.id === id)
          }
          id = CLInstalls.find(el => el.service.id === bc.id).service.config.serviceID
          return newServices.find(s => s.id === id)
        })
      }
      let service = this.getService(t.service.service, t.data)
      t.service.config.serviceID = service.id
      newServices.push(service)
    })
    let PInstalls = tasks.filter(t => t.service.category === "service")
    PInstalls.forEach(t => {
      if(t.data.beaconServices.length > 0 && t.service.service === "FlashbotsMevBoostService"){
        t.data.beaconServices = t.data.beaconServices.map(bc => {
          let id = bc.config.serviceID
          if(id){
            return services.find(s => s.id === id)
          }
          id = CLInstalls.find(el => el.service.id === bc.id).service.config.serviceID
          return newServices.find(s => s.id === id)
        })
      }
      let service = this.getService(t.service.service, t.data)
      let changed = this.addDependencies(service, t.data.beaconServices)
      changed.forEach(dep => {
        let index = newServices.findIndex(s => s.id === dep.id)
        if(index != -1){
          newServices[index] = dep
        }else{
          newServices.push(dep)
        }
      })
      newServices.push(service)
    })
    
    let allPorts = services.map(s => s.ports).flat(1).map(p => p.destinationPort + '/' + p.servicePortProtocol)
    let changed
    do{
      changed = false
        newServices.forEach(service => {
          service.ports.forEach(newPort => {
            if(allPorts.includes(newPort.destinationPort + '/' + newPort.servicePortProtocol)){
              newPort.destinationPort++
              changed = true
            }
          })
        })
    }while(changed === true)

    await this.createKeystores(newServices.filter(s => s.service.includes("Teku") || s.service.includes("Nimbus")))
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
    newServices.forEach(service => {
      if(versions[service.network][service.service]){
        service.imageVersion = versions[service.network][service.service].slice(-1).pop()
      }else{
        service.imageVersion = versions["prater"][service.service].slice(-1).pop()
      }
    })

    await Promise.all(newServices.map(async (service) => {
      await this.nodeConnection.writeServiceConfiguration(service.buildConfiguration())
    }))
    return ELInstalls.concat(CLInstalls,VLInstalls)
  }

  static uniqueByID(job) {
    return (value, index, self) => self.map(t => t.service.config.serviceID).indexOf(value.service.config.serviceID) === index && value.content === job
  }

  async handleServiceChanges(tasks) {
    let jobs = tasks.map(t => t.content)
    if (jobs.includes("DELETE")) {
      let services = await this.readServiceConfigurations()
      let before = this.nodeConnection.getTimeStamp()
      try {
        await Promise.all(tasks.filter(ServiceManager.uniqueByID("DELETE")).map((task, index, tasks) => { return this.deleteService(task, tasks, services) }))
      } catch (err) {
        log.error("Deleting Services Failed:", err)
      } finally {
        let after = this.nodeConnection.getTimeStamp()
        await this.nodeConnection.restartServices(after - before)
      }
    }
    let newInstallTasks
    if (jobs.includes("INSTALL")) {
      let services = await this.readServiceConfigurations()
      let installTasks = tasks.filter(t => t.content === "INSTALL")
      newInstallTasks = await this.addServices(installTasks, services)
    }
    if (jobs.includes("MODIFY")) {
      let services = await this.readServiceConfigurations()
      let modifyTasks = tasks.filter(t => t.content === "MODIFY")
      await this.modifyServices(modifyTasks, services, newInstallTasks)
    }
  }
}