import { getServiceConfigs } from "./ServiceConfigs";
import { ServiceManager } from "./ServiceManager";

export class OneClickInstall {
    async prepareNode(installationDirectory) {
        await this.nodeConnection.findStereumSettings();
        if (this.nodeConnection.settings === undefined) {
            this.nodeConnection.settings = {
                stereum:
                {
                    settings:
                    {
                        controls_install_path: '/opt/stereumnode', os_user: 'stereum', updates:
                        {
                            in_progress: '', lane: 'stable', available: '', unattended:
                                { check: true, install: false }
                        }
                    }
                }
            };
        }
        this.nodeConnection.settings.stereum.settings.controls_install_path = installationDirectory || '/opt/stereumnode'
        return await this.nodeConnection.prepareStereumNode(this.nodeConnection.settings.stereum.settings.controls_install_path);
    }

    async chooseClient(clients){
        clients = {NIMBUS: 100}
        let buffer = {};
        let sum = 0;
        Object.keys(clients).forEach(key => {
          sum += (100 / clients[key]);
        })
        Object.keys(clients).forEach(key => {
          buffer[key] = ((100 / clients[key]) / sum) * 100;
        })
        const ran = Math.random() * 100;
        let smallestDiff = Number.MAX_VALUE;
        let result = ""
        console.log(ran,buffer)
        Object.keys(buffer).forEach(key => {
          let diff = Math.abs(buffer[key] - ran)
          if(diff < smallestDiff){
            result = key;
            smallestDiff = diff;
          }
        })
        return result.toLowerCase();
      }

    async getConfigurations(){
        const beacon = getServiceConfigs(this.beaconService);
        const validator = getServiceConfigs(this.validatorService);
        const geth = getServiceConfigs("GethService");
        const prometheusNodeExporter = getServiceConfigs("PrometheusNodeExporterService");
        const prometheus = getServiceConfigs("PrometheusService", {beacon_service: beacon.id, prometheus_node_exporter_service: prometheusNodeExporter.id});
        const grafana = getServiceConfigs("GrafanaService", null, {grafana_provisioning: (this.beaconService.replace('BeaconService','')).toLowerCase()});
        if(!this.validatorService){
           return [beacon,geth,prometheusNodeExporter,prometheus,grafana];
        }
        return [beacon,validator,geth,prometheusNodeExporter,prometheus,grafana];

    }

    //ToDo: figure installDir out
    async setupNode(setup, installDir, nodeConnection) {
        this.nodeConnection = nodeConnection;
        this.serviceManager = new ServiceManager(nodeConnection);

        let choosenClient = await this.chooseClient()
        choosenClient = choosenClient.charAt(0).toUpperCase() + choosenClient.slice(1);
        this.beaconService = choosenClient + "BeaconService";
        this.executionClient = "GethService"
        this.extraServices = [];
        this.extraServices.push("PrometheusNodeExporterService","PrometheusService","GrafanaService");

        switch(setup){
            case 'staking':
                if(choosenClient !== "Nimbus" && choosenClient !== "Teku"){
                    this.validatorService = choosenClient + "ValidatorService";
                }
                break;
            case 'blox':
                    this.validatorService = "BloxService"
                break;
            case 'obol':
                if(choosenClient !== "Nimbus" && choosenClient !== "Teku"){
                    this.validatorService = choosenClient + "ValidatorService";
                }
                this.extraServices.push("ObolService")
                break;
            case 'rocket':
                this.validatorService = "RocketPoolService"
                break;
            default:
                console.log("Something went wrong");
        }
        
        await this.prepareNode(installDir);

        let configs = await this.getConfigurations();
        if (configs[0] !== undefined) {
            await Promise.all(configs.map(async (config) => {
                await this.nodeConnection.writeServiceConfiguration(config);
            }));
        }
        let services = await this.serviceManager.readServiceConfigurations();
        console.log(services);

        if (services[0] !== undefined) {
            await Promise.all(services.map(async (service) => {
                if(service.service === "GrafanaService"){
                    await this.serviceManager.manageServiceState(service.id, "started",service.env.GRAFANA_PROVISIONING);
                }else{
                    await this.serviceManager.manageServiceState(service.id, "started");
                }
            }));
        }

    }
}