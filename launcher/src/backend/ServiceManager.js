import { LighthouseBeaconService } from './ethereum-services/LighthouseBeaconService'
import { LighthouseValidatorService } from './ethereum-services/LighthouseValidatorService'
import { GethService } from './ethereum-services/GethService'
import { BloxSSVService } from './ethereum-services/BloxSSVService'
import { NimbusBeaconService } from './ethereum-services/NimbusBeaconService'
import { PrometheusService } from './ethereum-services/PrometheusService'
import { PrometheusNodeExporterService } from './ethereum-services/PrometheusNodeExporterService'
import { GrafanaService } from './ethereum-services/GrafanaService'
import { PrysmBeaconService } from './ethereum-services/PrysmBeaconService'
import { PrysmValidatorService } from './ethereum-services/PrysmValidatorService'

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
  manageServiceState (serviceId, state, grafana_provisioning) {
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
    if (grafana_provisioning !== undefined) {
      Object.assign(extraVars, { grafana_provisioning: grafana_provisioning })
    }
    return this.nodeConnection.runPlaybook('manage-service', extraVars)
  }

  /**
     * Read the service configurations.
     *
     * @returns an array of all service configurations
     */
  readServiceConfigurations () {
    return this.nodeConnection.listServicesConfigurations().then(async services => {
      log.debug('found services:')
      log.debug(services)

      const serviceConfigurations = new Array()
      for (let i = 0; i < services.length; i++) {
        const service = services[i]

        log.debug('reading config of service <' + service + '>')

        await this.nodeConnection.readServiceConfiguration(service).then(config => {
          log.debug('read config:')
          log.debug(config)
          serviceConfigurations.push(config)
          log.debug(serviceConfigurations)
        })
      }

      return serviceConfigurations
    }).then(serviceConfigurations => {
      log.debug('proceeding with service configurations:')
      log.debug(serviceConfigurations)

      const services = new Array()

      for (let i = 0; i < serviceConfigurations.length; i++) {
        const config = serviceConfigurations[i]

        log.debug('parsing config:')
        log.debug(config)
        if (config.service) {
          if (config.service == 'LighthouseBeaconService') {
            services.push(LighthouseBeaconService.buildByConfiguration(config))
          } else if (config.service == 'LighthouseValidatorService') {
            services.push(LighthouseValidatorService.buildByConfiguration(config))
          } else if (config.service == 'GethService') {
            services.push(GethService.buildByConfiguration(config))
          } else if (config.service == 'BloxSSVService') {
            services.push(BloxSSVService.buildByConfiguration(config))
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
          }
        } else {
          log.error('found configuration without service!')
          log.error(config)
          throw 'configuration without service specified'
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
    })
      .catch(err => log.error(err))
  }
}
