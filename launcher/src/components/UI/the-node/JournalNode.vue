<template>
  <div class="config-node">
    <div class="server">
      <div class="serverBox">
        <div class="details">
          <span class="ipTitle">{{ $t("journalnode.serverip") }}</span>
          <span class="nameTitle">{{ $t("journalnode.servername") }}</span>
          <span class="ip">{{ ipAddress }}</span>
          <span class="name">{{ ServerName }}</span>
        </div>
      </div>
    </div>
    <div class="configBtn" v-if="!openLog">
      <router-link to="/manage" class="linkToEdit">
        <the-node-panel-btn
          imgPath="/img/icon/node-journal-icons/edit-node.png"
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
        imgPath="/img/icon/plugin-menu-icons/turning_circle.gif"
        is-color="grey"
        width="10"
        margin-right="5"
        btn-action="logToggle"
        grid-row="2/3"
        v-if="isloading"
        >{{ $t("journalnode.loading") }}</the-node-panel-btn
      >
      <the-node-panel-btn
        imgPath="/img/icon/node-journal-icons/turn_on.png"
        is-color="lighGreen"
        width="10"
        margin-right="5"
        btn-action="logToggle"
        grid-row="2/3"
        v-else-if="checkStatus()"
        @btn-action="stateButtonHandler('started')"
        >{{ $t("journalnode.turnOn") }}</the-node-panel-btn
      >
      <the-node-panel-btn
        imgPath="/img/icon/node-journal-icons/power2.png"
        is-color="red"
        width="10"
        margin-right="5"
        btn-action="logToggle"
        grid-row="2/3"
        v-else
        @btn-action="stateButtonHandler('stopped')"
        >{{ $t("journalnode.turnOff") }}</the-node-panel-btn
      >
      <the-node-panel-btn
        imgPath="/img/icon/node-journal-icons/logs_icon.svg"
        is-color="light"
        width="15"
        margin-right="3"
        btn-action="logToggle"
        grid-row="3/4"
        @btn-action="logToggle"
        v-if="tillTheNextRelease"
        >{{ $t("journalnode.log") }}</the-node-panel-btn
      >
      <the-node-panel-btn
        imgPath="/img/icon/plugin-menu-icons/restart.png"
        is-color="light"
        width="15"
        margin-right="3"
        btn-action="restartToggle"
        grid-row="4/4"
        @btn-action="restartToggle"
        v-if="tillTheNextRelease"
        >{{ $t("journalnode.restart") }}</the-node-panel-btn
      >
    </div>
    <div class="configBtn" v-if="!openRestart && openLog">
      <the-node-panel-btn
        imgPath="/img/icon/manage-node-icons/undo1.png"
        is-color="green"
        width="10"
        margin-right="5"
        btn-action="logToggle"
        grid-row="1/2"
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
    <div class="configBtn" v-if="openRestart && !openLog">
      <the-node-panel-btn
        imgPath="/img/icon/manage-node-icons/undo1.png"
        is-color="green"
        width="10"
        margin-right="5"
        btn-action="restartToggle"
        grid-row="1/2"
        @btn-action="restartToggle"
        >{{ $t("installOption.back") }}</the-node-panel-btn
      >
      <div class="log-navigation">
        <service-log-button
          v-for="service in sortedServices"
          :key="service"
          :client-name="service.name"
          :client-type="service.category"
          :service-icon="service.icon"
          @open-log="restartService(service.name)"
        >
        </service-log-button>
        <restart-modal
          v-if="restartModalShow"
          @close-window="restartModalClose"
          name="hallo"
          id="1234"
        ></restart-modal>
      </div>
    </div>
    <Transition>
      <plugin-logs
        :item="itemToLogs"
        v-if="isPluginLogPageActive"
        @close-log="closePluginLogsPage"
      ></plugin-logs>
    </Transition>
  </div>
</template>

<script>
import RestartModal from "./RestartModal.vue";
import ServiceLogButton from "./ServiceLogButton.vue";
import ServiceRestartButton from "./ServiceRestartButton.vue";
import ControlService from "@/store/ControlService";
import UpdateTable from "./UpdateTable.vue";
import { mapState } from "pinia";
import { useControlStore } from "../../../store/theControl";
import { useServices } from "../../../store/services";
import PluginLogs from "../the-node/PluginLogs.vue";

