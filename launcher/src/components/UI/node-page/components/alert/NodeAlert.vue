<template>
  <div class="status-box flex flex-col justify-between items-center">
    <div class="status-box_header h-[8%] w-full flex">
      <div class="status-box_icon-box border border-gray-600 rounded-md bg-[#151618] w-3/4 h-full flex justify-around items-center pl-1">
        <div class="icon-line flex justify-center items-center w-full h-full">
          <div
            class="status-icon"
            :class="{
              filtered: alertShowState.includes('green'),
            }"
            @click="alertPicker('green')"
            @mouseenter="cursorLocation = `filter to not show notifications`"
            @mouseleave="cursorLocation = ''"
          >
            <img src="/img/icon/node-alert-icons/green-notification.png" alt="green" />
          </div>
          <div
            class="status-icon"
            :class="{
              filtered: alertShowState.includes('yellow'),
            }"
            @click="alertPicker('yellow')"
            @mouseenter="cursorLocation = `filter to not show warnings`"
            @mouseleave="cursorLocation = ''"
          >
            <img src="/img/icon/node-alert-icons/alert-general-yellow.png" alt="green" />
          </div>
          <div
            class="status-icon"
            :class="{
              filtered: alertShowState.includes('red'),
            }"
            @click="alertPicker('red')"
            @mouseenter="cursorLocation = `filter to not show alarms`"
            @mouseleave="cursorLocation = ''"
          >
            <img src="/img/icon/node-alert-icons/alert-general-red.png" alt="green" />
          </div>
        </div>
      </div>
      <div class="status-box_vol-state w-1/4 h-full flex justify-center items-center">
        <div
          class="volBtn cursor-pointer w-8"
          @click="volToggle"
          @mouseenter="cursorLocation = `${volState ? 'mute' : 'unmute'}`"
          @mouseleave="cursorLocation = ''"
        >
          <img
            :src="volState ? '/img/icon/node-alert-icons/alert-settings.png' : '/img/icon/node-alert-icons/alert-settings-mute.png'"
            alt="green"
          />
        </div>
      </div>
    </div>

    <div class="status-box_messages bg-[#151618] border border-gray-600 rounded-md overflow-x-hidden overflow-y-auto">
      <AlertSkeleton v-for="i in skeletons" v-show="loadingAlerts" :key="i" />
      <div v-show="!loadingAlerts" class="status_innerBox overflow-x-hidden overflow-y-auto space-y-1 px-[2px]">
        <router-link v-if="storageWarning && !alertShowState.includes('yellow')" to="/control" class="status-message_yellow h-9">
          <div class="message-icon">
            <img src="/img/icon/node-alert-icons/alert-storage-yellow.png" alt="warn_storage" />
          </div>
          <div class="message-text_container">
            <div class="main-message">
              <span>{{ $t("nodeAlert.lowSpace") }}</span>
            </div>
            <div class="val-message">{{ availDisk }} GB Free</div>
          </div>
        </router-link>
        <router-link v-if="cpuWarning && !alertShowState.includes('yellow')" to="/control" class="status-message_yellow h-9">
          <div class="message-icon">
            <img src="/img/icon/node-alert-icons/alert-cpu-yellow.png" alt="warn_storage" />
          </div>
          <div class="message-text_container">
            <div class="main-message">
              <span>CPU {{ $t("nodeAlert.use") }}</span>
            </div>
            <div class="val-message">
              <span> > {{ cpu }}%</span>
            </div>
          </div>
        </router-link>
        <template v-if="pointStatus && !alertShowState.includes('yellow')">
          <router-link v-for="point in pointStatus" :key="point" to="/control" class="status-message_yellow h-9">
            <div class="message-icon">
              <img src="/img/icon/control-page-icons/PORT_LIST_ICON.png" alt="warn_storage" />
            </div>
            <div class="message-text_container">
              <div class="main-message">
                <span>{{ point }}</span>
              </div>
              <div class="val-message">
                <span> > {{ $t("nodeAlert.stats") }}</span>
              </div>
            </div>
          </router-link>
        </template>
        <router-link v-if="cpuAlarm && !alertShowState.includes('red')" to="/control" class="status-message_red h-9">
          <div class="message-icon">
            <img src="/img/icon/node-alert-icons/alert-cpu-red.png" alt="warn_storage" />
          </div>
          <div class="message-text_container">
            <div class="main-message">
              <span>CPU {{ $t("nodeAlert.use") }}</span>
            </div>
            <div class="val-message">
              <span> > {{ cpu }}%</span>
            </div>
          </div>
        </router-link>
        <!-- obol red start -->
        <template v-if="criticalObol && !alertShowState.includes('red')">
          <div
            v-for="alerCrit in criticalObol"
            :key="alerCrit"
            class="status-message_red h-9"
            @mouseenter="cursorLocation = `${alerCrit}`"
            @mouseleave="cursorLocation = ''"
          >
            <div class="message-icon">
              <img src="/img/icon/service-icons/validator/ObolCharon.png" alt="warn_obol" />
            </div>
            <div class="message-text_container">
              <div class="main-message">
                <span>{{ alerCrit }}</span>
              </div>
              <div class="val-message">
                <span>> Obol Charon</span>
              </div>
            </div>
          </div>
        </template>

        <!-- obol red end -->
        <!-- obol yellow start -->
        <template v-if="warningObol && !alertShowState.includes('yellow')">
          <div
            v-for="alerWarn in warningObol"
            :key="alerWarn"
            class="status-message_yellow h-9"
            @mouseenter="cursorLocation = `${alerWarn}`"
            @mouseleave="cursorLocation = ''"
          >
            <div class="message-icon">
              <img src="/img/icon/service-icons/validator/ObolCharon.png" alt="warn_obol" />
            </div>
            <div class="message">
              <div class="main-message text-gray-900">
                <span>{{ alerWarn }}</span>
              </div>
              <div class="val-message text-gray-900">
                <span>> Obol Charon</span>
              </div>
            </div>
          </div>
        </template>

        <!-- obol yellow end -->
        <!-- csm red start -->
        <template v-if="criticalCsm && !alertShowState.includes('red')">
          <div
            v-for="csmCrit in criticalCsm"
            :key="csmCrit"
            class="status-message_red h-9"
            @mouseenter="cursorLocation = `${csmCrit}`"
            @mouseleave="cursorLocation = ''"
          >
            <div class="message-icon">
              <img src="/img/icon/service-icons/Other/LCOM.png" alt="warn_obol" />
            </div>
            <div class="message-text_container">
              <div class="main-message">
                <span>{{ csmCrit }}</span>
              </div>
              <div class="val-message">
                <span>> {{ $t("nodeAlert.csm") }}</span>
              </div>
            </div>
          </div>
        </template>

        <!-- csm red end -->
        <!-- csm green start -->
        <template v-if="notifCsm && !alertShowState.includes('green')">
          <div
            v-for="notif in notifCsm"
            :key="notif"
            class="status-message_green h-9"
            @mouseenter="cursorLocation = `${notif}`"
            @mouseleave="cursorLocation = ''"
          >
            <div class="message-icon">
              <img src="/img/icon/service-icons/Other/LCOM.png" alt="warn_obol" />
            </div>
            <div class="message">
              <div class="main-message">
                <span>{{ notif }}</span>
              </div>

              <div class="val-message">
                <span>> {{ $t("nodeAlert.csm") }}</span>
              </div>
            </div>
          </div>
        </template>

        <!-- csm Green end -->
        <div
          v-if="connectionStatusIsPoor && (alertShowState === 'showAll' || alertShowState === 'red')"
          class="w-full h-10 grid grid-cols-12 rounded-md bg-red-700 p-1 cursor-pointer hover:bg-red-500"
          @click="callReconnectModal"
        >
          <div class="col-start-1 col-end-4 w-full h-full flex justify-center items-center p-1">
            <img class="w-8" src="/img/icon/connection-status/searching.gif" alt="WIFI Icon" />
          </div>
          <div class="col-start-5 col-span-full flex flex-col justify-center items-start">
            <span class="text-[8px] text-gray-100 font-semibold uppercase">Poor Connection</span>

            <span class="text-[8px] text-left text-gray-100 font-semibold lowercase">> Click to reconnect</span>
          </div>
        </div>

        <router-link v-if="synchronizationErrorControl && !alertShowState.includes('red')" to="/control" class="status-message_red h-9">
          <div class="message-icon">
            <img src="/img/icon/node-alert-icons/alert-sync-error.gif" alt="warn_storage" />
          </div>
          <div class="message-text_container">
            <div class="main-message">
              <span>{{ $t("nodeAlert.clientService") }}</span>
            </div>
            <div class="val-message">
              <span>{{ $t("nodeAlert.sync") }}</span>
            </div>
          </div>
        </router-link>
        <div v-if="errorAlarm && !alertShowState.includes('red')" class="status-message_red h-9" @click="isTaskModalActive = true">
          <div class="message-icon">
            <img src="/img/icon/node-alert-icons/alert-task-error.png" alt="warn_storage" />
          </div>
          <div class="message-text_container">
            <div class="main-message">
              <span>{{ $t("nodeAlert.taskFail") }}</span>
            </div>
          </div>
        </div>

        <template v-if="notSetAddresses && !alertShowState.includes('red')">
          <div
            v-for="validator in notSetAddresses"
            :key="validator"
            class="status-message_red h-9 pointer"
            @mouseenter="cursorLocation = `${clkFee}`"
            @mouseleave="cursorLocation = ''"
            @click="expertHandler(validator.serviceID)"
          >
            <div class="message-icon">
              <img :src="validator.icon" />
            </div>
            <div class="message-text_container">
              <div class="main-message">
                <span>{{ $t("nodeAlert.noFee") }}</span>
              </div>
              <div class="val-message">
                <span> > {{ validator.name }} vc</span>
              </div>
            </div>
          </div>
        </template>

        <div
          v-if="stereumUpdate.current !== stereumUpdate.version && !alertShowState.includes('green')"
          class="status-message_green h-9"
          @mouseenter="cursorLocation = `${clkUpdate}`"
          @mouseleave="cursorLocation = ''"
          @click="showUpdate"
        >
          <div class="message-icon">
            <img src="/img/icon/node-alert-icons/alert-notification-stereum-update.png" alt="warn_storage" />
          </div>
          <div class="message-text_container">
            <div class="main-message">
              <span>{{ $t("nodeAlert.stereumUpt") }}</span>
            </div>
            <div class="val-message">
              <span>{{ stereumUpdate.version }}</span>
            </div>
          </div>
        </div>
        <template v-if="updatedNewUpdates && !alertShowState.includes('green')">
          <div
            v-for="item in updatedNewUpdates"
            :key="item"
            class="status-message_green h-9"
            @mouseenter="cursorLocation = `${clkUpdate}`"
            @mouseleave="cursorLocation = ''"
            @click="showUpdate"
          >
            <div class="message-icon">
              <img :src="item.sIcon" alt="warn_storage" />
            </div>
            <div class="message-text_container update-items">
              <div class="main-message">
                <span class="overflow-hidden truncate text-md">{{ item.name }} UPDATE</span>
              </div>
              <div class="val-message">
                <span>{{ item.version }}</span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import ControlService from "@/store/ControlService";
