<template>
  <div class="status-box flex flex-col justify-between items-center">
    <div class="status-box_header bg-[#151618] border border-gray-600 rounded-md">
      <div class="icon-line">
        <div class="status-icon" :class="{ active: perfect }">
          <img src="/img/icon/node-alert-icons/alert-notification.png" alt="green" />
        </div>
        <div class="status-icon" :class="{ active: warning || pointStatus.length !== 0 }">
          <img src="/img/icon/node-alert-icons/alert-general-yellow.png" alt="green" />
        </div>
        <div class="status-icon" :class="{ active: alarm }">
          <img src="/img/icon/node-alert-icons/alert-general-red.png" alt="green" />
        </div>
        <div
          class="status-icon"
          :class="{
            active: stereumUpdate.current !== stereumUpdate.version || updatedNewUpdates.length > 0,
          }"
        >
          <img src="/img/icon/node-alert-icons/alert-settings.png" alt="green" />
        </div>
      </div>
    </div>
    <div class="status-box_messages bg-[#151618] border border-gray-600 rounded-md">
      <router-link v-if="storageWarning" to="/control" class="status-message_yellow">
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
      <router-link v-if="cpuWarning" to="/control" class="status-message_yellow">
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
      <router-link v-for="point in pointStatus" :key="point" to="/control" class="status-message_yellow">
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
      <router-link v-if="cpuAlarm" to="/control" class="status-message_red">
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

      <router-link v-if="synchronizationError" to="/control" class="status-message_red">
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
      <div v-if="errorAlarm" class="status-message_red" @click="isTaskModalActive = true">
        <div class="message-icon">
          <img src="/img/icon/node-alert-icons/alert-task-error.png" alt="warn_storage" />
        </div>
        <div class="message-text_container">
          <div class="main-message">
            <span>{{ $t("nodeAlert.taskFail") }}</span>
          </div>
        </div>
      </div>

      <div
        v-for="validator in notSetAddresses"
        :key="validator"
        class="status-message_red pointer"
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

      <div
        v-if="stereumUpdate.current !== stereumUpdate.version"
        class="status-message_green"
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
      <div
        v-for="item in updatedNewUpdates"
        :key="item"
        class="status-message_green"
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
    </div>
  </div>
</template>

<script>
import ControlService from "@/store/ControlService";
import { useControlStore } from "@/store/theControl";
import { mapWritableState } from "pinia";
import { useTaskManager } from "@/store/taskManager";
import { useNodeHeader } from "@/store/nodeHeader";
import { useServices } from "@/store/services";
import { useFooter } from "@/store/theFooter";
export default {
  components: {},
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
      synchronizationError: "synchronizationError",
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
        const matchingService = this.allServices.find((service) => service.service.replace(/(Beacon|Validator|Service)/gm, "") === update.name);
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
    this.readService();
    this.polling = setInterval(() => {
      this.readService();
    }, 10000);
  },
  beforeUnmount() {
    clearInterval(this.polling);
  },
  created() {
    this.storageCheck();
    this.cpuMeth();
  },
  methods: {
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
          const pattern = validator.expertOptions[patternIndex].pattern;
          const match = [...validator.yaml.match(new RegExp(pattern))][2];
          if (match) {
            const address = match;
            addresses.push({
              name: validator.name,
              address: address,
              icon: validator.sIcon,
              serviceID: validator.config.serviceID,
            });
          } else {
            console.error(
              "Could not find default-fee-recipient address in the service YAML for validator:",
              validator.name
            );
          }
        }
        const notSetAddresses = addresses.filter(
          (validator) => validator.address === "0x0000000000000000000000000000000000000000"
        );
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
  position: relative;
  justify-content: space-between;
  align-items: flex-start;
}

.status-box_header {
  width: 100%;
  height: 8%;
  display: flex;
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
  padding-top: 5px;
  overflow: hidden;
  overflow-y: scroll;
}
::-webkit-scrollbar {
  width: 2px;
  background-color: transparent;
}

/* Track */
.status-box_messages::-webkit-scrollbar-track {
  background: #3b4146;
  box-sizing: border-box;
  border-radius: 50%;
}

/* Handle */
.status-box_messages::-webkit-scrollbar-thumb {
  background: #324b3f;
  border-radius: 50%;
}

.icon-line {
  display: flex;
  justify-content: space-evenly;
  padding-top: 4px;
  width: 100%;
  height: 30px;
}

.status-icon {
  width: 26px;
  height: 26px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 25%;
}
.active {
  opacity: 100%;
}

.status-icon img {
  width: 90%;
  height: 90%;
}

.status-message_yellow,
.status-message_red,
.status-message_green {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 95%;
  height: 36px;
  border-radius: 5px;
  margin: 2px 0;
  color: #eee;
  position: relative;
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
  justify-content: flex-start;
  align-items: center;
  font-size: 45%;
  font-weight: 700;
  text-transform: uppercase;
}
</style>
