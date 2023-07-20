<template>
  <aside
    class="flex flex-col items-center w-16 h-full overflow-y-auto border-r rtl:border-l rtl:border-r-0 bg-[#33393E] border-gray-700"
  >
    <div class="flex flex-col space-y-6">
      <router-link
        to="/manage"
        class="p-1.5 text-gray-700 focus:outline-nones transition-colors duration-200 rounded-lg dark:text-gray-200 dark:hover:bg-gray-800 hover:bg-gray-100"
      >
        <img class="w-4 rounded-full" src="/img/icon/node-icons/edit-node.png" alt="Manage Icon" />
      </router-link>
      <router-link
        to="#"
        class="p-1.5 text-gray-700 focus:outline-nones transition-colors duration-200 rounded-lg dark:text-gray-200 dark:hover:bg-gray-800 hover:bg-gray-100"
      >
        <img class="w-3 rounded-full" src="/img/icon/node-icons/turn_on.png" alt="Stop Icon" />
        <img class="w-3 rounded-full" src="/img/icon/node-icons/power2.png" alt="Stop Icon" />
      </router-link>
      <router-link
        to="#"
        class="p-1.5 text-gray-700 focus:outline-nones transition-colors duration-200 rounded-lg dark:text-gray-200 dark:hover:bg-gray-800 hover:bg-gray-100"
      >
        <img class="w-3 rounded-full" src="/img/icon/node-icons/export_config.png" alt="Export Icon" />
      </router-link>
    </div>
  </aside>
</template>
<script>
// // import ConfirmModal from "../components/ConfirmModal.vue";
// // import RestartModal from "../components/RestartModal.vue";
// // import ServiceLogButton from "../components/ServiceLogButton.vue";
import ControlService from "@/store/ControlService";
import { useControlStore } from "@/store/theControl";
import { mapState, mapWritableState } from "pinia";
import { useServices } from "@/store/services";
import { useNodeManage } from "@/store/nodeManage";
// import PluginLogs from "../components/PluginLogs.vue";

