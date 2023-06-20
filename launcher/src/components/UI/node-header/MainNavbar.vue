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
import { useNodeManage } from "@/store/nodeManage";
export default {
  components: { PagesNav, IconsNav, ServiceLinks },
  data() {
    return {
      failed: false,
      checked: false,
      polling: null,
    };
  },

  computed: {
    ...mapWritableState(useNodeManage, {
      networkList: "networkList",
      currentNetwork: "currentNetwork",
    }),
    ...mapWritableState(useServices, {
      installedServices: "installedServices",
      runningServices: "runningServices",
      allServices: "allServices",
      versions: "versions",
      stereumVersion: "stereumVersion",
      launcherVersion: "launcherVersion",
      newUpdates: "newUpdates",
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
  mounted() {
    this.refreshServiceStates();
    this.polling = setInterval(this.refreshServiceStates, 2000); //refresh services
  },
  beforeUnmount() {
    clearInterval(this.polling);
  },
  methods: {
    refreshServiceStates: async function () {
      const allServices = JSON.parse(JSON.stringify(this.allServices));
      if (this.refresh) {
        if (await this.checkConnection()) {
          let services = await ControlService.refreshServiceInfos();
          if (services && services.length != 0 && this.refresh) {
            let otherServices = [];
            let needForTunnel = [];
            const newServices = services.map((service) => {
              let oldService;
              if (
                this.installedServices &&
                this.installedServices.map((s) => s.config.serviceID).includes(service.config.serviceID)
              ) {
                oldService = this.installedServices.find(
                  (s) =>
                    s.service === service.service &&
                    s.config.serviceID &&
                    s.config.serviceID === service.config.serviceID
                );
              } else {
                oldService = allServices.find((s) => s.service === service.service);
                if (oldService.tunnelLink) needForTunnel.push(oldService);
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
              if (
                (oldService.service === "TekuBeaconService" || oldService.service === "NimbusBeaconService") &&
                oldService.config.configVersion &&
                oldService.config.configVersion < 2
              ) {
                let existing = this.installedServices.find(
                  (s) =>
                    s.config.serviceID === oldService.config.serviceID &&
                    s.service === oldService.name + "ValidatorService"
                );
                let vs;
                if (existing) {
                  vs = existing;
                } else {
                  vs = allServices.find((element) => element.service === oldService.name + "ValidatorService");
                }
                if (vs.service === "TekuValidatorService") {
                  vs.icon = require("/public/img/icon/plugin-icons/validator/Teku-Validator-Linked-Circle.png");
                  vs.sIcon = require("/public/img/icon/plugin-icons/validator/Teku-Validator-Linked-s.png");
                } else if (vs.service === "NimbusValidatorService") {
                  vs.icon = require("/public/img/icon/plugin-icons/validator/Nimbus-Validator-Linked-Circle.png");
                  vs.sIcon = require("/public/img/icon/plugin-icons/validator/Nimbus-Validator-Linked-s.png");
                }
                vs.config = oldService.config;
                vs.state = oldService.state;
                otherServices.push(vs);
              }
              return oldService;
            });
            this.installedServices = newServices.concat(otherServices).map((e, i) => {
              e.id = i;
              return e;
            });
            let network = this.installedServices[0]?.config.network;
            this.currentNetwork = this.networkList.find((item) => item.network === network);

            if (needForTunnel.length != 0 && this.refresh) {
              let localPorts = await ControlService.getAvailablePort({
                min: 9000,
                max: 9999,
                amount: needForTunnel.filter((s) => s.headerOption && s.tunnelLink).length,
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
                    dstPort: service.config.ports[0].destinationPort,
                    localPort: service.linkUrl.split(":").pop(),
                  };
                });

              await ControlService.openTunnels(ports);
            } else if (this.refresh) {
              this.headerServices = this.installedServices.filter((service) => service.headerOption);
            }
          } else {
            if (!this.updating) {
              this.installedServices = [];
              this.headerServices = [];
            }
          }
          if (!this.currentNetwork) {
            this.currentNetwork = this.networkList.find((item) => item.network === "goerli");
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
        let launcherVersion;
        try {
          response = await ControlService.checkUpdates();
          stereumVersion = (await ControlService.getCurrentStereumVersion()).replace("\n", "");
          launcherVersion = await ControlService.getCurrentLauncherVersion();
          this.versions = response;
          this.stereumVersion = stereumVersion;
          this.launcherVersion = launcherVersion;
        } catch (err) {
          this.failed = true;
          console.log("Couldn't fetch versions...\nError:", err.message);
        }

        this.isUpdateAvailable = false;
        if (response && services && services.length > 0) {
          services.forEach((service) => {
            if (!response[service.network] || !response[service.network][service.service]) service.network = "mainnet";
            if (!response[service.network] || !response[service.network][service.service]) service.network = "prater";
            if (response[service.network] && response[service.network][service.service]) {
              if (
                service.imageVersion !=
                response[service.network][service.service][response[service.network][service.service].length - 1]
              ) {
                this.isUpdateAvailable = true;
                updates.push({
                  id: service.id,
                  name: service.service.replace(/(Beacon|Validator|Service)/gm, ""),
                  icon: service.sIcon,
                  version:
                    response[service.network][service.service][response[service.network][service.service].length - 1],
                });
                console.log("Service Update Available!");
              }
            }
          });
        }

        if (response && stereumVersion) {
          if (stereumVersion != response.stereum[response.stereum.length - 1].commit) {
            this.isUpdateAvailable = true;
            console.log("Stereum Update Available!");
          }

          const currentVersion = response.stereum.find((v) => v.commit === stereumVersion);
          stereumUpdate = {
            commit: response.stereum[response.stereum.length - 1].commit,
            name: "Stereum",
            version: response.stereum[response.stereum.length - 1].name,
            current: currentVersion ? currentVersion.name : "-",
            current_commit: currentVersion ? currentVersion.commit : "-",
          };
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
