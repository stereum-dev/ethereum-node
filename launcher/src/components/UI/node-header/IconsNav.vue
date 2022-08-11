<template>
  <div class="icons-box">
    <div class="icon-btn">
      <img alt="help-icon" src="/img/icon/header-icons/question-mark.png" />
    </div>

    <div class="icon-btn">
      <img alt="Login" src="/img/icon/header-icons/megaphone9.png" />
    </div>
    <div class="icon-btn" @click="updateModalHandler" v-if="isUpdateAvailable">
      <img alt="update-icon" src="/img/icon/header-icons/update-green.png" />
    </div>
    <div
      class="icon-btn"
      @click="updateModalHandler"
      v-else
      @mouseover="showUpdateText = true"
      @mouseleave="showUpdateText = false"
    >
      <img alt="update-icon" src="/img/icon/header-icons/update-blue.png" />
    </div>

    <router-link to="/setting" class="icon-btn">
      <div>
        <img alt="Login" src="/img/icon/header-icons/setting4.png" />
      </div>
    </router-link>

    <div class="icon-btn">
      <img alt="Login" src="/img/icon/header-icons/exit9.png" />
    </div>
    <update-panel
      v-if="displayUpdatePanel"
      @update-confirm="updateConfirmationHandler"
      @run-update="runUpdate"
      @update-all="runAllUpdates"
      @click-out="removeUpdateModal"
      :class="{ 'updatePanel-show': displayUpdatePanel }"
    ></update-panel>
  </div>
</template>
<script>
import ControlService from "@/store/ControlService";
import UpdatePanel from "./UpdatePanel.vue";
import { useNodeHeader } from "../../../store/nodeHeader";
import { mapWritableState } from "pinia";
import { useServices } from "../../../store/services";
export default {
  components: { UpdatePanel },
  data() {
    return {
      displayUpdatePanel: false,
    };
  },
  computed: {
    ...mapWritableState(useNodeHeader, {
      forceUpdateCheck: "forceUpdateCheck",
      isUpdateAvailable: "isUpdateAvailable",
      updating: "updating",
    }),
    ...mapWritableState(useServices, {
      newUpdates: "newUpdates",
      versions: "versions",
    }),
  },
  methods: {
    runAllUpdates: async function () {
      await ControlService.runAllUpdates();
    },
    updateModalHandler() {
      this.displayUpdatePanel = !this.displayUpdatePanel;
    },
    removeUpdateModal() {
      this.displayUpdatePanel = false;
    },
    updateConfirmationHandler: async function () {
      this.displayUpdatePanel = false;
      this.updateWaitingModal = true;
      this.updating = true;
      await this.runAllUpdates();
      this.updating = false;
      this.versions = {};
      this.updateWaitingModal = false;
    },
    async runUpdate(item) {
      item.running = true;
      if (item && item.id) {
        this.updating = true;
        await ControlService.updateServices({ service: item.id });
        this.updating = false;
        this.forceUpdateCheck = true;
      } else if (item && item.commit) {
        this.updating = true;
        await ControlService.updateStereum({ commit: item.commit });
        this.updating = false;
        this.forceUpdateCheck = true;
      }
    },
  },
};
</script>
<style scoped>
.icons-box {
  width: 25%;
  max-width: 250px;
  height: 80%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.icon-btn {
  width: 14.5%;
  height: 85%;
  border-radius: 100%;
  background-color: #336666;
  box-shadow: 1px 1px 3px 1px rgb(33, 58, 53);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.icon-btn div {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.icon-btn {
  width: 14%;
  height: 85%;
  border: 2px solid #a5a5a5;
  border-radius: 100%;
  background-color: #336666;
  box-shadow: 1px 1px 5px 1px rgb(33, 58, 53);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  transition-duration: 200ms;
}
.icon-btn:hover {
  background-color: #274f4f;
  border: 2px solid rgb(141, 141, 141);
  transition-duration: 200ms;
}
.icon-btn:active {
  box-shadow: none;
  background-color: #274f4f;
  transition-duration: 200ms;
  transform: scale(0.92);
}
.icon-btn:active img {
  /* width: 65%;
  height: 65%; */
  box-shadow: none;
}
.icon-btn img {
  width: 70%;
  height: 70%;
  transform: scale(1);
}
.help-text {
  width: 20px;
  height: 5px;
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  position: absolute;
  bottom: -10px;
  left: 3px;
  transition-duration: 500ms;
}
.notif-text {
  width: 20px;
  height: 5px;
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  position: absolute;
  bottom: -10px;
  left: -20px;
  transition-duration: 500ms;
}
.update-text {
  width: 20px;
  height: 5px;
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  position: absolute;
  bottom: -10px;
  left: -4px;
  transition-duration: 500ms;
}
.setting-text {
  width: 20px;
  height: 5px;
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  position: absolute;
  bottom: -10px;
  left: -2px;
  transition-duration: 500ms;
}
.exit-text {
  width: 20px;
  height: 5px;
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  position: absolute;
  bottom: -10px;
  left: 6px;
  transition-duration: 500ms;
}
.updatePanel-show {
  transition-duration: 500ms;
  right: 0 !important;
}
</style>