import AlertSkeleton from "./AlertSkeleton.vue";
import { useControlStore } from "@/store/theControl";
import { mapWritableState } from "pinia";
import { useTaskManager } from "@/store/taskManager";
import { useNodeHeader } from "@/store/nodeHeader";
import { useServices } from "@/store/services";
import { useFooter } from "@/store/theFooter";
import { useNodeStore } from "@/store/theNode";
export default {
  components: {
    AlertSkeleton,
  },
  data() {
    return {
      storageWarning: false,
      cpuWarning: false,
      cpuAlarm: false,
      perfect: false,
      warning: false,
      alarm: false,
      missedAttest: false,
      notification: false,
      setFeeReciepent: [],
      setFeeAlarm: false,
      notSetAddresses: [],
      clkFee: this.$t("nodeAlert.clkFee"),
      clkUpdate: this.$t("nodeAlert.clkUpdate"),
      loadingAlerts: false,
      skeletons: [1, 2, 3, 4, 5, 6, 7, 8],
      alertShowState: [],
      criticalObol: [],
      warningObol: [],
      obolInterval: null,
      criticalCsm: [],
      notifCsm: [],
      csmInterval: null,
    };
  },
  computed: {
    ...mapWritableState(useTaskManager, {
      errorAlarm: "errorAlarm",
      isTaskModalActive: "isTaskModalActive",
    }),
    ...mapWritableState(useControlStore, {
      availDisk: "availDisk",
      usedPerc: "usedPerc",
      cpu: "cpu",
      synchronizationErrorControl: "synchronizationErrorControl",
    }),
    ...mapWritableState(useNodeHeader, {
      stereumUpdate: "stereumUpdate",
      updating: "updating",
      rpcState: "rpcState",
      dataState: "dataState",
      wsState: "wsState",
      displayUpdatePanel: "displayUpdatePanel",
      selectedValidatorFromNodeAlert: "selectedValidatorFromNodeAlert",
      openModalFromNodeAlert: "openModalFromNodeAlert",
    }),
    ...mapWritableState(useServices, {
      installedServices: "installedServices",
      allServices: "allServices",
      newUpdates: "newUpdates",
    }),
    ...mapWritableState(useFooter, {
      cursorLocation: "cursorLocation",
      stereumStatus: "stereumStatus",
      volState: "volState",
    }),
    ...mapWritableState(useNodeStore, {
      skeletonLoading: "skeletonLoading",
      connectionStatusIsPoor: "connectionStatusIsPoor",
    }),

    usedPercInt() {
      return parseInt(this.usedPerc);
    },
    pointStatus() {
      let port = [];

      if (this.rpcState) {
        port.push("RPC Point");
      }

      if (this.dataState) {
        port.push("Data API");
      }

      if (this.wsState) {
        port.push("WS Point");
      }
      return port;
    },
    updatedNewUpdates() {
      const updatedUpdates = this.newUpdates.map((update) => {
        const matchingService = this.allServices.find(
          (service) => service.service.replace(/(Beacon|Validator|Service)/gm, "") === update.name
        );
        if (matchingService) {
          return {
            ...update,
            sIcon: matchingService.sIcon,
          };
        }
        return update;
      });

      return updatedUpdates;
    },
  },
  watch: {
    usedPercInt() {
      if (this.usedPercInt > 80) {
        this.storageCheck();
      }
    },
    cpu(newVal) {
      if (newVal >= 80 && newVal < 90) {
        this.cpuWarning = true;
        this.cpuAlarm = false;
        this.perfect = false;
        this.warning = true;
        this.alarm = false;
      } else if (newVal >= 90) {
        this.cpuWarning = false;
        this.cpuAlarm = true;
        this.perfect = false;
        this.warning = false;
        this.alarm = true;
      } else if (newVal < 80) {
        this.cpuWarning = false;
        this.cpuAlarm = false;
        this.perfect = true;
        this.warning = false;
        this.alarm = false;
      }
    },
  },
  mounted() {
    this.checkSettings();
    this.readService();
    this.watchAlertStatus();
    this.polling = setInterval(() => {
      this.readService();
    }, 10000);
    this.fetchObolCharonAlerts();
    this.obolInterval = setInterval(() => {
      this.fetchObolCharonAlerts();
    }, 120000);
    this.fetchCsm();
    this.csmInterval = setInterval(() => {
      this.fetchCsm();
    }, 120000);
  },
  beforeUnmount() {
    clearInterval(this.polling);
    if (this.obolInterval) {
      clearInterval(this.obolInterval);
    }
    if (this.csmInterval) {
      clearInterval(this.csmInterval);
    }
  },
  created() {
    this.storageCheck();
    this.cpuMeth();
  },
  methods: {
    async fetchObolCharonAlerts() {
      try {
        const alerts = await ControlService.fetchObolCharonAlerts();

        this.processAlerts(alerts);
      } catch (error) {
        console.error("Failed to fetch Obol Charon alerts:", error);
      }
    },
    async fetchCsm() {
      try {
        const alerts = await ControlService.fetchCsmAlerts();

        this.processCsm(alerts);
      } catch (error) {
        console.error("Failed to fetch Obol Charon alerts:", error);
      }
    },
    processCsm(alerts) {
      const criticalAlertNames = alerts.filter((alert) => alert.level === "critical").map((alert) => alert.name);

      const notifictionsNames = alerts.filter((alert) => alert.level === "notification").map((alert) => alert.name);

      this.criticalCsm = criticalAlertNames;

      this.notifCsm = notifictionsNames;
    },

    processAlerts(alerts) {
      const criticalAlertNames = alerts.filter((alert) => alert.level === "critical").map((alert) => alert.name);

      const warningAlertNames = alerts.filter((alert) => alert.level === "warning").map((alert) => alert.name);

      this.criticalObol = criticalAlertNames;

      this.warningObol = warningAlertNames;
    },
    alertPicker(color) {
      const index = this.alertShowState.indexOf(color);

      if (index !== -1) {
        this.alertShowState.splice(index, 1);
      } else {
        this.alertShowState.push(color);
      }
    },

    async checkSettings() {
      try {
        const savedConfig = await ControlService.readConfig();

        if (savedConfig?.savedVolume?.volume !== undefined) {
          this.volState = savedConfig.savedVolume.volume !== 0;
          this.currentVolume = savedConfig.savedVolume.volume;
        } else {
          this.volState = false;
        }
      } catch (error) {
        console.error("Failed to load saved settings:", error);
      }
    },

    async updateSettings(vol) {
      try {
        const prevConf = await ControlService.readConfig();
        const conf = {
          ...prevConf,
          savedVolume: { volume: vol },
        };
        await ControlService.writeConfig(conf);
      } catch (error) {
        console.error("Failed to update settings:", error);
      }
    },

    volToggle() {
      this.volState = !this.volState;
      this.updateSettings(this.volState ? 0.95 : 0);
      this.cursorLocation = ``;
    },
    iconFilter(arg) {
      if (arg.name === "PrometheusNodeExporter") {
        return "/img/icon/service-icons/Other/PrometheusNodeExporter-s.png";
      } else if (arg.name === "Notification") {
        return "/img/icon/service-icons/Other/NotifierService-s.png";
      } else if (arg.name == "Charon") {
        return "/img/icon/service-icons/validator/ObolCharon-s.png";
      } else {
        return arg.sIcon;
      }
    },
    watchAlertStatus() {
      this.loadingAlerts = true;
      setTimeout(() => {
        this.loadingAlerts = false;
      }, 4000);
    },
    callReconnectModal() {
      this.stereumStatus = false;
    },
    expertHandler(el) {
      let selectedObject = this.installedServices.find((obj) => obj.config.serviceID === el);
      this.selectedValidatorFromNodeAlert = selectedObject;
      this.openModalFromNodeAlert = true;
    },
    hideExpertMode(el) {
      el.expertOptionsModal = false;
    },
    async readService() {
      const validators = this.installedServices.filter((i) => i.category === "validator");

      if (validators && validators.length > 0 && validators[0].config) {
        const addresses = [];

        for (const validator of validators) {
          if (validator.name === "ssv.network" || validator.name === "Obol Charon") {
            continue;
          }
          if (!validator.yaml)
            try {
              validator.yaml = await ControlService.getServiceYAML(validator.config.serviceID);
            } catch (e) {
              console.log("couldn't get service yaml");
            }
          const patternIndex = validator.expertOptions.findIndex((o) => o.title === "Default Fee Recipient");
          if (patternIndex === -1 || !validator.yaml) {
            continue;
          }
          const command = validator.expertOptions[patternIndex].commands[0];
          const result = validator.yaml.match(new RegExp(`${command}[:=]?([\\S*]+)`));
          const match = result ? result[result.length - 1] : "";
          if (match) {
            const address = match;
            addresses.push({
              name: validator.name,
              address: address,
              icon: validator.sIcon,
              serviceID: validator.config.serviceID,
            });
          }
        }
        const notSetAddresses = addresses.filter((validator) => validator.address === "0x0000000000000000000000000000000000000000");
        this.notSetAddresses = notSetAddresses;
      }
    },

    iconShow() {
      this.closeNotif = true;
    },
    iconHide() {
      this.closeNotif = false;
    },
    showUpdate() {
      this.displayUpdatePanel = true;
    },
    removeUpdateModal() {
      this.displayUpdatePanel = false;
    },

    storageCheck() {
      if (this.usedPercInt > 80) {
        this.storageWarning = true;
        this.warning = true;
        this.perfect = false;
      } else {
        this.storageWarning = false;
        this.warning = false;
        this.perfect = true;
      }
    },
    cpuMeth() {
      if (this.cpu >= 80 && this.cpu < 90) {
        this.cpuWarning = true;
        this.cpuAlarm = false;
        this.perfect = false;
        this.warning = true;
        this.alarm = false;
      } else if (this.cpu >= 90) {
        this.cpuWarning = false;
        this.cpuAlarm = true;
        this.perfect = false;
        this.warning = false;
        this.alarm = true;
      } else if (this.cpu < 80) {
        this.cpuWarning = false;
        this.cpuAlarm = false;
        this.perfect = true;
        this.warning = false;
        this.alarm = false;
      }
    },
  },
};
</script>

