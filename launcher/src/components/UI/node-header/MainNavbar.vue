<template>
  <nav class="main-nav1">
    <pages-nav></pages-nav>
    <service-links></service-links>
    <icons-nav></icons-nav>
  </nav>
</template>
<script>
import PagesNav from "./PagesNav.vue";
import IconsNav from "./IconsNav.vue";
import ServiceLinks from "./ServiceLinks.vue";
import ControlService from "@/store/ControlService";
import { mapWritableState } from "pinia";
import { useNodeHeader } from "@/store/nodeHeader";
import { useServices } from "@/store/services";
export default {
  components: { PagesNav, IconsNav, ServiceLinks },
  mounted() {
    this.refreshServiceStates()
    this.polling = setInterval(this.refreshServiceStates, 2000); //refresh services
  },
  beforeUnmount() {
    clearInterval(this.polling);
  },
  computed: {
    ...mapWritableState(useServices, {
      installedServices: "installedServices",
      runningServices: "runningServices",
      allServices: "allServices",
      versions: "versions",
      stereumVersion: "stereumVersion",
      newUpdates: "newUpdates",
    }),
    ...mapWritableState(useNodeHeader, {
      headerServices: "runningServices",
      checkedForUpdates: "checkedForUpdates",
      refresh: "refresh",
      isUpdateAvailable: "isUpdateAvailable",
    }),
  },
  methods: {
    refreshServiceStates: async function(){
      if(this.refresh){
      let services = await ControlService.refreshServiceInfos()
      if(services && services.length != 0 && this.refresh){
        let otherServices = []
        let needForTunnel = []
        const newServices = services.map(service => {
          let oldService
          if(this.installedServices.map(s => s.config.serviceID).includes(service.config.serviceID)){
            oldService = this.installedServices.find(s => s.service === service.service && 
              s.config.serviceID && s.config.serviceID === service.config.serviceID)
          } else {
            oldService = this.allServices.find(s => s.service === service.service)
            needForTunnel.push(oldService)
          }
            oldService.config = service.config
            oldService.state = service.state
            if (oldService.name === "Teku" || oldService.name === "Nimbus") {
              let vs = this.allServices.find(
                (element) =>
                  element.service === oldService.name + "ValidatorService"
              );
              vs.config = oldService.config;
              vs.state = oldService.state
              otherServices.push(vs);
            }
            return oldService
        })
        this.installedServices = newServices.concat(otherServices)
        if(needForTunnel.length != 0 && this.refresh){
          let localPorts = await ControlService.getAvailablePort({
            min: 9000,
            max: 9999,
            amount: this.installedServices.filter(
              (s) => s.headerOption && s.tunnelLink
            ).length,
          });

          this.headerServices = this.installedServices
            .filter((service) => service.headerOption)
            .map((service) => {
              if (service.tunnelLink) {
                service.linkUrl = "http://localhost:" + localPorts.pop();
              }
              return service;
            });

          let ports = this.headerServices
            .filter((service) => service.tunnelLink)
            .map((service) => {
              return {
                dstPort: service.config.ports[0].servicePort,
                localPort: service.linkUrl.split(":").pop(),
              };
            });

          await ControlService.openTunnels(ports);
        } else if (this.refresh){
          this.headerServices = this.installedServices
            .filter((service) => service.headerOption)
        }
      }
      if(Object.keys(this.versions).length === 0 && await ControlService.checkStereumInstallation()){
        await this.checkUpdates(services)
      }
    }
    },
    checkUpdates: async function(){
      let updates = []
      let services = await ControlService.getServices()
      let response = await ControlService.checkUpdates()
      let stereumVersion = (await ControlService.getCurrentStereumVersion()).replace('\n', '')
      this.versions = response
      this.stereumVersion = stereumVersion
      this.isUpdateAvailable = false

      services.forEach(service => {
        if(service.imageVersion != response[service.network][service.service][response[service.network][service.service].length - 1]){
          this.isUpdateAvailable = true
          updates.push({id: service.id, name: service.service.replace(/(Beacon|Validator|Service)/gm, ''), version: response[service.network][service.service][response[service.network][service.service].length - 1]})
          console.log("Service Update Available!")
        }
      })
      if(stereumVersion != response.stereum[response.stereum.length - 1].commit){
        this.isUpdateAvailable = true
        updates.push({ commit: response.stereum[response.stereum.length - 1].commit, name: "Stereum", version: response.stereum[response.stereum.length - 1].name})
        console.log("Stereum Update Available!")
      }
      this.newUpdates = updates
    }
  },
};
</script>
<style scoped>
.main-nav1 {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
