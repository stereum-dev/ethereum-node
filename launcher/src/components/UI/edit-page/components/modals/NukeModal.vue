<template>
  <div class="remove-modal-parent">
    <div class="modal-opacity" @click="closeMe"></div>
    <div v-if="visible" class="remove-modal-content">
      <div class="title-box">
        <img src="/img/icon/edit-node-icons/stop-caution-icon.png" />
      </div>
      <div class="remove-message">
        <span class="warning">{{ $t("nukeModal.nukeQ") }} </span>
      </div>
      <div class="remove-btn">
        <div :class="['save-config-btn', loadingDumpClass]" @click="dumpLogs">
          <img :src="loadingIconsClass" alt="" :class="loadingBtnClass" /><span>dump logs</span>
        </div>
        <div :class="['yes-box', loadingDumpClass]" @click="removeItems">
          <span>{{ $t("nukeModal.nukeTitle") }}</span>
        </div>
      </div>
      <span class="close">{{ $t("exitValidatorModal.clickClose") }}</span>
    </div>
    <div v-else class="remove-modal-accepted">
      <div class="remove-modal-accepted_container" :style="{ backgroundImage: nukeNode }">
        <div class="remove-modal-accepted_header">
          <span>{{ $t("nukeModal.nukeTitle") }}</span>
        </div>
        <div class="remove-modal-accepted_explode-box" @mouseenter="disableAutoScroll" @mouseleave="enableAutoScroll">
          <div v-for="n in nukeData" :key="n" class="item">
            <div class="state">✓</div>
            <div class="textItem">{{ n }}</div>
          </div>
        </div>

        <div class="remove-modal-accepted_footer" :class="{ deactive: loginBtn }">
          <div v-if="loginBtn" class="spinner">
            <img src="/animation/loading/mushroom-spinner.gif" alt="" />
          </div>
          <span v-else @click="backToLogin">{{ $t("nukeModal.backToLogin") }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ControlService from "@/store/ControlService";
import JSZip from "jszip";
import { saveAs } from "file-saver";
export default {
  emit: ["remove-items", "close-me", "back-to-login"],
  data() {
    return {
      visible: true,
      //demoData is dummy
      demoData: [
        "my super very ultra long string data 1",
        "my long string data 2",
        "my very long string data 3",
        "my very ultra long string data 4",
        "my string data 5",
        "my super very ultra long string data 6",
        "my very long string data 7",
        "my long string data 8",
        "my super very long string data 9",
      ],
      nukeData: [],
      loginBtn: true,
      nukeNode: "url('./animation/nuke-node/nuke_node.gif')",
      autoScroll: true,
      loadingDump: false,
    };
  },

  computed: {
    loadingDumpClass() {
      return this.loadingDump ? "deactivate" : "";
    },
    loadingBtnClass() {
      return this.loadingDump ? "animate-spin" : "";
    },
    loadingIconsClass() {
      return this.loadingDump ? "/img/icon/loading-icons/loading-circle.png" : "/img/icon/service-log-icons/150-log-export-button.png";
    },
  },
  mounted() {
    // @frontend: uncomment the block below to use nuke dummy data to style the content
    // --------------------------------------------------------------------------------
    // this.visible = !this.visible;
    // setInterval(() => {
    //   if (this.demoData.length > 0) {
    //     this.nukeData.push(this.demoData.shift());
    //   } else {
    //     this.loginBtn = false;
    //   }
    // }, 1000);
    // --------------------------------------------------------------------------------
    setInterval(() => {
      this.updateScroll();
    }, 100);
  },
  methods: {
    //dummy method to simulate the nuke process
    async dumpLogs() {
      this.loadingDump = true;
      const allLogs = await ControlService.dumpDockerLogs();
      this.exportLogs(allLogs);
      this.loadingDump = false;
    },
    exportLogs(logs) {
      try {
        if (logs.length > 0) {
          const zip = new JSZip();

          logs.forEach((item) => {
            const fileName = `${item.containerId}.txt`;
            const fileContent = item.logs.join("\n");
            zip.file(fileName, fileContent);
          });

          zip.generateAsync({ type: "blob" }).then(function (blob) {
            saveAs(blob, "stereum_logs.zip");
          });
        }
      } catch (err) {
        console.log("Failed exporting config: ", err);
      }
    },
    //end dummy method
    disableAutoScroll() {
      this.autoScroll = false;
    },
    enableAutoScroll() {
      this.autoScroll = true;
    },
    updateScroll() {
      this.$nextTick(function () {
        if (!this.autoScroll) return;
        try {
          var element = this.$el.querySelector(".remove-modal-accepted_explode-box");
          element.scrollTop = element.scrollHeight + 9999;
        } catch (e) {}
      });
    },
    removeItems() {
      this.visible = !this.visible;
      this.$emit("remove-items");
    },
    closeMe() {
      if (this.visible === true) {
        this.$emit("close-me");
      }
    },
    backToLogin() {
      this.$emit("back-to-login");
    },
  },
};
</script>
<style scoped>
.deactivate {
  opacity: 0.5;
  box-shadow: none;
  pointer-events: none;
  cursor: not-allowed;
}
.item {
  width: 100%;
  display: flex;
  color: #eee;
  justify-content: flex-start;
  align-items: center;
  margin: 1% 0;
  font-size: 80%;
  font-weight: 700;
  text-transform: uppercase;
}
.state {
  width: 25px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: green;
  border-radius: 50%;
  border: 1px solid black;
  margin: 0 1%;
}

.textItem {
  white-space: nowrap;
  -webkit-text-stroke: 1px black;
  text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
}
.remove-modal-parent {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 10%;
  left: 5%;
  z-index: 310;
}
.modal-opacity {
  width: 100%;
  height: 100%;
  background-color: black;
  position: fixed;
  left: 0;
  top: 0;
  opacity: 0.7;
  z-index: 311;
}
.remove-modal-content {
  width: 60%;
  height: 70%;
  border-radius: 55px;
  border: 3px solid #bfbfbf;
  position: absolute;
  top: 4%;
  left: 15%;
  background-color: #1c1d1d;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  box-shadow: 1px 1px 5px 1px rgb(6, 6, 6);
  z-index: 502;
}
.remove-modal-accepted {
  width: 60%;
  height: 70%;
  border-radius: 55px;
  border: 3px solid #bfbfbf;
  position: absolute;
  top: 4%;
  left: 15%;
  position: relative;
  background: repeating-linear-gradient(45deg, #fcd100, #fcd100 2%, #181b1d 2%, #181b1d 4%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 1px 1px 5px 1px rgb(6, 6, 6);
  z-index: 502;
}
.remove-modal-accepted_container {
  width: 95%;
  height: 95%;

  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 55px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
}

.remove-modal-accepted_header {
  width: 40%;
  height: 12%;
  border: 2px solid #fcd100;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background: #181b1d;
  color: #fcd100;
  font-size: 120%;
  text-transform: uppercase;
  font-weight: 700;
  margin: 2% 0;
  z-index: 1;
}
.remove-modal-accepted_explode-box {
  width: 90%;
  height: 50%;
  display: flex;
  border-top: 2px solid black;
  border-bottom: 2px solid black;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  overflow-y: scroll;
}

.remove-modal-accepted_footer {
  width: 40%;
  height: 15%;
  border: 2px solid #181b1d;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background: #fcd100;
  color: #181b1d;
  font-size: 120%;
  text-transform: uppercase;
  font-weight: 700;
  box-shadow: 0px 0px 10px 0px rgb(40, 39, 39);
  margin: 2% 0;
  z-index: 1;
  cursor: pointer;
}
.spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  user-select: none;
}
.spinner img {
  width: 28%;
}
.deactive {
  background-color: rgba(250, 208, 0, 0.5);
}
.remove-modal-accepted_footer:active {
  box-shadow: none;
  transform: scale(0.9);
}
.title-box {
  width: 80%;
  height: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}
.title-box img {
  width: 25%;
  height: 100%;
}
.remove-message {
  width: 90%;
  height: 40%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.remove-message .warning {
  color: rgb(195, 195, 195);
  font-size: 1.3rem;
  font-weight: 800;
  text-transform: uppercase;
  align-items: center;
  text-align: center;
}
.remove-message .question {
  color: rgb(195, 195, 195);
  font-size: 1.2rem;
  font-weight: 600;
  text-transform: capitalize;
}
.remove-btn {
  width: 90%;
  height: 45%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.save-config-btn {
  box-shadow: 0 1px 10px 1px rgb(16, 16, 16);
  cursor: pointer;
  width: 35%;
  height: 35px;
  background: rgb(60, 96, 154);
  border-radius: 10px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.save-config-btn span {
  color: #eee;
  font-size: 0.9rem;
  text-transform: uppercase;
  font-weight: 700;
}
.save-config-btn img {
  height: 85%;
}
.save-config-btn:active {
  transform: scale(0.9);
  transition: all 100ms ease-in-out;
  box-shadow: none;
}
.yes-box {
  width: 35%;
  height: 35px;
  border-radius: 10px;
  box-shadow: 0 1px 10px 1px rgb(16, 16, 16);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: repeating-linear-gradient(45deg, #fcd100, #fcd100 4%, #181b1d 4%, #181b1d 8%);
}
.yes-box span {
  font-size: 0.9rem;
  font-weight: 700;
  color: #fad000;
  text-transform: uppercase;
  background: black;
  width: 95%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  padding: 5px 10px;
}

.yes-box:hover {
  transform: scale(1.05);
  transition: all 200ms ease-in-out;
  color: #d6d6d6;
}

.yes-box:active {
  transform: scale(1);
  box-shadow: none;
}

.close {
  color: rgb(243, 74, 74);
  font-size: 0.7rem;
  font-weight: 500;
  align-self: center;
}
::-webkit-scrollbar {
  width: none;
}

/* Track */
::-webkit-scrollbar-track {
  background: none;
  box-sizing: border-box;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #fad000;
  border-radius: none;
}
</style>
