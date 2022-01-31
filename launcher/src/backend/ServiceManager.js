import { LighthouseBeaconService } from "./ethereum-services/LighthouseBeaconService";
import { LighthouseValidatorService } from "./ethereum-services/LighthouseValidatorService";
import { GethService } from "./ethereum-services/GethService";
import { BloxSSVService } from "./ethereum-services/BloxSSVService";

const log = require('electron-log');

/**
 * desired states of a service
 */
export const serivceState = {
    restarted: "restarted",
    started: "started",
    stopped: "stopped",
};

export class ServiceManager {

    constructor(nodeConnection) {
        this.nodeConnection = nodeConnection;
    }

    /**
     * Set the desired state of a service.
     *
     * @param serviceId service's id
     * @param state a string with the desired state, see serivceState
     * @returns an object containing a reference to the ansible process output, usable with NodeConnection.playbookStatus
     */
    manageServiceState(serviceId, state) {
        return this.nodeConnection.runPlaybook("manage-service", {
                // extra args
                stereum: {
                    manage_service: {
                        configuration: {
                            id: serviceId,
                            state: state,
                        },
                    },
                },
            });
    }

    /**
     * Read the service configurations.
     *
     * @returns an array of all service configurations
     */
    readServiceConfigurations() {
        return this.nodeConnection.listServicesConfigurations().then(services => {
            log.debug("found services:");
            log.debug(services);

            const serviceConfigurations = new Array();
            for (let i = 0; i < services.length; i++) {
                const service = services[i];

                log.debug("reading config of service <" + service + ">");

                this.nodeConnection.readServiceConfiguration(service).then(config => {
                    log.debug("read config:");
                    log.debug(config);
                    serviceConfigurations.push(config);
                    log.debug(serviceConfigurations);
                });
            }

            return serviceConfigurations;
        }).then(serviceConfigurations => {
            log.debug("proceeding with service configurations:");
            log.debug(serviceConfigurations);

            const services = new Array();

            for (let i = 0; i < serviceConfigurations.length; i++) {
                const config = serviceConfigurations[i];

                log.debug("parsing config:");
                log.debug(config);

                if (config.service) {
                    if (config.service == "LighthouseBeaconService") {
                        services.push(LighthouseBeaconService.buildByConfiguration(config));
                    } else if (config.service == "LighthouseValidatorService") {
                        services.push(LighthouseValidatorService.buildByConfiguration(config));
                    } else if (config.service == "GethService") {
                        services.push(GethService.buildByConfiguration(config));
                    } else if (config.service == "BloxSSVService") {
                        services.push(BloxSSVService.buildByConfiguration(config));
                    }
                } else {
                    log.error("found configuration without service!");
                    log.error(config);
                    throw "configuration without service specified";
                }
            }

            return services;
        });
    }
}
