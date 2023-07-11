<template>
  <aside class="flex h-full flex-col justify-between w-full px-2 pt-8 bg-[#33393E]">
    <article class="rounded-lg min-h-[70px] border p-2 border-gray-800 bg-[#212629]">
      <div class="flex items-center justify-between overflow-x-hidden">
        <div>
          <p class="text-xs text-gray-400">Server Name</p>

          <p class="text-md font-medium text-yellow-500">{{ ServerName }}</p>
        </div>
      </div>
    </article>
    <article class="rounded-lg min-h-[70px] border p-2 border-gray-800 bg-[#212629]">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs text-gray-400">Server IP</p>
          <p class="text-md font-medium text-yellow-500">{{ ipAddress }}</p>
        </div>
      </div>
    </article>

    <div class="flex flex-col min-h-[300px] justify-center rounded-lg px-2 bg-[#212629]">
      <nav class="h-full -mx-1">
        <router-link
          to="/manage"
          class="flex items-center bg-[#212629] px-3 mt-2 py-2 transition-colors duration-300 transform rounded-lg text-gray-300 hover:bg-slate-600 hover:text-gray-200"
        >
          <img class="w-4 rounded-full" src="/img/icon/node-journal-icons/edit-node.png" alt="Manage Icon" />
          <span class="mx-2 text-xs font-medium">{{ $t("journalnode.edit") }}</span>
        </router-link>
        <div
          v-if="isloading"
          class="flex items-center mt-2 px-3 py-2 transition-colors duration-300 transform rounded-lg text-gray-300 hover:bg-slate-600 hover:text-gray-200 cursor-pointer"
        >
          <img class="w-3 rounded-full" src="/img/icon/plugin-menu-icons/turning_circle.gif" alt="Stop Icon" />
          <span class="mx-2 text-xs font-medium">{{ $t("journalnode.loading") }}</span>
        </div>

        <div
          v-else-if="checkStatus()"
          class="flex items-center mt-2 px-3 py-2 transition-colors duration-300 transform rounded-lg text-gray-300 hover:bg-slate-600 hover:text-gray-200 cursor-pointer"
        >
          <img class="w-3 rounded-full" src="/img/icon/node-journal-icons/turn_on.png" alt="Stop Icon" />
          <span class="mx-2 text-xs font-medium">{{ $t("journalnode.turnOn") }}</span>
        </div>

        <div
          v-else
          class="flex items-center mt-2 px-3 py-2 transition-colors duration-300 transform rounded-lg text-gray-300 hover:bg-slate-600 hover:text-gray-200 cursor-pointer"
        >
          <img class="w-3 rounded-full" src="/img/icon/node-journal-icons/power2.png" alt="Stop Icon" />
          <span class="mx-2 text-xs font-medium">{{ $t("journalnode.turnOff") }}</span>
        </div>

        <div
          class="flex items-center mt-2 px-3 py-2 transition-colors duration-300 transform rounded-lg text-gray-300 hover:bg-slate-600 hover:text-gray-200 cursor-pointer"
        >
          <img class="w-3" src="/img/icon/node-journal-icons/log-icon.png" alt="Stop Icon" />
          <span class="mx-2 text-xs font-medium">{{ $t("journalnode.log") }}</span>
        </div>

        <div
          class="flex items-center mt-2 px-3 py-2 transition-colors duration-300 transform rounded-lg text-gray-300 hover:bg-slate-600 hover:text-gray-200 cursor-pointer"
        >
          <img class="w-3 rounded-full" src="/img/icon/node-journal-icons/start-stop.png" alt="Stop Icon" />
          <p class="mx-2 text-xs font-medium text-gray-300">
            {{ $t("journalnode.start") }} <span class="mx-2 text-xs font-medium text-gray-300">/</span>
            <span class="mx-2 text-xs font-medium text-gray-300">{{ $t("journalnode.stop") }}</span>
          </p>
        </div>

        <div
          class="flex items-center mt-2 px-3 py-2 transition-colors duration-300 transform rounded-lg text-gray-300 hover:bg-slate-600 hover:text-gray-200 cursor-pointer"
        >
          <img class="w-3 rounded-full" src="/img/icon/node-journal-icons/restart.png" alt="Stop Icon" />
          <span class="mx-2 text-xs font-medium">{{ $t("journalnode.restart") }}</span>
        </div>

        <div
          class="flex items-center mt-2 px-3 py-2 transition-colors duration-300 transform rounded-lg text-gray-300 hover:bg-slate-600 hover:text-gray-200 cursor-pointer"
        >
          <img class="w-3 rounded-full" src="/img/icon/plugin-menu-icons/resync.png" alt="Resync Icon" />
          <span class="mx-2 text-xs font-medium">{{ $t("journalnode.resync") }}</span>
        </div>
      </nav>
    </div>
  </aside>
</template>
//
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
      restartIcon: "/img/icon/node-journal-icons/restart.png",
      switchIcon: "/img/icon/node-journal-icons/start-stop.png",
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
