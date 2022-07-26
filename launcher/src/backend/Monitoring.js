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

    //serverNmae
    //totalRam, usedRam
    //availDisk, usedDisk, used%
    //CPUusage
    //rx tx
    async getServerVitals() {
        const serverVitals = await this.nodeConnection.sshService.exec(`
        hostname &&
        free --mega | sed -n '2p' | awk '{print $2" "$3}' &&
        df -k |tail -n +2 | awk '{if ($6 == "/") {print $3" "$4" "$5}; }'
        sar -u 1 1 | awk '{if ($7 != "%idle") print 100.000-$NF}' | tail -1 &&
        sar -n DEV 1 1 | awk '{ if($2 == "eth0") print $5" "$6}' | sed -n '1p'
        `);
        let arr = serverVitals.stdout.split(/\n/)
        const data = {
            ServerName: arr[0],
            totalRam: arr[1].split(' ')[0],
            usedRam: arr[1].split(' ')[1],
            usedDisk: arr[2].split(' ')[0],
            availDisk: arr[2].split(' ')[1],
            usedPerc: arr[2].split(' ')[2],
            cpu: arr[3],
            rx:  arr[4].split(' ')[0],
            tx:  arr[4].split(' ')[1],
          }

        return data;
      }
}