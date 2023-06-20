<template>
  <div class="status-box">
    <update-panel
      :click-bg="displayUpdatePanel"
      :class="{ 'updatePanel-show': displayUpdatePanel }"
      @click-out="removeUpdateModal"
    ></update-panel>
    <div class="status-box_header">
      <div class="icon-line">
        <div class="status-icon" :class="{ active: perfect }">
          <img src="/img/icon/control/NOTIFICATION_GRUN.png" alt="green" />
        </div>
        <div class="status-icon" :class="{ active: warning || rpcState }">
          <img src="/img/icon/control/WARNSCHILD_GELB.png" alt="green" />
        </div>
        <div class="status-icon" :class="{ active: alarm }">
          <img src="/img/icon/control/WARNSCHILD_ROT.png" alt="green" />
        </div>
        <div class="status-icon" :class="{ active: stereumUpdate.current !== stereumUpdate.version }">
          <img src="/img/icon/control/SETTINGS.png" alt="green" />
        </div>
      </div>
    </div>
    <div class="status-box_messages">
      <div v-if="storageWarning" class="status-message_yellow">
        <div class="message-icon">
          <img src="/img/icon/control/WARNSCHILD_GELB_storage.png" alt="warn_storage" />
        </div>
        <div class="message-text_container">
          <div class="main-message">
            <span>{{ $t("nodeAlert.lowSpace") }}</span>
          </div>
          <div class="val-message">{{ availDisk }} GB Free</div>
        </div>
      </div>
      <div v-if="cpuWarning" class="status-message_yellow">
        <div class="message-icon">
          <img src="/img/icon/control/WARNSCHILD_GELB_cpu.png" alt="warn_storage" />
        </div>
        <div class="message-text_container">
          <div class="main-message">
            <span>CPU {{ $t("nodeAlert.use") }}</span>
          </div>
          <div class="val-message">
            <span> > {{ cpu }}%</span>
          </div>
        </div>
      </div>
      <div v-if="rpcState" class="status-message_yellow">
        <div class="message-icon">
          <img src="/img/icon/control/PORT_LIST_ICON.png" alt="warn_storage" />
        </div>
        <div class="message-text_container">
          <div class="main-message-rpc">
            <span>RPC Point</span>
          </div>
        </div>
      </div>
      <div v-if="cpuAlarm" class="status-message_red">
        <div class="message-icon">
          <img src="/img/icon/control/red_warning_cpu.png" alt="warn_storage" />
        </div>
        <div class="message-text_container">
          <div class="main-message">
            <span>CPU {{ $t("nodeAlert.use") }}</span>
          </div>
          <div class="val-message">
            <span> > {{ cpu }}%</span>
          </div>
        </div>
      </div>
      <div v-if="missedAttest" class="status-message_red">
        <div class="message-icon">
          <img src="/img/icon/control/key-rot.png" alt="warn_storage" />
        </div>
        <div class="message-text_container">
          <div class="main-message">
            <span>{{ $t("nodeAlert.missAttest") }}</span>
          </div>
        </div>
      </div>

      <div v-for="validator in notSetAddresses" :key="validator" class="status-message_red">
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

      <div v-if="stereumUpdate.current !== stereumUpdate.version" class="status-message_green">
        <div class="message-icon" @click="showUpdate">
          <img src="/img/icon/control/logo-icon.png" alt="warn_storage" />
        </div>
        <div class="message-text_container" @click="showUpdate">
          <div class="main-message">
            <span>{{ $t("nodeAlert.stereumUpt") }}</span>
          </div>
          <div class="val-message">
            <span>{{ stereumUpdate.version }}</span>
          </div>
        </div>
      </div>
      <div v-if="newUpdates.length > 0" class="status-message_green">
        <div class="message-icon" @click="showUpdate">
          <img src="/img/icon/control/logo-icon.png" alt="warn_storage" />
        </div>
        <div class="message-text_container" @click="showUpdate">
          <div class="main-message">
            <span>{{ $t("nodeAlert.stereumUpt") }}</span>
          </div>
          <div class="val-message">
            <span>{{ stereumUpdate.version }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ControlService from "@/store/ControlService";
import UpdatePanel from "../node-header/UpdatePanel.vue";
import { useControlStore } from "../../../store/theControl";
import { mapWritableState } from "pinia";
import { useNodeHeader } from "@/store/nodeHeader";
import { useServices } from "@/store/services";
export default {
  components: {
    UpdatePanel,
  },
  data() {
    return {
      displayUpdatePanel: false,
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
    };
  },
  computed: {
    ...mapWritableState(useControlStore, {
      availDisk: "availDisk",
      usedPerc: "usedPerc",
      cpu: "cpu",
    }),
    ...mapWritableState(useNodeHeader, {
      forceUpdateCheck: "forceUpdateCheck",
      stereumUpdate: "stereumUpdate",
      updating: "updating",
      rpcState: "rpcState",
    }),
    ...mapWritableState(useServices, {
      installedServices: "installedServices",
      newUpdates: "newUpdates",
    }),
    usedPercInt() {
      return parseInt(this.usedPerc);
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
    console.log(this.newUpdates);
  },
  beforeUnmount() {
    clearInterval(this.polling);
  },
  created() {
    this.storageCheck();
    this.cpuMeth();
  },
  methods: {
    async readService() {
      const validators = this.installedServices.filter((i) => i.category === "validator");

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
          const match = [...validator.yaml.match(new RegExp(pattern))][2];
          if (match) {
            const address = match;
            addresses.push({ name: validator.name, address: address, icon: validator.sIcon });
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
  height: 92%;
  display: flex;
  flex-direction: column;
  position: relative;
  justify-content: space-between;
  align-items: flex-start;
  padding: 5% 5%;
}

.status-box_header {
  width: 96%;
  height: 8%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #23272a;
  border: 1px solid #4c4848;
  border-radius: 5px;
  box-shadow: 0 1px 3px 1px #1c1f22;
}

.status-box_messages {
  width: 100%;
  height: 90%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  background: #23272a;
  border: 1px solid #4c4848;
  padding-top: 5px;
  border-radius: 5px;
  box-shadow: 0 1px 3px 1px #1c1f22;
}

.icon-line {
  display: flex;
  justify-content: flex-start;
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
  height: 9%;
  border: 1px solid #707070;
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
}

.message-icon {
  width: 24%;
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.message-icon img {
  width: 88%;
  height: 99%;
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
  font-weight: 700;
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
  font-size: 50%;
  font-weight: 700;
  text-transform: uppercase;
}
</style>
