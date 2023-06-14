<template>
  <div class="config-node">
    <div class="server">
      <div class="serverBox">
        <div ref="nameParent" class="details">
          <span class="ipTitle">{{ $t("journalnode.serverip") }}</span>
          <span class="nameTitle">{{ $t("journalnode.servername") }}</span>
          <span class="ip">{{ ipAddress }}</span>
          <span ref="serverName" :class="{ animateServerName: checkServerNameWidth }" class="name">{{
            ServerName
          }}</span>
        </div>
      </div>
    </div>
    <div v-if="!openLog" class="configBtn">
      <router-link to="/manage" class="linkToEdit">
        <the-node-panel-btn
          img-path="/img/icon/node-journal-icons/edit-node.png"
          is-color="gold"
          width="20"
          margin-right="1"
          btn-action="logToggle"
          grid-row="1/2"
        >
          {{ $t("journalnode.edit") }}</the-node-panel-btn
        >
      </router-link>

      <the-node-panel-btn
        v-if="isloading"
        img-path="/img/icon/plugin-menu-icons/turning_circle.gif"
        is-color="grey"
        width="10"
        margin-right="5"
        btn-action="logToggle"
        grid-row="2/3"
        >{{ $t("journalnode.loading") }}</the-node-panel-btn
      >
      <the-node-panel-btn
        v-else-if="checkStatus()"
        img-path="/img/icon/node-journal-icons/turn_on.png"
        is-color="lighGreen"
        width="10"
        margin-right="5"
        btn-action="logToggle"
        grid-row="2/3"
        @btn-action="toggleModalOn"
        >{{ $t("journalnode.turnOn") }}</the-node-panel-btn
      >
      <the-node-panel-btn
        v-else
        img-path="/img/icon/node-journal-icons/power2.png"
        is-color="red"
        width="10"
        margin-right="5"
        btn-action="logToggle"
        grid-row="2/3"
        @btn-action="toggleModalOn"
        >{{ $t("journalnode.turnOff") }}</the-node-panel-btn
      >
      <the-node-panel-btn
        img-path="/img/icon/node-journal-icons/log-icon.png"
        is-color="blue"
        width="15"
        margin-right="3"
        btn-action="logToggle"
        grid-row="5/6"
        @btn-action="logToggle"
        >{{ $t("journalnode.log") }}<span class="ml-1">. . .</span></the-node-panel-btn
      >
      <the-node-panel-btn
        img-path="/img/icon/node-journal-icons/start-stop.png"
        is-color="light"
        width="15"
        margin-right="3"
        grid-row="4/5"
        @btn-action="powerToggl"
        ><span id="start">{{ $t("journalnode.start") }}</span> / <span id="stop">{{ $t("journalnode.stop") }}</span
        ><span class="ml-1">. . .</span></the-node-panel-btn
      >

      <the-node-panel-btn
        img-path="/img/icon/node-journal-icons/restart.png"
        is-color="orange"
        width="14"
        margin-right="3"
        btn-action="restartToggle"
        grid-row="3/4"
        @btn-action="restartToggle"
        >{{ $t("journalnode.restart") }}<span class="ml-1">. . .</span></the-node-panel-btn
      >
      <the-node-panel-btn
        img-path="/img/icon/plugin-menu-icons/resync.png"
        is-color="gold"
        width="12"
        margin-right="5"
        btn-action="resyncToggle"
        grid-row="6/7"
        @btn-action="resyncToggle"
        >resync<span class="ml-1">. . .</span></the-node-panel-btn
      >
    </div>

    <div v-if="openResync" class="configBtn">
      <the-node-panel-btn
        img-path="/img/icon/plugin-menu-icons/resync.png"
        is-color="light"
        width="15"
        margin-right="3"
        btn-action="logToggle"
        grid-row="1/2"
        class="btnTitle"
        >{{ $t("journalnode.log") }}</the-node-panel-btn
      >
      <the-node-panel-btn
        img-path="/img/icon/manage-node-icons/undo1.png"
        is-color="green"
        width="10"
        margin-right="5"
        btn-action="resyncToggle"
        grid-row="2/3"
        @btn-action="resyncToggle"
        >{{ $t("installOption.back") }}</the-node-panel-btn
      >
      <div class="log-navigation">
        <service-log-button
          v-for="service in resyncServices"
          :key="service"
          :client-name="service.name"
          :client-type="service.category"
          :service-icon="service.icon"
          @open-log="resyncToggleModal(service)"
        ></service-log-button>
      </div>
    </div>

    <div v-if="!openRestart && openLog" class="configBtn">
      <the-node-panel-btn
        img-path="/img/icon/node-journal-icons/log-icon.png"
        is-color="light"
        width="15"
        margin-right="3"
        btn-action="logToggle"
        grid-row="1/2"
        class="btnTitle"
        >{{ $t("journalnode.log") }}</the-node-panel-btn
      >
      <the-node-panel-btn
        img-path="/img/icon/manage-node-icons/undo1.png"
        is-color="green"
        width="10"
        margin-right="5"
        btn-action="logToggle"
        grid-row="2/3"
        @btn-action="logToggle"
        >{{ $t("installOption.back") }}</the-node-panel-btn
      >
      <div class="log-navigation">
        <service-log-button
          v-for="service in sortedServices"
          :key="service"
          :client-name="service.name"
          :client-type="service.category"
          :service-icon="service.icon"
          @open-log="displayPluginLogPage(service)"
        ></service-log-button>
      </div>
    </div>
    <div v-if="!openRestart && !openLog && openPower" class="configBtn">
      <the-node-panel-btn
        img-path="/img/icon/node-journal-icons/start-stop.png"
        is-color="orange"
        width="16"
        margin-right="3"
        btn-action="logToggle"
        grid-row="1/2"
        class="btnTitle"
        ><span id="start">start</span> / <span id="stop">stop</span></the-node-panel-btn
      >
      <the-node-panel-btn
        img-path="/img/icon/manage-node-icons/undo1.png"
        is-color="green"
        width="10"
        margin-right="5"
        btn-action="logToggle"
        grid-row="2/3"
        @btn-action="powerToggl"
        >{{ $t("installOption.back") }}</the-node-panel-btn
      >
      <div class="log-navigation">
        <service-log-button
          v-for="service in sortedServices"
          :key="service"
          :client-name="service.name"
          :client-type="service.category"
          :service-icon="service.icon"
          :disabled="serviceStateStatus(service)"
          @open-log="switchService(service)"
        ></service-log-button>
        <!-- stateHandler(service) -->
      </div>
    </div>
    <div v-if="openRestart && !openLog" class="configBtn">
      <the-node-panel-btn
        img-path="/img/icon/manage-node-icons/undo1.png"
        is-color="green"
        width="10"
        margin-right="5"
        btn-action="restartToggle"
        grid-row="2/3"
        @btn-action="restartToggle"
        >{{ $t("installOption.back") }}</the-node-panel-btn
      ><the-node-panel-btn
        img-path="/img/icon/node-journal-icons/restart.png"
        is-color="orange"
        width="14"
        margin-right="3"
        btn-action="restartToggle"
        grid-row="1/2"
        class="btnTitle"
        >{{ $t("journalnode.restart") }}</the-node-panel-btn
      >
      <div class="log-navigation">
        <service-log-button
          v-for="service in sortedServices"
          :key="service"
          :client-name="service.name"
          :client-type="service.category"
          :service-icon="service.icon"
          :disabled="serviceStateStatus(service)"
          @open-log="restartService(service)"
        >
        </service-log-button>
      </div>
    </div>
    <restart-modal
      v-if="restartModalShow"
      :title="titlePicker"
      :icon="iconPicker"
      :service="itemToRestart"
      :loading="restartLoad"
      @close-window="restartModalClose"
      @restart-confirm="modalClickHandler"
    ></restart-modal>
    <confirm-modal
      v-if="confirmModal"
      :main-icon="checkStatus()"
      @close-window="toggleModalClose"
      @power-toggle-on="stateButtonHandler('started')"
      @power-toggle-off="stateButtonHandler('stopped')"
    ></confirm-modal>
    <Transition>
      <plugin-logs v-if="isPluginLogPageActive" :item="itemToLogs" @close-log="closePluginLogsPage"></plugin-logs>
    </Transition>
  </div>
