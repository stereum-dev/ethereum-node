<template>
  <div
    class="flex flex-col justify-between box-border items-center w-screen h-screen border-2 border-slate-500 rounded-lg z-30 select-none"
  >
    <HeaderScreen />

    <div class="flex justify-center items-center w-full h-full max-h-[503px] bg-[#33393E]">
      <LoaderAnime v-if="isPageLoading" :anime="getLoadingAnime" />
      <slot></slot>
    </div>
    <div class="w-full h-[30px] rounded-b-lg bg-[#33393E]" @pointerdown.prevent.stop @mousedown.prevent.stop>
      <TheFooter />
      <TaskManager />
    </div>
    <Transition name="slide-fade">
      <MultiServerScreen
        v-if="
          serverStore.isServerAccessManagementActive &&
          router.currentRoute.value.fullPath !== '/config/play' &&
          router.currentRoute.value.fullPath !== '/oneClick/play' &&
          router.currentRoute.value.fullPath !== '/custom/play' &&
          router.currentRoute.value.fullPath !== '/login'
        "
      />
    </Transition>
    <GrafanaModal v-if="headerStore.showGrafanaWindow" @close-window="closeServiceBrowser" />
    <SsvModal v-if="headerStore.showSsvWindow" @close-window="closeServiceBrowser" />
    <PrometheusModal v-if="headerStore.showPrometheusWindow" @close-window="closeServiceBrowser" />
    <MevboostModal v-if="headerStore.showMevboostWindow" @close-window="closeServiceBrowser" />
    <ObolModal v-if="headerStore.showObolCharonWindow" @close-window="closeServiceBrowser" />
    <SsvDkg v-if="headerStore.showSsvDkgWindow" @close-window="closeServiceBrowser" />
    <UpdatePanel
      v-if="headerStore.displayUpdatePanel"
      ref="UpdatePanelCompRef"
      @run-update="runUpdate"
      @run-os-update="runOsUpdate"
      @click-outside="closeServiceBrowser"
    />

    <ReconnectModal v-if="!footerStore.stereumStatus" @open-logout="loggingOut" @confirm-reconnect="reconnect" />

    <LogoutModal v-if="headerStore.logoutModalIsActive" @close-window="closeMenuWindow" @confrim-logout="loggingOut" />

    <SupportModal v-if="headerStore.supportModalIsActive" @close-window="closeMenuWindow" />
    <NotifModal v-if="headerStore.notificationModalIsActive" @close-window="closeMenuWindow" />
    <TutorialGuide v-if="headerStore.isTutorialActive" />
    <StakeGuide v-if="headerStore.stakeGuideActive" />
  </div>
</template>
<script setup>
import { computed, onMounted, ref } from "vue";

import TheFooter from "../layers/TheFooter.vue";
import LogoutModal from "../UI/base-header/components/modals/LogoutModal.vue";
import NotifModal from "../UI/base-header/components/modals/NotifModal.vue";
import ReconnectModal from "../UI/base-header/components/modals/ReconnectModal.vue";
import SupportModal from "../UI/base-header/components/modals/SupportModal.vue";
import UpdatePanel from "../UI/base-header/components/modals/UpdatePanel.vue";
import HeaderScreen from "../UI/base-header/HeaderScreen.vue";
import StakeGuide from "../UI/guide-page/StakeGuide.vue";
import TutorialGuide from "../UI/guide-page/TutorialGuide.vue";
import MultiServerScreen from "../UI/server-management/MultiServerScreen.vue";
import GrafanaModal from "../UI/services-modal/GrafanaModal.vue";
import MevboostModal from "../UI/services-modal/MevboostModal.vue";
import ObolModal from "../UI/services-modal/ObolModal.vue";
import PrometheusModal from "../UI/services-modal/PrometheusModal.vue";
import SsvDkg from "../UI/services-modal/SsvDkg.vue";
import SsvModal from "../UI/services-modal/SsvModal.vue";
import TaskManager from "../UI/task-manager/TaskManager.vue";
import LoaderAnime from "../UI/edit-page/components/loader-anime/LoaderAnime.vue";

import { useUpdateCheck } from "@/composables/version";
import ControlService from "@/store/ControlService";
import { useNodeHeader } from "@/store/nodeHeader";
import { useServers } from "@/store/servers";
import { useServices } from "@/store/services.js";
import { useFooter } from "@/store/theFooter";
import { useRouter } from "vue-router";

const router = useRouter();
const serverStore = useServers();
const headerStore = useNodeHeader();
const footerStore = useFooter();
const serviceStore = useServices();
const UpdatePanelCompRef = ref(null);
const isPageLoading = ref(false);

const getLoadingAnime = computed(() => {
  return "/animation/setup/loader.gif";
});

onMounted(() => {
  useUpdateCheck();
});

const closeServiceBrowser = () => {
  headerStore.setServiceModal(null);
};

const closeMenuWindow = () => {
  headerStore.setMenuModal(null);
};

const runUpdate = async (item) => {
  let seconds = 0;
  try {
    headerStore.refresh = false;
    item.running = true;
    headerStore.updating = true;
    if (item && item.id) {
      seconds = await ControlService.updateServices({ services: item.id });
    } else if (item && item.commit) {
      seconds = await ControlService.updateStereum({ commit: item.commit });
    }
  } catch (err) {
    console.log(JSON.stringify(item) + "\nUpdate Failed", err);
  } finally {
    headerStore.refresh = true;
    serviceStore.newUpdates = serviceStore.newUpdates.filter((u) => {
      if (item && item.id) {
        return u.id != item.id;
      } else if (item && item.commit) {
        return u.commit != item.commit;
      }
    });
    headerStore.updating = false;
    // Search for updates afterwards
    await ControlService.restartServices(seconds);
  }
};
const runOsUpdate = async () => {
  try {
    headerStore.osUpdating = true;
    await ControlService.updateOS();
  } catch (err) {
    console.log("OS Update Failed", err);
  } finally {
    headerStore.osUpdating = false;
    headerStore.searchingForOsUpdates = false;

    // Accessing the ref's component methods and properties
    if (UpdatePanelCompRef.value) {
      UpdatePanelCompRef.value.osUpdating = false;
      UpdatePanelCompRef.value.searchingForOsUpdates = false;
      await UpdatePanelCompRef.value.searchOsUpdates();
    }
  }
};

const loggingOut = async () => {
  serverStore.connectingAnimActive = false;
  headerStore.refresh = false;
  serverStore.isTerminalStopped = true;
  try {
    await ControlService.stopShell();
    await ControlService.logout();
  } catch (e) {}
  router.push("/login").then(() => {
    location.reload();
  });
};

const reconnect = async () => {
  headerStore.reconnecting = true;
  try {
    await ControlService.reconnect();
  } catch (e) {
    return;
  }
  headerStore.reconnecting = false;
  headerStore.refresh = true;
};
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.6s ease-in-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-1000px);
}
.server-access-tooltip {
  width: 220%;
  height: 50%;
  background-color: #1e2429;
  border: 1px solid #b4b4b4;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  top: 5%;
  left: 15%;
  border-radius: 10px;
  color: #eee;
  font-size: 65%;
  font-weight: 600;
  text-transform: uppercase;
}
.securBtn-parent {
  cursor: pointer;
}
.securBtn-box {
  width: 100%;
  z-index: 51;
}
.securBtn-box img {
  width: 100%;
  z-index: 51;
}
.securBtn-box img:active {
  transform: scale(0.98);
}
</style>
