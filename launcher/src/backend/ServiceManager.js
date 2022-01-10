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
    async manageServiceState(serviceId, state) {
        return new Promise(async (resolve, reject) => {
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
            }).then(res => {
                resolve(res);
            }).catch(res => {
                reject(res);
            });
        });
    }

    /**
     * Read the service configurations.
     *
     * @returns an array of all service configurations
     */
    async readServiceConfigurations() {
        return new Promise(async (resolve, reject) => {
            this.nodeConnection.listServicesConfigurations()
            .then(services => {
                const serviceConfigs = new Array();
                for (let i = 0; i < services.length; i++) {
                    const service = services[i];

                    this.nodeConnection.readServiceConfiguration(service).then(config => serviceConfigs.push(config));
                }

                resolve(serviceConfigs);
            });
        });
    }
}
