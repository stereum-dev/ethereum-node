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
  data() {
    return {
      failed: false,
      checked: false,
      polling: null,
    };
  },
  components: { PagesNav, IconsNav, ServiceLinks },
  mounted() {
    this.refreshServiceStates();
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
      network: "network",
    }),
    ...mapWritableState(useNodeHeader, {
      headerServices: "runningServices",
      forceUpdateCheck: "forceUpdateCheck",
      stereumUpdate: "stereumUpdate",
      refresh: "refresh",
      isUpdateAvailable: "isUpdateAvailable",
      updating: "updating",
    }),
  },
  methods: {
    refreshServiceStates: async function () {
      if (await this.checkConnection()) {
        if (this.refresh) {
          let services = await ControlService.refreshServiceInfos();
          if (services && services.length != 0 && this.refresh) {
            let otherServices = [];
            let needForTunnel = [];
            const newServices = services.map((service) => {
              let oldService;
              if (
                this.installedServices
                  .map((s) => s.config.serviceID)
                  .includes(service.config.serviceID)
              ) {
                oldService = this.installedServices.find(
                  (s) =>
                    s.service === service.service &&
                    s.config.serviceID &&
                    s.config.serviceID === service.config.serviceID
                );
              } else {
                oldService = this.allServices.find(
                  (s) => s.service === service.service
                );
                needForTunnel.push(oldService);
              }
              if (oldService.config.keys) {
                oldService.config = {
                  ...service.config,
                  keys: oldService.config.keys,
                };
              } else {
                oldService.config = service.config;
              }
              oldService.state = service.state;
              if (oldService.name === "Teku" || oldService.name === "Nimbus") {
                let vs = this.allServices.find(
                  (element) =>
                    element.service === oldService.name + "ValidatorService"
                );
                vs.config = oldService.config;
                vs.state = oldService.state;
                otherServices.push(vs);
              }
              return oldService;
            });
            this.installedServices = newServices.concat(otherServices);
            let beaconService = this.installedServices.find(
              (s) => s.category === "consensus"
            );
            if (beaconService && beaconService.config.network === "mainnet") {
              this.network = "mainnet";
            } else {
              this.network = "testnet";
            }
            if (needForTunnel.length != 0 && this.refresh) {
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
            } else if (this.refresh) {
              this.headerServices = this.installedServices.filter(
                (service) => service.headerOption
              );
            }
          }
          if (await ControlService.checkStereumInstallation()) {
            await this.checkUpdates(services);
          }
        }
      }
    },

    checkUpdates: async function () {
      if ((!this.failed && !this.checked) || this.forceUpdateCheck) {
        let updates = [];
        let stereumUpdate = {};
        let services = await ControlService.getServices();
        let response;
        let stereumVersion;
        try {
          response = await ControlService.checkUpdates();
          stereumVersion = (
            await ControlService.getCurrentStereumVersion()
          ).replace("\n", "");
          this.versions = response;
          this.stereumVersion = stereumVersion;
        } catch (err) {
          this.failed = true;
          console.log("Couldn't fetch versions...\nError:", err.message);
        }

        this.isUpdateAvailable = false;
        if (response && services && services.length > 0) {
          services.forEach((service) => {
            if (
              service.imageVersion !=
              response[service.network][service.service][
                response[service.network][service.service].length - 1
              ]
            ) {
              this.isUpdateAvailable = true;
              updates.push({
                id: service.id,
                name: service.service.replace(
                  /(Beacon|Validator|Service)/gm,
                  ""
                ),
                version:
                  response[service.network][service.service][
                    response[service.network][service.service].length - 1
                  ],
              });
              console.log("Service Update Available!");
            }
          });
        }
        //******* the (IF) didn't work,I commented it out
        if (response && stereumVersion) {
          // if (
          //   stereumVersion !=
          //   response.stereum[response.stereum.length - 1].commit
          // ) {
          if (
            stereumVersion !=
            response.stereum[response.stereum.length - 1].commit
          ) {
            this.isUpdateAvailable = true;
          }
          const currentVersion = response.stereum.find(
            (v) => v.commit === stereumVersion
          );
          stereumUpdate = {
            commit: response.stereum[response.stereum.length - 1].commit,
            name: "Stereum",
            version: response.stereum[response.stereum.length - 1].name,
            current: currentVersion ? currentVersion.name : "-",
            current_commit: currentVersion ? currentVersion.commit : "-",
          };

          console.log("Stereum Update Available!");
          // }
        }
        this.checked = true;
        this.newUpdates = updates;
        this.stereumUpdate = stereumUpdate;
        this.forceUpdateCheck = false;
      }
    },
    async checkConnection() {
      if (!this.updating) {
        let connected = await ControlService.checkConnection();
        if (!connected) {
          console.log("Reconnecting...");
          await ControlService.reconnect();
          this.forceUpdateCheck = true;
        }
        return connected;
      }
      return false;
    },
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