export default {
  components: {
    RestartModal,
    UpdateTable,
    ServiceLogButton,
    PluginLogs,
    ServiceRestartButton,
  },
  data() {
    return {
      loading: false,
      updateTableIsOpen: false,
      openLog: false,
      openRestart: false,
      itemToLogs: {},
      isPluginLogPageActive: false,
      //this data is dummy for invisible the log btn till the next release
      tillTheNextRelease: true,
      restartModalShow: false,
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
    ...mapState(useServices, {
      installedServices: "installedServices",
    }),
    ...mapState(useControlStore, {
      ServerName: "ServerName",
      ipAddress: "ipAddress",
    }),
    sortedServices() {
      return this.installedServices.sort((a, b) => {
        if (a.category === "consensus") return -1;
        if (b.category === "consensus") return 1;
        if (a.category === "execution") return -1;
        if (b.category === "execution") return 1;
        if (a.category === "validator") return -1;
        if (b.category === "validator") return 1;
        return 0;
      });
    },
  },

  methods: {
    displayPluginLogPage(el) {
      this.itemToLogs = el;
      this.isPluginLogPageActive = true;
    },
    restartService(el) {
      console.log(el);
      this.restartModalShow = true;
    },
    closePluginLogsPage(el) {
      this.itemToLogs = el;
      this.isPluginLogPageActive = true;
      this.isPluginLogPageActive = false;
    },
    logToggle() {
      this.openLog = !this.openLog;
    },
    restartToggle() {
      this.openRestart = !this.openRestart;
      console.log();
    },
    restartModalClose() {
      this.restartModalShow = false;
    },
    checkStatus() {
      return !this.installedServices.some((s) => s.state == "running");
    },
    async stateButtonHandler(state) {
      this.loading = true;
      try {
        let promises = this.installedServices.map(async (service, index) => {
          new Promise((resolve) => setTimeout(resolve, index * 1000)).then(
            () => {
              ControlService.manageServiceState({
                id: service.config.serviceID,
                state: state,
              });
            }
          );
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
  },
};
</script>

<style scoped>
.test {
  display: flex;
}

.log-navigation {
  grid-row: 2/8;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  flex-direction: column;
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
  background-color: #2d3134;
  border-radius: 10px;
  box-shadow: 1px 1px 3px 1px #282727;
  border: 1px solid #4c4848;
}

.server .details {
  width: 95%;
  height: 85%;
  border-radius: 8px;
  display: grid;
  grid-template-columns: 40% 60%;
  grid-template-rows: repeat(6, 1fr);
}

.server .ipTitle {
  grid-column: 1/2;
  grid-row: 2/4;
  width: 100%;
  height: 100%;
  text-align: center;
  font-size: 0.6rem;
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
  grid-row: 4/6;
  width: 100%;
  height: 100%;
  text-align: center;
  font-size: 0.6rem;
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
  grid-row: 4/6;
  width: 100%;
  height: 100%;
  text-align: center;
  font-size: 0.6rem;
  font-weight: 700;
  color: #cfaf65;
  text-transform: uppercase;
  border-radius: 5px;
  padding: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: clip;
  align-self: center;
}

.server .ip {
  grid-column: 2/3;
  grid-row: 2/4;
  width: 100%;
  height: 100%;
  text-align: center;
  font-size: 0.7rem;
  font-weight: 700;
  color: #cfaf65;
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
  box-shadow: 1px 1px 3px 1px #282727;
  border: 1px solid #4c4848;
}

::-webkit-scrollbar {
  width: 4px;
}

/* Track */

::-webkit-scrollbar-track {
  border: 1px solid #343434;
  background: rgb(42, 42, 42);
  box-sizing: border-box;
  box-shadow: 1px 1px 10px 1px rgb(23, 23, 23);
  border-radius: 50%;
}

/* Handle */

::-webkit-scrollbar-thumb {
  background: #324b3f;
  border-radius: 50%;
}
</style>
