<template>
  <div class="alert-box_parent">
    <!-- <comming-soon></comming-soon> -->
    <div class="alert-box">
      <div class="alert-box_header">
        <div class="icon_alarm" v-if="perfect">
          <img
            src="../../../../public/img/icon/control/NOTIFICATION_GRUN.png"
            alt="green"
          />
        </div>
        <div class="icon_alarm" v-if="warning">
          <img
            src="../../../../public/img/icon/control/WARNSCHILD_GELB.png"
            alt="green"
          />
        </div>
        <div class="icon_alarm" v-if="alarm">
          <img
            src="../../../../public/img/icon/control/WARNSCHILD_ROT.png"
            alt="green"
          />
        </div>
        <div class="icon_alarm" v-if="notification">
          <img
            src="../../../../public/img/icon/control/SETTINGS.png"
            alt="green"
          />
        </div>
      </div>
      <div class="alert-box_messages">
        <div class="alert-message_yellow" v-if="storageWarning">
          <div class="icon-box">
            <img
              src="../../../../public/img/icon/control/WARNSCHILD_GELB_storage.png"
              alt="warn_storage"
            />
          </div>
          <div class="message-box">
            <div class="warning"><span>WARNING</span></div>
            <div class="main-message"><span>LOW STORAGE SPACE</span></div>
            <div class="val-message">{{ availDisk }} GB Free</div>
          </div>
        </div>
        <div class="alert-message_yellow" v-if="cpuWarning">
          <div class="icon-box">
            <img
              src="../../../../public/img/icon/control/WARNSCHILD_GELB_cpu.png"
              alt="warn_storage"
            />
          </div>
          <div class="message-box">
            <div class="warning"><span>WARNING</span></div>
            <div class="main-message"><span>CPU USAGE</span></div>
            <div class="val-message">
              <span> > {{ cpu }}%</span>
            </div>
          </div>
        </div>
        <div class="alert-message_red" v-if="cpuAlarm">
          <div class="icon-box">
            <img
              src="../../../../public/img/icon/control/red_warning_cpu.png"
              alt="warn_storage"
            />
          </div>
          <div class="message-box">
            <div class="warning"><span>CRITICAL WARNING</span></div>
            <div class="main-message"><span>CPU USAGE</span></div>
            <div class="val-message">
              <span> > {{ cpu }}%</span>
            </div>
          </div>
        </div>
        <div class="alert-message_red" v-if="missedAttest">
          <div class="icon-box">
            <img
              src="../../../../public/img/icon/control/key-rot.png"
              alt="warn_storage"
            />
          </div>
          <div class="message-box">
            <div class="warning"><span>CRITICAL WARNING</span></div>
            <div class="main-message"><span>MISSED ATTESTATION</span></div>
          </div>
        </div>
        <div class="alert-message_green" v-if="newUpdate">
          <div class="icon-box">
            <img
              src="../../../../public/img/icon/control/logo-icon.png"
              alt="warn_storage"
            />
          </div>
          <div class="message-box">
            <div class="warning"><span>NOTIFICATION</span></div>
            <div class="main-message"><span>STEREUM UPDATE</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { useControlStore } from "../../../store/theControl";
import { mapState } from "pinia";
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
      missedAttest: false,
    };
  },
  computed: {
    ...mapState(useControlStore, {
      availDisk: "availDisk",
      usedPerc: "usedPerc",
      cpu: "cpu",
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
  },
  methods: {
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
  },
};
</script>
<style scoped>
.alert-box_parent {
  width: 90%;
  height: 99%;
  margin-left: 3px;
  border: 5px solid rgb(55, 55, 55);
  border-radius: 20px;
  background-color: #464a44;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
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
  border: 1px solid #707070;
  border-radius: 5px;
  box-shadow: 1px 1px 5px 1px rgb(0, 23, 23);
  padding: 1px;
}
.icon_alarm {
  width: 23%;
  height: 95%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  margin: 0 1.5px;
}
.icon_alarm img {
  width: 100%;
  height: 100%;
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
  height: 12%;
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
  height: 12%;
  background: #be3635;
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
  height: 12%;
  background: #5f7e6a;
  border: 1px solid #707070;
  border-radius: 5px;
  margin: 2px 0;
  color: #eee;
}
.icon-box {
  width: 25%;
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
  width: 70%;
  height: 75%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: column;
}
.warning {
  display: flex;
  width: 80%;
  height: 10%;
  font-size: 10%;
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
