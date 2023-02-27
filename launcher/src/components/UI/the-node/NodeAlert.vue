<template>
  <div class="status-box">
    <update-panel
      :click-bg="displayUpdatePanel"
      :class="{ 'updatePanel-show': displayUpdatePanel }"
      @click-out="removeUpdateModal"
    ></update-panel>
    <div class="status-box_header">
      <div class="icon-line">
        <div v-if="perfect" class="status-icon">
          <img src="../../../../public/img/icon/control/NOTIFICATION_GRUN.png" alt="green" />
        </div>
        <div v-if="warning" class="status-icon">
          <img src="../../../../public/img/icon/control/WARNSCHILD_GELB.png" alt="green" />
        </div>
        <div v-if="alarm" class="status-icon">
          <img src="../../../../public/img/icon/control/WARNSCHILD_ROT.png" alt="green" />
        </div>
        <div v-if="notification" class="status-icon">
          <img src="../../../../public/img/icon/control/SETTINGS.png" alt="green" />
        </div>
      </div>
    </div>
    <div class="status-box_messages">
      <div v-if="storageWarning" class="status-message_yellow">
        <div class="message-icon">
          <img src="../../../../public/img/icon/control/WARNSCHILD_GELB_storage.png" alt="warn_storage" />
        </div>
        <div class="message-text_container">
          <div class="warning"><span>WARNING</span></div>
          <div class="main-message"><span>LOW STORAGE SPACE</span></div>
          <div class="val-message">{{ availDisk }} GB Free</div>
        </div>
      </div>
      <div v-if="cpuWarning" class="status-message_yellow">
        <div class="message-icon">
          <img src="../../../../public/img/icon/control/WARNSCHILD_GELB_cpu.png" alt="warn_storage" />
        </div>
        <div class="message-text_container">
          <div class="warning"><span>WARNING</span></div>
          <div class="main-message"><span>CPU USAGE</span></div>
          <div class="val-message">
            <span> > {{ cpu }}%</span>
          </div>
        </div>
      </div>
      <div v-if="cpuAlarm" class="status-message_red">
        <div class="message-icon">
          <img src="../../../../public/img/icon/control/red_warning_cpu.png" alt="warn_storage" />
        </div>
        <div class="message-text_container">
          <div class="warning"><span>CRITICAL WARNING</span></div>
          <div class="main-message"><span>CPU USAGE</span></div>
          <div class="val-message">
            <span> > {{ cpu }}%</span>
          </div>
        </div>
      </div>
      <div v-if="missedAttest" class="status-message_red">
        <div class="message-icon">
          <img src="../../../../public/img/icon/control/key-rot.png" alt="warn_storage" />
        </div>
        <div class="message-text_container">
          <div class="warning"><span>CRITICAL WARNING</span></div>
          <div class="main-message"><span>MISSED ATTESTATION</span></div>
        </div>
      </div>
      <transition>
        <div v-if="notification" class="status-message_green" @mouseover="iconShow" @mouseleave="iconHide">
          <div class="message-icon" @click="showUpdate">
            <img src="../../../../public/img/icon/control/logo-icon.png" alt="warn_storage" />
          </div>
          <div class="message-text_container" @click="showUpdate">
            <div class="warning"><span>NOTIFICATION</span></div>
            <div class="main-message"><span>STEREUM UPDATE</span></div>
            <div class="val-message">
              <span>{{ stereumUpdate.version }}</span>
            </div>
          </div>
          <div v-if="closeNotif" class="close" @click="closeNotification">
            <img src="../../../../public/img/icon/control/close.png" alt="close" />
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import ControlService from "@/store/ControlService";
import UpdatePanel from "../node-header/UpdatePanel.vue";
import { useControlStore } from "../../../store/theControl";
import { mapState } from "pinia";
import { mapWritableState } from "pinia";
import { useNodeHeader } from "@/store/nodeHeader";
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
      newUpdate: false,
      missedAttest: false,
      closeNotif: false,
      notification: false,
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
    }),
    usedPercInt() {
      return parseInt(this.usedPerc);
    },
  },
  watch: {
    usedPercInt(newVal, oldVal) {
      if (newVal > 80) {
        this.storageCheck();
      }
    },
    cpu(newVal, oldVal) {
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

  created() {
    this.storageCheck();
    this.cpuMeth();
    this.checkStereumUpdate();
    this.notifHandler();
  },
  methods: {
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
    checkStereumUpdate() {
      if (this.stereumUpdate && this.stereumUpdate.version) {
        // console.log(this.stereumUpdate.commit)  // commit hash of the newest newest release tag
        //console.log(this.stereumUpdate.current_commit); // current installed commit on the os
        return this.stereumUpdate.commit != this.stereumUpdate.current_commit ? true : false;
      }
      return false;
    },
    notifHandler() {
      if (this.checkStereumUpdate == true) {
        this.notification = true;
      } else {
        this.notification = false;
      }
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
* {
  box-sizing: border-box;
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
  height: 45%;
  display: flex;
  flex-direction: column;
  position: relative;
  justify-content: space-between;
  align-items: flex-start;
  padding: 5% 5%;
}

.status-box_header {
  width: 90%;
  height: 15%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #23272a;
  border: 1px solid #4c4848;
  border-radius: 5px;
  box-shadow: 1px 1px 5px 1px #171717;
}

.status-box_messages {
  width: 100%;
  height: 82%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  background: #23272a;
  border: 1px solid #4c4848;
  border-radius: 5px;
  box-shadow: 1px 1px 5px 1px #171717;
}

.icon-line {
  display: flex;
  width: 100%;
  height: 90%;
}

.status-icon {
  width: 23%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 1.5px;
}

.status-icon img {
  width: 95%;
  height: 98%;
}

.status-message_yellow,
.status-message_red,
.status-message_green {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 95%;
  height: 22%;
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

.message-icon {
  width: 28%;
  height: 95%;
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

.warning {
  display: flex;
  width: 80%;
  height: 10%;
  font-size: 8%;
  justify-content: flex-start;
  align-items: center;
  font-weight: 500;
}

.main-message {
  display: flex;
  width: 95%;
  height: 50%;
  justify-content: flex-start;
  align-items: center;
  font-size: 40%;
  font-weight: 800;
}

.val-message {
  display: flex;
  width: 95%;
  height: 35%;
  justify-content: flex-start;
  align-items: center;
  font-size: 45%;
  font-weight: 800;
}
</style>