<style scoped>
.volBtn:active {
  transform: scale(0.9);
}
.update-items {
  height: 90% !important;
  justify-content: center !important;
}
.pointer {
  cursor: pointer;
}
.no-fee-message {
  font-size: 60%;
  display: flex;
  color: #fff;
  font-weight: 500;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.v-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.v-leave-active {
  transition: all 0.1s ease-in;
}

.v-leave-to {
  opacity: 0;
  transform: translateY(80%);
}

.close {
  position: absolute;
  left: 88%;
  top: 5%;
  width: 8%;
  cursor: pointer;
}

.updatePanel-show {
  right: 0 !important;
}

.status-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
}

.status-box_header {
  justify-content: center;
  align-items: center;
}

.status-box_messages {
  width: 100%;
  height: 90%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  padding-top: 2px;
  overflow-x: hidden;
  overflow-y: auto;
}

.status_innerBox {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 2px;
  overflow: hidden !important;
  overflow-y: auto !important;
}
::-webkit-scrollbar {
  width: 2px;
  background-color: transparent;
}

/* Track */
.status_innerBox::-webkit-scrollbar-track {
  background: #3b4146;
  box-sizing: border-box;
  border-radius: 50%;
}

/* Handle */
.status_innerBox::-webkit-scrollbar-thumb {
  background: #324b3f;
  border-radius: 50%;
}

