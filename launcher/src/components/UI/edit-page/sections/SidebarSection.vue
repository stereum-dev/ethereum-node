<template>
  <aside class="flex flex-col items-center w-18 h-full bg-[#33393E]" @pointerdown.prevent.stop @mousedown.prevent.stop>
    <div class="w-full grid grid-rows-3 mt-20 p-1 gap-y-5">
      <router-link
        v-if="!routerHovered"
        to="/node"
        class="col-span-1 row-start-1 row-end-2 p-1 rounded-md text-gray-700 focus:outline-nones transition-colors duration-200 hover:bg-[#23272a]"
        @mouseover="routerHovered = true"
      >
        <img class="w-7" src="/img/icon/arrows/left-1.png" alt="Manage Icon" />
      </router-link>
      <router-link v-else to="/node" class="showManageBtn" @mouseleave="routerHovered = false">
        <img class="w-7 mr-1" src="/img/icon/arrows/left-1.png" alt="Manage Icon" />
        <span class="text-sm text-gray-200 font-semibold">Back to Node</span>
      </router-link>
      <button v-if="isloading" class="row-start-2 row-end-3 p-1 rounded-md relative">
        <img v-if="loading" src="/img/icon/task-manager-icons/turning_circle_blue.gif" alt="loading" />
      </button>
      <button
        v-else-if="checkStatus && !powerHovered"
        class="row-start-2 row-end-3 p-1 rounded-md"
        @mouseenter="powerHovered = true"
        @click="showPowerModal"
      >
        <img class="w-6" src="/img/icon/node-icons/turn_on.png" alt="Stop Icon" />
      </button>

      <button
        v-else-if="checkStatus && powerHovered"
        class="showPowerBtn"
        @mouseleave="powerHovered = false"
        @click="showPowerModal"
      >
        <img class="w-7 mr-1" src="/img/icon/node-icons/turn_on.png" alt="Stop Icon" />
        <span class="text-sm text-gray-200 font-semibold">Turn Node On</span>
      </button>
      <button
        v-else-if="!checkStatus && !powerHovered"
        class="row-start-2 row-end-3 p-1 rounded-md text-gray-700 focus:outline-nones transition-colors duration-200 hover:bg-[#23272a]"
        @mouseenter="powerHovered = true"
        @click="showPowerModal"
      >
        <img class="w-6" src="/img/icon/node-icons/power2.png" alt="Stop Icon" />
      </button>

      <button
        v-else-if="!checkStatus && powerHovered"
        class="showPowerBtn"
        @mouseleave="powerHovered = false"
        @click="showPowerModal"
      >
        <img class="w-6 mr-1" src="/img/icon/node-icons/power2.png" alt="Stop Icon" />
        <span class="text-sm text-gray-200 font-semibold">Turn Node Off</span>
      </button>

      <button
        v-if="!exportHovered"
        class="row-start-3 row-end-4 p-1 rounded-md text-gray-700 focus:outline-nones transition-colors duration-200 hover:bg-[#23272a]"
        @mouseenter="exportHovered = true"
        @click="exportConfig"
      >
        <img class="w-8" src="/img/icon/node-icons/export_config.png" alt="Export Icon" />
      </button>
      <button v-else class="showExportBtn" @mouseleave="exportHovered = false" @click="exportData">
        <img class="w-7 mr-1" src="/img/icon/node-icons/export_config.png" alt="Export Icon" />
        <span class="text-sm text-gray-200 font-semibold">Export Node</span>
      </button>
    </div>
    <StateModal
      v-if="runNodePowerModal"
      :main-icon="checkStatus"
      @close-window="closeUpdatePowerStateModal"
      @turn-on="stateButtonHandler('started')"
      @turn-off="stateButtonHandler('stopped')"
    />
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
const JSZip = require("jszip");
const saveAs = require("file-saver");
// import PluginLogs from "../components/PluginLogs.vue";
import { useNodeStore } from "@/store/theNode";
import StateModal from "../components/modals/StateModal.vue";

export default {
  components: {
    StateModal,
  },
  data() {
    return {
      stereumConfig: [],
      routerHovered: false,
      powerHovered: false,
      exportHovered: false,
      isNodeOff: false,
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
    ...mapWritableState(useNodeStore, {
      runNodePowerModal: "runNodePowerModal",
      hideConnectedLines: "hideConnectedLines",
    }),
    ...mapState(useControlStore, {
      ServerName: "ServerName",
      ipAddress: "ipAddress",
    }),
    checkStatus() {
      let servicesToManage = this.installedServices.filter((service) => service.name !== "Notifications");

      return !servicesToManage.some((s) => s.state == "running");
    },

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
  beforeMount() {
    this.exportConfig();
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
    openUpdatePowerStateModal() {
      this.updatePowerState = true;
    },
    closeUpdatePowerStateModal() {
      this.hideConnectedLines = false;
      this.runNodePowerModal = false;
    },
    showPowerModal() {
      this.hideConnectedLines = true;
      this.runNodePowerModal = true;
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

    async stateButtonHandler(state) {
      this.loading = true;
      this.closeUpdatePowerStateModal();
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
    exportData() {
      this.exportHovered = false;
      if (this.stereumConfig.length > 0) {
        const zip = new JSZip();
        const randomNumber = Math.floor(Math.random() * 10000);

        this.stereumConfig.forEach((item) => {
          const filenameWithRandomNumber = `stereum_config_${randomNumber}.json`;
          zip.file(filenameWithRandomNumber, item.content);
        });

        zip.generateAsync({ type: "blob" }).then(function (blob) {
          saveAs(blob, `stereum_config_${randomNumber}.zip`);
        });
      }
    },

    async exportConfig() {
      this.stereumConfig = await ControlService.exportConfig();
    },
  },
};
</script>

<style scoped>
.showManageBtn {
  grid-column: 1;
  grid-row: 1/2;
  position: absolute;
  border: 1px solid rgb(71, 75, 80);
  padding: 5px;
  border-radius: 5px;
  width: max-content;
  min-height: 35px;
  display: flex;
  background: #374151;
  box-shadow: 0 1px 3px 1px rgb(33, 34, 34);
  align-items: center;
  justify-content: space-evenly;
  transform: translateX(0);
  animation: fadeIn 0.5s ease-in-out;
  z-index: 100;
}
.showPowerBtn {
  grid-column: 1;
  grid-row: 2/3;
  position: absolute;
  border: 1px solid rgb(58, 61, 65);
  padding: 5px;
  border-radius: 5px;
  width: max-content;
  min-height: 35px;
  display: flex;
  background: #374151;
  box-shadow: 0 1px 3px 1px rgb(33, 34, 34);
  align-items: center;
  justify-content: space-evenly;
  transform: translateX(0);
  animation: fadeIn 0.5s ease-in-out;
  z-index: 100;
}
.showExportBtn {
  grid-column: 1;
  grid-row: 3/4;
  position: absolute;
  border: 1px solid rgb(58, 61, 65);
  padding: 5px;
  border-radius: 5px;
  width: max-content;
  min-height: 35px;
  display: flex;
  background: #374151;
  box-shadow: 0 1px 3px 1px rgb(33, 34, 34);
  align-items: center;
  justify-content: space-evenly;
  transform: translateX(0);
  animation: fadeIn 0.5s ease-in-out;
  z-index: 100;
}
.showManageBtn:active,
.showPowerBtn:active,
.showExportBtn:active {
  transform: scale(0.95);
}
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }

  100% {
    opacitx: 1;
    transform: translateX(0);
  }
}
</style>
