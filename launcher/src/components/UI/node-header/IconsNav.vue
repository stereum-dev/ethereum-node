<template>
  <div class="icons-box">
    <div class="icon-btn" @click="supportModalOpen">
      <img alt="help" src="/img/icon/header-icons/question-mark.png" />
    </div>

    <div class="icon-btn" @click="notifModalOpen">
      <img alt="notification" src="/img/icon/header-icons/megaphone9.png" />
    </div>
    <div v-if="isUpdateAvailable || isOsUpdateAvailable" class="icon-btn" @click="updateModalHandler">
      <img alt="update-icon" src="/img/icon/header-icons/update-green.png" />
    </div>
    <div
      v-else
      class="icon-btn"
      @click="updateModalHandler"
      @mouseover="showUpdateText = true"
      @mouseleave="showUpdateText = false"
    >
      <img alt="update-icon" src="/img/icon/header-icons/update-blue.png" />
    </div>

    <router-link to="/setting" class="icon-btn">
      <div>
        <img alt="setting" src="/img/icon/header-icons/setting4.png" />
      </div>
    </router-link>

    <div class="icon-btn" @click="logoutModalHandler">
      <img alt="logout" src="/img/icon/header-icons/exit9.png" />
    </div>
    <update-panel
      ref="UpdatePanelComp"
      :click-bg="displayUpdatePanel"
      :class="{ 'updatePanel-show': displayUpdatePanel }"
      @update-confirm="updateConfirmationHandler"
      @run-update="runUpdate"
      @run-os-update="runOsUpdate"
      @click-out="removeUpdateModal"
    ></update-panel>
    <logout-modal
      v-if="logoutModalIsActive"
      @close-me="clickToCancelLogout"
      @confrim-logout="loggingOut"
    ></logout-modal>
    <support-modal v-if="supportModalIsActive" @close-me="supportModalClose"></support-modal>
    <notif-modal v-if="notificationModalIsActive" @close-me="notifModalClose"></notif-modal>
    <TutorialGuide v-if="tutorial" />
  </div>
</template>
<script>
import ControlService from "@/store/ControlService";
import UpdatePanel from "./UpdatePanel.vue";
import LogoutModal from "./LogoutModal.vue";
import SupportModal from "./SupportModal.vue";
import NotifModal from "./NotifModal.vue";
import { useNodeHeader } from "../../../store/nodeHeader";
import { mapWritableState } from "pinia";
import { useServices } from "../../../store/services";
import TutorialGuide from "../the-node/TutorialGuide.vue";
export default {
  components: { UpdatePanel, LogoutModal, SupportModal, NotifModal, TutorialGuide },
  data() {
    return {
      test: true,
      displayUpdatePanel: false,
      logoutModalIsActive: false,
      supportModalIsActive: false,
      notificationModalIsActive: false,
    };
  },
  computed: {
    ...mapWritableState(useNodeHeader, {
      forceUpdateCheck: "forceUpdateCheck",
      isUpdateAvailable: "isUpdateAvailable",
      updating: "updating",
      isOsUpdateAvailable: "isOsUpdateAvailable",
      osUpdating: "osUpdating",
      searchingForOsUpdates: "searchingForOsUpdates",
      refresh: "refresh",
      stereumUpdate: "stereumUpdate",
      tutorial: "tutorial",
    }),
    ...mapWritableState(useServices, {
      newUpdates: "newUpdates",
      versions: "versions",
    }),
  },
  methods: {
    updateConfirmationHandler: async function () {
      let seconds = 0;
      try {
        this.refresh = false;
        this.updating = true;
        this.newUpdates.forEach((update) => (update.running = true));
        seconds = await ControlService.runAllUpdates({ commit: this.stereumUpdate.commit });
      } catch (err) {
        console.log("Running All Updates Failed: ", err);
      } finally {
        this.forceUpdateCheck = true;
        this.updating = false;
        this.versions = {};
        this.newUpdates = [];
        this.refresh = true;
        await ControlService.restartServices(seconds);
      }
    },
    async runUpdate(item) {
      let seconds = 0;
      try {
        this.refresh = false;
        item.running = true;
        this.updating = true;
        if (item && item.id) {
          seconds = await ControlService.updateServices({ services: item.id });
        } else if (item && item.commit) {
          seconds = await ControlService.updateStereum({ commit: item.commit });
        }
      } catch (err) {
        console.log(JSON.stringify(item) + "\nUpdate Failed", err);
      } finally {
        this.forceUpdateCheck = true;
        this.refresh = true;
        this.newUpdates = this.newUpdates.filter((u) => {
          if (item && item.id) {
            return u.id != item.id;
          } else if (item && item.commit) {
            return u.commit != item.commit;
          }
        });
        await ControlService.restartServices(seconds);
        this.updating = false;
      }
    },
    async runOsUpdate() {
      try {
        this.osUpdating = true;
        await ControlService.updateOS();
      } catch (err) {
        console.log("OS Update Failed", err);
      }
      this.osUpdating = false;
      this.searchingForOsUpdates = false;
      this.$refs.UpdatePanelComp.osUpdating = false;
      this.$refs.UpdatePanelComp.searchingForOsUpdates = false;
      await this.$refs.UpdatePanelComp.searchOsUpdates();
    },
    clickToCancelLogout() {
      this.logoutModalIsActive = false;
    },
    logoutModalHandler() {
      this.logoutModalIsActive = true;
    },
    async loggingOut() {
      this.refresh = false
      await ControlService.logout();
      this.$router.push("/").then(() => {
        location.reload();
      });
    },
    updateModalHandler() {
      if (!this.updating) this.forceUpdateCheck = true;
      this.displayUpdatePanel = !this.displayUpdatePanel;
    },
    removeUpdateModal() {
      this.displayUpdatePanel = false;
    },
    notifModalOpen() {
      this.notificationModalIsActive = true;
    },
    notifModalClose() {
      this.notificationModalIsActive = false;
    },
    supportModalOpen() {
      this.supportModalIsActive = true;
    },
    supportModalClose() {
      this.supportModalIsActive = false;
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
  right: 0 !important;
}
</style>
