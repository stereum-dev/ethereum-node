<template>
  <div class="alert-box_parent rounded-md">
    <div class="alert-box">
      <div class="alert-box_header h-8 w-full flex justify-center items-center">
        <div class="alert-box_icons border border-gray-600 rounded-md bg-[#151618] w-3/4 h-full flex justify-center items-center pt-0.5">
          <div
            class="icon_alarm"
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
            class="icon_alarm"
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
            class="icon_alarm"
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
      <div class="alert-box_messages overflow-x-hidden overflow-y-auto">
        <div
          v-if="storageWarning && !alertShowState.includes('yellow')"
          class="alert-message_yellow"
          @mouseenter="cursorLocation = `${lowSpace}`"
          @mouseleave="cursorLocation = ''"
        >
          <div class="icon-box">
            <img src="/img/icon/node-alert-icons/alert-storage-yellow.png" alt="warn_storage" />
          </div>
          <div class="message">
            <div class="main-message">
              <span>{{ lowSpace }}</span>
            </div>
            <div class="val-message">{{ availDisk }} GB Free</div>
          </div>
        </div>
        <div
          v-if="cpuWarning && !alertShowState.includes('yellow')"
          class="alert-message_yellow"
          @mouseenter="cursorLocation = `cpu ${use}`"
          @mouseleave="cursorLocation = ''"
        >
          <div class="icon-box">
            <img src="/img/icon/node-alert-icons/alert-cpu-yellow.png" alt="warn_storage" />
          </div>
          <div class="message">
            <div class="main-message">
              <span>CPU {{ use }}</span>
            </div>
            <div class="val-message">
              <span> > {{ cpu }}%</span>
            </div>
          </div>
        </div>
        <template v-if="pointStatus && !alertShowState.includes('yellow')">
          <div v-for="point in pointStatus" :key="point" class="alert-message_yellow">
            <div class="icon-box">
              <img src="/img/icon/control-page-icons/PORT_LIST_ICON.png" alt="warn_storage" />
            </div>
            <div class="message">
              <div class="main-message">
                <span>{{ point }}</span>
              </div>
              <div class="val-message">
                <span> > STATUS: OPEN</span>
              </div>
            </div>
          </div>
        </template>
        <div
          v-if="cpuAlarm && !alertShowState.includes('red')"
          class="alert-message_red"
          @mouseenter="cursorLocation = `cpu ${use}`"
          @mouseleave="cursorLocation = ''"
        >
          <div class="icon-box">
            <img src="/img/icon/node-alert-icons/alert-cpu-red.png" alt="warn_storage" />
          </div>
          <div class="message">
            <div class="main-message">
              <span>CPU {{ use }}</span>
            </div>
            <div class="val-message">
              <span> > {{ cpu }}%</span>
            </div>
          </div>
        </div>
        <!-- obol red start -->
        <template v-if="criticalObol && !alertShowState.includes('red')">
          <div
            v-for="alerCrit in criticalObol"
            :key="alerCrit"
            class="alert-message_red"
            @mouseenter="cursorLocation = `${alerCrit}`"
            @mouseleave="cursorLocation = ''"
          >
            <div class="icon-box">
              <img src="/img/icon/service-icons/validator/ObolCharon.png" alt="warn_obol" />
            </div>
            <div class="message">
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
            class="alert-message_yellow"
            @mouseenter="cursorLocation = `${alerWarn}`"
            @mouseleave="cursorLocation = ''"
          >
            <div class="icon-box">
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
            class="alert-message_red"
            @mouseenter="cursorLocation = `${csmCrit}`"
            @mouseleave="cursorLocation = ''"
          >
            <div class="icon-box">
              <img src="/img/icon/service-icons/Other/LCOM.png" alt="warn_obol" />
            </div>
            <div class="message">
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
        <template v-if="notifCsm && !alertShowState?.includes('green')">
          <div
            v-for="notif in notifCsm"
            :key="notif"
            class="alert-message_green"
            @mouseenter="cursorLocation = `${notif}`"
            @mouseleave="cursorLocation = ''"
          >
            <div class="icon-box">
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

        <!-- csm green end -->
        <!-- setting page have to add here -->
        <div
          v-if="synchronizationErrorControl && !alertShowState.includes('red')"
          class="alert-message_red"
          @mouseenter="cursorLocation = ` ${sync}`"
          @mouseleave="cursorLocation = ''"
        >
          <div class="icon-box">
            <img src="/img/icon/node-alert-icons/alert-sync-error.gif" alt="warn_storage" />
          </div>
          <div class="message">
            <div class="main-message"><span>CLIENT / SERVICE</span></div>
            <div class="val-message">
              <span>{{ sync }}</span>
            </div>
          </div>
        </div>
        <div
          v-if="errorAlarm && !alertShowState.includes('red')"
          class="alert-message_red"
          @click="isTaskModalActive = true"
          @mouseenter="cursorLocation = ` ${taskFail}`"
          @mouseleave="cursorLocation = ''"
        >
          <div class="icon-box">
            <img src="/img/icon/node-alert-icons/alert-task-error.png" alt="warn_storage" />
          </div>

          <div class="message">
            <div class="main-message">
              <span>{{ taskFail }}</span>
            </div>
          </div>
        </div>
        <template v-if="notSetAddresses && !alertShowState.includes('red')">
          <div
            v-for="validator in notSetAddresses"
            :key="validator"
            class="alert-message_red pointer"
            @mouseenter="cursorLocation = `${clkFee}`"
            @mouseleave="cursorLocation = ''"
            @click="expertHandler(validator)"
          >
            <div class="icon-box">
              <img :src="validator.icon" />
            </div>
            <div class="message">
              <div class="main-message"><span>no fee recipient</span></div>
              <div class="val-message">
                <span> > {{ validator.name }} vc</span>
              </div>
            </div>
          </div>
        </template>

        <div
          v-if="stereumUpdate.current !== stereumUpdate.version && !alertShowState.includes('green')"
          class="alert-message_green"
          @mouseenter="cursorLocation = `${clkUpdate}`"
          @mouseleave="cursorLocation = ''"
        >
          <div class="icon-box" @click="showUpdate">
            <img src="/img/icon/node-alert-icons/alert-notification-stereum-update.png" alt="warn_storage" />
          </div>
          <div class="message">
            <div class="main-message" @click="showUpdate">
              <span>STEREUM UPDATE</span>
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
            class="alert-message_green"
            @click="showUpdate"
            @mouseenter="cursorLocation = `${clkUpdate}`"
            @mouseleave="cursorLocation = ''"
          >
            <div class="icon-box">
              <img :src="iconFilter(item)" alt="warn_storage" />
            </div>
            <div class="message">
              <div class="main-message" @click="showUpdate">
                <span>UPDATE available</span>
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
import { useTaskManager } from "@/store/taskManager";
import { useControlStore } from "@/store/theControl";
import { mapWritableState, mapState } from "pinia";
import { useNodeHeader } from "@/store/nodeHeader";
import { useServices } from "@/store/services";
import { useFooter } from "@/store/theFooter";
import { useSetups } from "@/store/setups";
export default {
  data() {
    return {
      storageWarning: false,
      cpuWarning: false,
      cpuAlarm: false,
      perfect: false,
      warning: false,
      alarm: false,
      notification: false,
      newUpdate: false,
      alertShowState: [],
      notSetAddresses: [],
      clkFee: this.$t("nodeAlert.clkFee"),
      clkUpdate: this.$t("nodeAlert.clkUpdate"),
      lowSpace: this.$t("nodeAlert.lowSpace"),
      use: this.$t("nodeAlert.use"),
      sync: this.$t("nodeAlert.sync"),
      taskFail: this.$t("nodeAlert.taskFail"),
      polling: null,
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
      displayUpdatePanel: "displayUpdatePanel",
      stereumUpdate: "stereumUpdate",
      updating: "updating",
      rpcState: "rpcState",
      dataState: "dataState",
      wsState: "wsState",
    }),
    usedPercInt() {
      return parseInt(this.usedPerc);
    },
    ...mapWritableState(useServices, {
      installedServices: "installedServices",
      newUpdates: "newUpdates",
    }),
    ...mapState(useSetups, {
      selectedSetup: "selectedSetup",
    }),
    ...mapWritableState(useFooter, {
      cursorLocation: "cursorLocation",
      volState: "volState",
    }),
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
        const matchingService = this.installedServices.find((service) => service.name === update.name);
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
    alertPicker(color) {
      const index = this.alertShowState.indexOf(color);

      if (index !== -1) {
        this.alertShowState.splice(index, 1);
      } else {
        this.alertShowState.push(color);
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
    async checkSettings() {
      try {
        const savedConfig = await ControlService.readConfig();

        if (savedConfig?.savedVolume?.volume !== undefined) {
          this.volState = savedConfig.savedVolume.volume !== 0;
          this.currentVolume = savedConfig.savedVolume.volume;
        } else {
          this.volState = false;
          console.warn("Volume configuration is missing or invalid.");
        }
      } catch (error) {
        console.error("Failed to load saved settings:", error);
      }
    },

    async fetchObolCharonAlerts() {
      try {
        const alerts = await ControlService.fetchObolCharonAlerts();

        this.processAlerts(alerts);
      } catch (error) {
        console.error("Failed to fetch Obol Charon alerts:", error);
      }
    },
    processAlerts(alerts) {
      const criticalAlertNames = alerts.filter((alert) => alert.level === "critical").map((alert) => alert.name);

      const warningAlertNames = alerts.filter((alert) => alert.level === "warning").map((alert) => alert.name);

      this.criticalObol = criticalAlertNames;

      this.warningObol = warningAlertNames;
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
      } else if (arg.name === "Charon") {
        return "/img/icon/service-icons/validator/ObolCharon-s.png";
      } else {
        return arg.sIcon;
      }
    },
    expertHandler(el) {
      this.$emit("expert-handler", el);
    },
    hideExpertMode(el) {
      el.expertOptionsModal = false;
    },

    async readService() {
      const validators = this.installedServices?.filter((i) => i.category === "validator");

      if (validators && validators.length > 0 && validators[0].config) {
        const addresses = [];

        for (const validator of validators) {
          if (validator.name === "ssv.network" || validator.name === "Obol Charon") {
            continue;
          }
          if (!validator.yaml) validator.yaml = await ControlService.getServiceYAML(validator.config.serviceID);
          const patternIndex = validator.expertOptions.findIndex((o) => o.title === "Default Fee Recipient");
          if (patternIndex === -1) {
            continue;
          }
          const pattern = validator.expertOptions[patternIndex].pattern;
          const match = validator.yaml ? validator.yaml.match(new RegExp(pattern)) : null;

          if (match && match.length > 2) {
            validator.address = match[2]; // Update the address property directly
            addresses.push(validator);
          } else {
            return;
          }
        }
        const notSetAddresses = addresses.filter((validator) => validator.address === "0x0000000000000000000000000000000000000000");
        this.notSetAddresses = notSetAddresses;
      }
    },

    closeNotification() {
      this.notification = false;
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
.pointer {
  cursor: pointer;
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
  z-index: 10;
}
.updatePanel-show {
  right: 0 !important;
}
.alert-box_parent {
  width: 100%;
  max-height: 100%;
  height: 100%;
  background-color: #264744;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  position: relative;
  cursor: default;
}
.alert-box {
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  flex-direction: column;
  padding: 5px;
}

.icon_alarm {
  width: 1.75rem;
  height: 1.75rem;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  margin: 0 1.5px;
  cursor: pointer;
  padding: 2px;
}
.icon_alarm.filtered {
  opacity: 30%;
}

.icon_alarm.filtered:hover {
  opacity: 70%;
}

.icon_alarm img {
  height: 100%;
}
.message {
  width: 70%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.message-rpc {
  width: 70%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-weight: 600;
  font-size: 90%;
}
.alert-box_messages {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;

  height: 92%;
  background: #23272a;
  border: 1px solid #707070;
  border-radius: 5px;
  flex-direction: column;
  margin-top: 5px;
}

.alert-message_yellow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 95%;
  height: 9%;
  background: #ffd924;
  border: 1px solid #707070;
  border-radius: 5px;
  margin: 2px 0;
}

.alert-message_red {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 95%;
  height: 9%;
  background: rgb(173, 7, 7);
  border: 1px solid #707070;
  border-radius: 5px;
  margin: 2px 0;
  color: #eee;
  cursor: pointer;
}
.alert-message_green {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 95%;
  height: 9%;
  background: #5f7e6a;
  border: 1px solid #707070;
  border-radius: 5px;
  margin: 2px 0;
  color: #eee;
  cursor: pointer;
  position: relative;
}

.icon-box {
  width: 25%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.icon-box img {
  width: 1.5rem;
  height: 1.5rem;
}
.message-box {
  width: 90%;
  height: 75%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: column;
  justify-content: flex-start;
}

.main-message {
  display: flex;
  width: 100%;
  height: 60%;
  justify-content: flex-start;
  align-items: center;
  font-size: 52%;
  font-weight: 800;
  text-transform: uppercase;
  margin-top: 5%;
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
.val-message {
  display: flex;
  width: 95%;
  height: 50%;
  justify-content: flex-start;
  align-items: center;
  font-size: 42%;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 2%;
}

.val-message span {
  display: block;
  width: 100%;
  height: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  font-size: 42%;
}
</style>