</template>

<script>
import ConfirmModal from "./ConfirmModal.vue";
import RestartModal from "./RestartModal.vue";
import ServiceLogButton from "./ServiceLogButton.vue";
import ControlService from "@/store/ControlService";
import { useControlStore } from "../../../store/theControl";
import { mapState, mapWritableState } from "pinia";
import { useServices } from "../../../store/services";
import { useNodeManage } from "../../../store/nodeManage";
import PluginLogs from "../the-node/PluginLogs.vue";

export default {
  components: {
    RestartModal,
    ServiceLogButton,
    PluginLogs,
    ConfirmModal,
  },
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
    this.serverNameWidth = this.$refs.serverName.clientWidth;
    this.nameParentWidth = this.$refs.serverName.parentElement.clientWidth;
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

<style scoped>
#start {
  color: #49b48b;
}
#stop {
  color: #df4b46;
}
.btnTitle {
  box-shadow: none !important;
  border: none !important;
  cursor: default !important;
}
.btnTitle:hover {
  background-color: #242529 !important;
  transform: none !important;
}

.log-navigation {
  grid-row: 3/8;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 230px;
  width: 100%;
  overflow-y: scroll;
  flex-direction: column;
}
.log-navigation::-webkit-scrollbar {
  width: 3px;
}

