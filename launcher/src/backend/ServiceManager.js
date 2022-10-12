import { LighthouseBeaconService } from './ethereum-services/LighthouseBeaconService'
import { LighthouseValidatorService } from './ethereum-services/LighthouseValidatorService'
import { GethService } from './ethereum-services/GethService'
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
  constructor (nodeConnection) {
    this.nodeConnection = nodeConnection
  }

  /**
     * Set the desired state of a service.
     *
     * @param serviceId service's id
     * @param state a string with the desired state, see serivceState
     * @returns an object containing a reference to the ansible process output, usable with NodeConnection.playbookStatus
     */
  manageServiceState (serviceId, state) {
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
    return this.nodeConnection.runPlaybook(state.replace("ed","ing Service"), extraVars)
  }

  /**
     * Read the service configurations.
     *
     * @returns an array of all service configurations
     */
  readServiceConfigurations () {
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
          } else if (config.service == 'GethService') {
            services.push(GethService.buildByConfiguration(config))
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
          }else if (config.service == 'TekuBeaconService') {
            services.push(TekuBeaconService.buildByConfiguration(config))
          }
        } else {
          log.error('found configuration without service!')
          log.error(config)
          throw new Error('configuration without service specified')
        }
      }
      //retrieve full service out of minimal config
      services.forEach(service => {
        if(service.dependencies.executionClients.length > 0){
          service.dependencies.executionClients = service.dependencies.executionClients.map(client => {
            return services.find(dependency => dependency.id === client.id)
          })
        }
        if(service.dependencies.consensusClients.length > 0){
          service.dependencies.consensusClients = service.dependencies.consensusClients.map(client => {
            return services.find(dependency => dependency.id === client.id)
          })
        }
        if(service.dependencies.prometheusNodeExporterClients.length > 0){
          service.dependencies.prometheusNodeExporterClients = service.dependencies.prometheusNodeExporterClients.map(client => {
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

  async chooseServiceAction(action, service, data){
    switch (action) {
      case "pruneGeth":
        if(service.service === "GethService"){
          let data = service.yaml + "\nisPruning: true"
          await this.nodeConnection.writeServiceYAML({id: service.config.serviceID, data: data , service: service.service})
          this.nodeConnection.runPlaybook("Pruning Geth", {stereum_role: 'prune-geth', geth_service: service.config.serviceID})
        }
        break;
    
      case "reSync":
          //initiate resync
        break;
  
      default:
        break;
    }
  }

  removeDependencies(service, serviceToDelete){
    //update command
    service.command = this.removeCommandConnection(service.command, serviceToDelete.id)
    
    //update volumes
    service.volumes = service.volumes.filter(v => !v.destinationPath.includes(serviceToDelete.id))

    //update dependencies arrays
    for(const dependency in service.dependencies){
      service.dependencies[dependency] = service.dependencies[dependency].filter(s => s.id != serviceToDelete.id)
    }
    return service
  }
  
  removeCommandConnection(command, id){
    let isString = false
    if(typeof command === "string"){
      isString = true
      command = command.replaceAll(/\n/gm, '').replaceAll(/\s\s+/gm, ' ').split(' ')
    }
    let includesID = command.filter(c => c.includes(id))
    command = command.filter(c => !includesID.includes(c))

    let newProps = includesID.map(c => {
      let command = c.match(/.*=/)[0]
      let value = c.replace(command,'')
      let quotes = false
      if(value.startsWith('"') && value.endsWith('"')){
        quotes = true
        value = value.substring(1, value.length-1)
      }
      let newValue = value.split(',').filter(e => !e.includes(id)).join()
      if(quotes)
        newValue = '"' + newValue + '"'
      return command + newValue
    })
    if(isString)
      return (command.concat(newProps)).join(' ')
    return command.concat(newProps)
  }

  async deleteService(task, tasks, services){
    let serviceToDelete = services.find(service => service.id === task.service.config.serviceID)
    let dependents = []
    services.forEach(service => {
      for(const dependency in service.dependencies){
        service.dependencies[dependency].forEach(s => {
          if(s.id === serviceToDelete.id)
            dependents.push(service)
        })
      }
    })
    log.info(dependents)
    dependents.forEach(service => {
      service = this.removeDependencies(service, serviceToDelete)
      this.nodeConnection.writeServiceConfiguration(service.buildConfiguration())
    })
    await this.nodeConnection.runPlaybook("Delete Service", {stereum_role: 'delete-service', service: task.service.config.serviceID})
}

  addService(task){
    switch(task.service.service){
      
    }
  }

  static uniqueByID(job){
    return (value, index, self) => self.map(t => t.service.config.serviceID).indexOf(value.service.config.serviceID) === index && value.content === job
  }
    
  async modifyServices(tasks){
    let jobs = tasks.map(t => t.content)
    let services = await this.readServiceConfigurations()
    if(jobs.includes("DELETE")){
      let before = this.nodeConnection.getTimeStamp()
      try{
        await Promise.all(tasks.filter(ServiceManager.uniqueByID("DELETE")).map((task, index, tasks) => {return this.deleteService(task, tasks, services)}))
      } catch(err){
        log.error("Deleting Services Failed:", err)
      } finally {
        let after = this.nodeConnection.getTimeStamp()
        await this.nodeConnection.restartServices(after - before)
      }
    } else if (jobs.includes("INSTALL")){
      log.info(tasks)
    }
  }
}