export default {
  components: {},
  data() {
    return {
      test: true,
      functionCondition: true,
      loading: false,
      updateTableIsOpen: false,
      openLog: false,
      openRestart: false,
      itemToLogs: {},
      isPluginLogPageActive: false,
      restartModalShow: false,
      restartTitle: "restart",
      restartIcon: "/img/icon/node-icons/restart.png",
      switchIcon: "/img/icon/node-icons/start-stop.png",
      startTitle: "start / stop",
      itemToRestart: {},
      restartLoad: false,
      openPower: false,
      serverNameWidth: null,
      nameParentWidth: null,
      confirmModal: false,
      openResync: false,
      titlePicker: "",
      iconPicker: "",
    };
  },

  computed: {
    isloading: {
      // getter
      get: function () {
        return this.loading ? true : false;
      },
      // setter
      set: function (newValue) {
        this.loading = newValue;
      },
    },
    ...mapWritableState(useNodeManage, {
      resyncSeparateModal: "resyncSeparateModal",
      selectedServiceToResync: "selectedServiceToResync",
    }),
    ...mapState(useServices, {
      installedServices: "installedServices",
    }),
    ...mapState(useControlStore, {
      ServerName: "ServerName",
      ipAddress: "ipAddress",
    }),

    sortedServices() {
      const copyOfInstalledServices = [...this.installedServices];

      return copyOfInstalledServices.sort((a, b) => {
        if (a.category === "execution") return -1;
        if (b.category === "execution") return 1;
        if (a.category === "consensus") return -1;
        if (b.category === "consensus") return 1;
        if (a.category === "validator") return -1;
        if (b.category === "validator") return 1;
        return 0;
      });
    },
    resyncServices() {
      const copyOfInstalledServices = [...this.installedServices];
      return copyOfInstalledServices
        .filter((obj) => ["execution", "consensus"].includes(obj.category))
        .sort((a, b) => {
          if (a.category === "execution") return -1;
          if (b.category === "execution") return 1;
          if (a.category === "consensus") return -1;
          if (b.category === "consensus") return 1;

          return 0;
        });
    },

    checkServerNameWidth() {
      if (this.serverNameWidth > this.nameParentWidth) {
        return true;
      } else {
        return false;
      }
    },
  },
  mounted() {
    // this.serverNameWidth = this.$refs.serverName.clientWidth;
    // this.nameParentWidth = this.$refs.serverName.parentElement.clientWidth;
  },
  methods: {
    serviceStateStatus(item) {
      return item.serviceIsPending ? true : false;
    },
    displayPluginLogPage(el) {
      this.itemToLogs = el;
      this.isPluginLogPageActive = true;
    },

    restartService(el) {
      this.itemToRestart = el;
      this.restartModalShow = true;
      this.titlePicker = this.restartTitle;
      this.iconPicker = this.restartIcon;
      this.functionCondition = true;
    },
    switchService(el) {
      this.itemToRestart = el;
      this.restartModalShow = true;
      this.titlePicker = this.startTitle;
      this.iconPicker = this.switchIcon;
      this.functionCondition = false;
    },
    modalClickHandler(el) {
      return this.functionCondition ? this.restartConfirmed(el) : this.stateHandler(el);
    },
    resyncToggleModal(el) {
      this.resyncSeparateModal = true;
      this.selectedServiceToResync = el;
    },
    closePluginLogsPage(el) {
      this.itemToLogs = el;
      this.isPluginLogPageActive = true;
      this.isPluginLogPageActive = false;
    },
    logToggle() {
      this.openLog = !this.openLog;
    },
    powerToggl() {
      this.openPower = !this.openPower;
    },
    restartToggle() {
      this.openRestart = !this.openRestart;
    },
    resyncToggle() {
      this.openResync = !this.openResync;
    },
    restartModalClose() {
      this.restartModalShow = false;
    },
    toggleModalClose() {
      this.confirmModal = false;
    },
    toggleModalOn() {
      this.confirmModal = true;
    },
    async restartConfirmed(service) {
      this.restartLoad = true;
      service.yaml = await ControlService.getServiceYAML(service.config.serviceID);
      if (!service.yaml.includes("isPruning: true")) {
        this.isServiceOn = false;
        service.serviceIsPending = true;
        let state = "stopped";
        if (service.state === "exited") {
          state = "started";
          this.isServiceOn = true;
        }
        try {
          await ControlService.manageServiceState({
            id: service.config.serviceID,
            state: "stopped",
          });
          await ControlService.manageServiceState({
            id: service.config.serviceID,
            state: "started",
          });
        } catch (err) {
          console.log(state.replace("ed", "ing") + " service failed:\n", err);
        }
        service.serviceIsPending = false;
        this.updateStates();
      }
    },
    updateStates: async function () {
      let serviceInfos = await ControlService.listServices();
      this.installedServices.forEach((s, idx) => {
        let updated = false;
        serviceInfos.forEach((i) => {
          if (i.Names.replace("stereum-", "") === s.config.serviceID) {
            this.installedServices[idx].state = i.State;
            updated = true;
            this.restartModalClose();
            this.restartLoad = false;
          }
        });
        if (!updated) {
          this.installedServices[idx].state = "exited";
        }
      });
      this.restartModalShow = false;
    },
    checkStatus() {
      let servicesToManage = this.installedServices.filter((service) => service.name !== "Notifications");

      return !servicesToManage.some((s) => s.state == "running");
    },
    async stateButtonHandler(state) {
      this.loading = true;
      this.toggleModalClose();
      try {
        //this is the temporary solution until notification service is exiting correctly
        let servicesToManage = this.installedServices.filter((service) => service.name !== "Notifications");

        let promises = servicesToManage.map(async (service, index) => {
          new Promise((resolve) => setTimeout(resolve, index * 1000)).then(() => {
            ControlService.manageServiceState({
              id: service.config.serviceID,
              state: state,
            });
          });
        });
        promises.push(
          new Promise((resolve) =>
            setTimeout(() => {
              this.loading = false;
              resolve();
            }, promises.length * (state == "running" ? 8000 : 4000))
          )
        );
        Promise.all(promises);
      } catch (err) {
        console.log(state.replace("ed", "ing") + " services failed:\n", err);
      }
    },
    stateHandler: async function (item) {
      this.restartModalShow = false;
      item.yaml = await ControlService.getServiceYAML(item.config.serviceID);
      if (!item.yaml.includes("isPruning: true")) {
        item.serviceIsPending = true;
        let state = "stopped";
        if (item.state === "exited") {
          state = "started";
        }
        try {
          await ControlService.manageServiceState({
            id: item.config.serviceID,
            state: state,
          });
        } catch (err) {
          console.log(state.replace("ed", "ing") + " service failed:\n", err);
        }
        item.serviceIsPending = false;
      }
    },
  },
};
</script>