.linkToEdit {
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  display: flex;
}

.config-node {
  grid-column: 1;
  width: 100%;
  height: 100%;
  padding: 5px;
  margin-top: 1px;
  display: grid;
  background: #33393e;
  grid-template-rows: repeat(9, 1fr);
  grid-template-columns: 1fr;
  justify-content: center;
  align-items: center;
}

.server {
  grid-column: 1;
  grid-row: 1/3;
  width: 100%;
  height: 100%;
  padding: 20px 5px 10px 5px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

.serverBox {
  width: 100%;
  height: 95%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #23272a;
  border-radius: 10px;
  box-shadow: 0 1px 3px 1px #282727;
  border: 1px solid #747475;
  overflow: hidden;
  white-space: nowrap;
}

.server .details {
  width: 95%;
  height: 85%;
  border-radius: 8px;
  display: grid;
  grid-template-columns: 25% 75%;
  grid-template-rows: repeat(6, 1fr);
  overflow: hidden;
  white-space: nowrap;
}

.server .ipTitle {
  grid-column: 1/2;
  grid-row: 1/4;
  width: 100%;
  height: 100%;
  text-align: center;
  font-size: 1rem;
  font-weight: 500;
  color: #c4c4c4;
  text-transform: uppercase;
  border-radius: 5px;
  padding: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: clip;
  align-self: flex-end;
  text-align: left;
}

.server .nameTitle {
  grid-column: 1/2;
  grid-row: 4/7;
  width: 100%;
  height: 100%;
  text-align: center;
  font-size: 0.8rem;
  font-weight: 500;
  color: #c4c4c4;
  text-transform: uppercase;
  border-radius: 5px;
  padding: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: clip;
  align-self: flex-end;
  text-align: left;
}

.server .name {
  grid-column: 2/3;
  grid-row: 4/7;
  width: fit-content;
  max-width: 125px;
  height: 100%;
  text-align: center !important;
  font-size: 0.7rem;
  font-weight: 700;
  color: #dfbb06;
  text-transform: uppercase;
  border-radius: 5px;
  padding: 4px;
  padding-top: 6px;
  white-space: nowrap;
  display: inline-flex;
  overflow: visible !important;
  justify-self: center;
}

.animateServerName {
  animation: backAndForth 5s infinite;
}
@keyframes backAndForth {
  0% {
    transform: translateX(0);
  }
  10% {
    transform: translateX(0);
  }
  45% {
    transform: translateX(-50%);
  }
  55% {
    transform: translateX(-50%);
  }
  90% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(0);
  }
}
.server .ip {
  grid-column: 2/3;
  grid-row: 1/4;
  width: 100%;
  height: 100%;
  text-align: center;
  font-size: 1rem;
  font-weight: 700;
  color: #dfbb06;
  text-transform: uppercase;
  border-radius: 5px;
  padding: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: clip;
  align-self: center;
}

.configBtn {
  grid-column: 1;
  grid-row: 3/10;
  width: 95%;
  height: 96%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(8, 1fr);
  background-color: #606060;
  border-radius: 10px;
  margin: 0 auto;
  box-shadow: 0 1px 3px 1px #2a2d31;
  border: 1px solid #868686;
}

::-webkit-scrollbar {
  width: 4px;
}

/* Track */

::-webkit-scrollbar-track {
  border: 1px solid #343434;
  background: rgb(229, 161, 52);
  box-sizing: border-box;
  box-shadow: 1px 1px 10px 1px rgb(23, 23, 23);
  border-radius: 50px;
}

/* Handle */

::-webkit-scrollbar-thumb {
  background: #324b3f;
  border-radius: 50%;
}
</style>
