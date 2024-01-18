<template>
  <div class="icons-box">
    <div
      class="icon-btn"
      @click="supportModalOpen"
      @mouseenter="cursorLocation = `${help}`"
      @mouseleave="cursorLocation = ''"
      @mousedown.prevent
    >
      <img alt="help" src="/img/icon/header-icons/question-mark.png" />
    </div>

    <div
      class="icon-btn"
      @click="notifModalOpen"
      @mouseenter="cursorLocation = `${notif}`"
      @mouseleave="cursorLocation = ''"
      @mousedown.prevent
    >
      <img alt="notification" src="/img/icon/header-icons/megaphone9.png" />
    </div>
    <div
      v-if="isUpdateAvailable || isOsUpdateAvailable"
      class="icon-btn"
      @click="updateModalHandler"
      @mouseenter="cursorLocation = `${availableUpdt}`"
      @mouseleave="cursorLocation = ''"
      @mousedown.prevent
    >
      <img alt="update-icon" src="/img/icon/header-icons/update-green.png" />
    </div>
    <div
      v-else
      class="icon-btn"
      @click="updateModalHandler"
      @mouseover="showUpdateText = true"
      @mouseenter="cursorLocation = `${updtPan}`"
      @mouseleave="(showUpdateText = false), (cursorLocation = '')"
      @mousedown.prevent
    >
      <img alt="update-icon" src="/img/icon/header-icons/update-blue.png" />
    </div>

    <router-link
      to="/setting"
      class="icon-btn"
      @mouseenter="cursorLocation = `${setting}`"
      @mouseleave="cursorLocation = ''"
      @mousedown.prevent
    >
      <div>
        <img alt="setting" src="/img/icon/header-icons/setting4.png" />
      </div>
    </router-link>

    <div
      class="icon-btn"
      @click="logoutModalHandler"
      @mouseenter="cursorLocation = `${logOutBtn}`"
      @mouseleave="cursorLocation = ''"
      @mousedown.prevent
    >
      <img alt="logout" src="/img/icon/header-icons/exit9.png" />
    </div>

    <update-panel
      v-if="displayUpdatePanel"
      ref="UpdatePanelComp"
      @update-confirm="updateConfirmationHandler"
      @run-update="runUpdate"
      @run-os-update="runOsUpdate"
      @click-outside="removeUpdateModal"
    ></update-panel>

    <reconnect-modal
      v-if="!stereumStatus"
      @open-logout="logoutModalHandler"
      @confirm-reconnect="reconnect"
    ></reconnect-modal>

    <logout-modal
      v-if="logoutModalIsActive"
      @close-me="clickToCancelLogout"
      @confrim-logout="loggingOut"
    ></logout-modal>
    <support-modal v-if="supportModalIsActive" @close-me="supportModalClose"></support-modal>
    <notif-modal v-if="notificationModalIsActive" @close-me="notifModalClose"></notif-modal>
    <TutorialGuide v-if="tutorial" />
    <StakeGuide v-if="stakeGuide" />
  </div>
</template>

<script>
import { useFooter } from "@/store/theFooter";
import ControlService from "@/store/ControlService";
import UpdatePanel from "./UpdatePanel.vue";
import LogoutModal from "./LogoutModal.vue";
import ReconnectModal from "./ReconnectModal.vue";
import SupportModal from "./SupportModal.vue";
import NotifModal from "./NotifModal.vue";
import { useNodeHeader } from "../../../store/nodeHeader";
import { mapWritableState } from "pinia";
import { useServices } from "../../../store/services";
import { useUpdateCheck } from "@/composables/version";
import TutorialGuide from "../the-node/TutorialGuide.vue";
import StakeGuide from "../the-node/StakeGuide.vue";
export default {
  components: {
    UpdatePanel,
    LogoutModal,
    ReconnectModal,
    SupportModal,
    NotifModal,
    TutorialGuide,
    StakeGuide,
  },
  data() {
    return {
      test: true,
      logoutModalIsActive: false,
      reconnectModalIsActive: false,
      supportModalIsActive: false,
      // notificationModalIsActive: false,
      help: this.$t("headerBtn.help"),
      notif: this.$t("headerBtn.notif"),
      availableUpdt: this.$t("headerBtn.availableUpdt"),
      updtPan: this.$t("headerBtn.updtPan"),
      setting: this.$t("headerBtn.setting"),
      logOutBtn: this.$t("headerBtn.logOutBtn"),
    };
  },
  computed: {
    ...mapWritableState(useNodeHeader, {
      displayUpdatePanel: "displayUpdatePanel",
      isUpdateAvailable: "isUpdateAvailable",
      updating: "updating",
      isOsUpdateAvailable: "isOsUpdateAvailable",
      osUpdating: "osUpdating",
      searchingForOsUpdates: "searchingForOsUpdates",
      refresh: "refresh",
      reconnecting: "reconnecting",
      stereumUpdate: "stereumUpdate",
      tutorial: "tutorial",
      stakeGuide: "stakeGuide",
      notificationModalIsActive: "notificationModalIsActive",
    }),
    ...mapWritableState(useServices, {
      newUpdates: "newUpdates",
      versions: "versions",
    }),
    ...mapWritableState(useFooter, {
      cursorLocation: "cursorLocation",
      stereumStatus: "stereumStatus",
    }),
  },

  methods: {
    updateConfirmationHandler: async function () {
      let seconds = 0;
      try {
        this.refresh = false;
        this.updating = true;
        this.newUpdates.forEach((update) => (update.running = true));
        seconds = await ControlService.runAllUpdates({
          commit: this.stereumUpdate.commit,
        });
      } catch (err) {
        console.log("Running All Updates Failed: ", err);
      } finally {
        this.updating = false;
        this.versions = {};
        this.newUpdates = [];
        this.refresh = true;
        // search for updates afterwards
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
        this.refresh = true;
        this.newUpdates = this.newUpdates.filter((u) => {
          if (item && item.id) {
            return u.id != item.id;
          } else if (item && item.commit) {
            return u.commit != item.commit;
          }
        });
        this.updating = false;
        // Search for updates afterwards
        await ControlService.restartServices(seconds);
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
      this.refresh = false;
      await ControlService.logout();
      this.$router.push("/").then(() => {
        location.reload();
      });
    },
    async reconnect() {
      console.log("reconnecting");
      this.reconnecting = true;
      await ControlService.reconnect();
      this.reconnecting = false;
      this.refresh = true;
    },
    updateModalHandler() {
      this.displayUpdatePanel = true;
      useUpdateCheck();
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
.slide-fade-enter-active {
  transition: all 0.5s ease-in-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from {
  transform: translateX(405px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateX(405px);
  opacity: 0;
}
.icons-box {
  width: 25%;
  max-width: 250px;
  height: 65%;
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
  width: 30px;
  height: 30px;
  border: 1px solid #597777;
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
  border: 1px solid #84abab;
  transition-duration: 100ms;
}

.icon-btn:active {
  box-shadow: none;
  transition-duration: 100ms;
  transform: scale(0.95);
}

.icon-btn img {
  width: 67%;
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
