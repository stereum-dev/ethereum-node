import { NodeConnection } from "./NodeConnection"
import { ServiceManager } from "./ServiceManager"

export class Monitoring {
    constructor(){
        this.nodeConnection = new NodeConnection()
        this.serviceManager = new ServiceManager(this.nodeConnection)
    }

    async checkStereumInstallation(nodeConnection){
        if(!nodeConnection){
            nodeConnection = this.nodeConnection
        }
        if (nodeConnection.sshService.connected) {
            let services;
            let settings;
            try {
                settings = await nodeConnection.sshService.exec("ls /etc/stereum");
                services = await nodeConnection.listServicesConfigurations();
            } catch {
              services = [];
            }
            if (services.length != 0 && settings.stdout.includes("stereum.yaml"))
              return true;
          }
          return false;
    }

    async refreshServiceInfos(){
        if(await this.checkStereumInstallation()){
            const serviceConfigs = (await this.serviceManager.readServiceConfigurations()).filter(s => s.service != "PrometheusNodeExporterService")
            const serviceStates = await this.nodeConnection.listServices()
            if(serviceConfigs  && serviceConfigs.length > 0){
                let newInfo = serviceConfigs.map(config => {
                    const newState = serviceStates.find(state => state.Names.replace("stereum-", "") === config.id)
                    return {
                        service: config.service,
                        state:  newState ? newState.State : "exited",
                        config: {
                            serviceID: config.id,
                            configVersion: config.configVersion,
                            image: config.image,
                            imageVersion: config.imageVersion,
                            ports: config.ports,
                            volumes: config.volumes,
                            network: config.network,
                        }
                    }
                })
                return newInfo
            }
        }
        return []
    }
}