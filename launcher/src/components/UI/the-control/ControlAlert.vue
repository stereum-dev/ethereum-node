<template>
  <div class="alert-box_parent">
    <!-- <comming-soon></comming-soon> -->
    <update-panel
      :click-bg="displayUpdatePanel"
      :class="{ 'updatePanel-show': displayUpdatePanel }"
      @click-out="removeUpdateModal"
    ></update-panel>
    <div class="alert-box">
      <div class="alert-box_header">
        <div class="icon_alarm" :class="{ active: perfect }">
          <img src="/img/icon/control/NOTIFICATION_GRUN.png" alt="green" />
        </div>
        <div class="icon_alarm" :class="{ active: warning || rpcState }">
          <img src="/img/icon/control/WARNSCHILD_GELB.png" alt="green" />
        </div>
        <div class="icon_alarm" :class="{ active: alarm }">
          <img src="/img/icon/control/WARNSCHILD_ROT.png" alt="green" />
        </div>
        <div class="icon_alarm" :class="{ active: stereumUpdate.current !== stereumUpdate.version || newUpdate > 0 }">
          <img src="/img/icon/control/SETTINGS.png" alt="green" />
        </div>
      </div>
      <div class="alert-box_messages">
        <div v-if="storageWarning" class="alert-message_yellow">
          <div class="icon-box">
            <img src="/img/icon/control/WARNSCHILD_GELB_storage.png" alt="warn_storage" />
          </div>
          <div class="message">
            <div class="main-message"><span>LOW STORAGE SPACE</span></div>
            <div class="val-message">{{ availDisk }} GB Free</div>
          </div>
        </div>
        <div v-if="cpuWarning" class="alert-message_yellow">
          <div class="icon-box">
            <img src="/img/icon/control/WARNSCHILD_GELB_cpu.png" alt="warn_storage" />
          </div>
          <div class="message">
            <div class="main-message"><span>CPU USAGE</span></div>
            <div class="val-message">
              <span> > {{ cpu }}%</span>
            </div>
          </div>
        </div>
        <div v-if="rpcState" class="alert-message_yellow">
          <div class="icon-box">
            <img src="/img/icon/control/PORT_LIST_ICON.png" alt="warn_storage" />
          </div>
          <div class="message">
            <div class="main-message"><span>RPC Point</span></div>
            <div class="val-message">
              <span> > STATUS: OPEN</span>
            </div>
          </div>
        </div>
        <div v-if="cpuAlarm" class="alert-message_red">
          <div class="icon-box">
            <img src="/img/icon/control/red_warning_cpu.png" alt="warn_storage" />
          </div>
          <div class="message">
            <div class="main-message"><span>CPU USAGE</span></div>
            <div class="val-message">
              <span> > {{ cpu }}%</span>
            </div>
          </div>
        </div>
        <div v-if="missedAttest" class="alert-message_red">
          <div class="icon-box">
            <img src="/img/icon/control/key-rot.png" alt="warn_storage" />
          </div>
          <!-- <div class="message-box">
            <div class="warning"><span>CRITICAL WARNING</span></div>
            <div class="main-message"><span>MISSED ATTESTATION</span></div>
          </div> -->
          <div class="message">
            <div class="main-message"><span>MISSED ATTESTATION</span></div>
          </div>
        </div>
        <div v-for="validator in notSetAddresses" :key="validator" class="alert-message_red">
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

        <div v-if="stereumUpdate.current !== stereumUpdate.version" class="alert-message_green">
          <div class="icon-box" @click="showUpdate">
            <img src="/img/icon/control/logo-icon.png" alt="warn_storage" />
          </div>
          <div class="message">
            <div class="main-message" @click="showUpdate"><span>STEREUM UPDATE</span></div>
            <div class="val-message">
              <span>{{ stereumUpdate.version }}</span>
            </div>
          </div>
        </div>
        <div v-for="item in updatedNewUpdates" :key="item" class="alert-message_green" @click="showUpdate">
          <div class="icon-box">
            <img :src="item.sIcon" alt="warn_storage" />
          </div>
          <div class="message">
            <div class="main-message" @click="showUpdate">
              <span>{{ item.name }} UPDATE</span>
            </div>
            <div class="val-message">
              <span>{{ item.version }}</span>
            </div>
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
      notification: false,
      newUpdate: false,
      missedAttest: false,
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
    usedPercInt() {
      return parseInt(this.usedPerc);
    },
    ...mapWritableState(useServices, {
      installedServices: "installedServices",
      newUpdates: "newUpdates",
    }),
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
  width: 97%;
  height: 99%;
  margin-left: 3px;
  border: 5px solid grey;
  border-radius: 20px;
  background-color: #264744;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  box-shadow: 0px 0px 5px 2px #001717;
}
.alert-box {
  display: flex;
  width: 95%;
  height: 95%;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
}
.alert-box_header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 90%;
  height: 12%;
  background: #23272a;
  border: 1px solid grey;
  border-radius: 5px;
  box-shadow: 1px 1px 5px 1px #001717;
  padding: 1px;
  box-sizing: border-box;
}
.icon_alarm {
  width: 23%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  margin: 0 1.5px;
  opacity: 25%;
}
.active {
  opacity: 100%;
}
.icon_alarm img {
  width: 100%;
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
  width: 90%;
  height: 85%;
  background: #23272a;
  border: 1px solid #707070;
  border-radius: 5px;
  box-shadow: 1px 1px 5px 1px rgb(0, 23, 23);
  flex-direction: column;
}
.alert-message_yellow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 95%;
  height: 15%;
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
  height: 15%;
  background: rgb(173, 7, 7);
  border: 1px solid #707070;
  border-radius: 5px;
  margin: 2px 0;
  color: #eee;
}
.alert-message_green {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 95%;
  height: 15%;
  background: #5f7e6a;
  border: 1px solid #707070;
  border-radius: 5px;
  margin: 2px 0;
  color: #eee;
  cursor: pointer;
  position: relative;
}
.icon-box {
  width: 28%;
  height: 95%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.icon-box img {
  width: 95%;
  height: 99%;
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
  justify-content: center;
  align-items: flex-start;
  font-size: 52%;
  font-weight: 800;
  text-transform: uppercase;
}
.main-message span {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
}
.val-message {
  display: flex;
  width: 95%;
  height: 50%;
  justify-content: flex-start;
  align-items: center;
  font-size: 60%;
  font-weight: 700;
  text-transform: uppercase;
}
</style>