.icon-line {
  display: flex;

  padding-top: 2px;
  width: 100%;
  height: 30px;
}

.status-icon {
  width: 27px;
  height: 27px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  margin-right: 5px;
  box-sizing: border-box;
  border: 2px solid #151618;
  cursor: pointer;
}

.status-icon.filtered {
  opacity: 30%;
}
.status-icon.filtered:hover {
  opacity: 70%;
}

.status-icon img {
  width: 100%;
  height: 100%;
  justify-self: center;
  align-self: center;
}

.status-message_yellow,
.status-message_red,
.status-message_green {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  min-height: 36px;
  border-radius: 3px;
  color: #eee;
}

.status-message_yellow {
  background: #ffd924;
}

.status-message_red {
  background: #be3635;
}

.status-message_red .message-text_container {
  color: #eee;
}

.status-message_green {
  background: #5f7e6a;
  cursor: pointer;
}
.status-message_green .message-text_container {
  color: #eee;

  height: 100%;
}

.message-icon {
  width: 22%;
  height: 88%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.message-icon img {
  width: 87%;
  height: 90%;
  border-radius: 5px;
}

.message-text_container {
  width: 70%;
  height: 75%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: column;
  color: #23272a;
}

.main-message {
  display: flex;
  width: 95%;
  height: 55%;
  justify-content: flex-start;
  align-items: center;
  font-size: 50%;
  font-weight: 800;
  text-transform: uppercase;
}
.main-message span {
  display: block;
  width: 100%;
  height: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
}
.main-message-rpc {
  display: flex;
  width: 95%;
  height: 100%;
  justify-content: flex-start;
  align-items: center;
  font-size: 80%;
  font-weight: 800;
  text-transform: uppercase;
}

.val-message {
  display: flex;
  width: 95%;
  height: 35%;
  justify-content: center;
  align-items: flex-end;
  font-size: 45%;
  font-weight: 700;
  text-transform: uppercase;
}
.val-message span {
  display: block;
  width: 100%;
  height: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
}
</style>
