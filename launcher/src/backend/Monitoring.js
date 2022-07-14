import { NodeConnection } from "./NodeConnection"
import { ServiceManager } from "./ServiceManager"

export class Monitoring {
    constructor(){
        this.nodeConnection = new NodeConnection()
        this.serviceManager = new ServiceManager(this.nodeConnection)
    }
    async refreshServiceInfos(){
        const serviceConfigs = await this.serviceManager.readServiceConfigurations()
        const serviceStates = await this.nodeConnection.listServices()
        let newStuff = serviceConfigs.map(config => {
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
        return newStuff
    }
}