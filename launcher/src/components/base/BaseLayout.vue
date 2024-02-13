<template>
  <div
    class="flex flex-col justify-between box-border items-center w-screen h-screen border-2 border-slate-500 rounded-lg z-30 select-none relative"
  >
    <HeaderScreen />

    <div class="flex justify-center items-center w-full h-full max-h-[503px] bg-[#33393E] relative">
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
  </div>
</template>
<script setup>
import TaskManager from "../UI/task-manager/TaskManager.vue";
import TheFooter from "../layers/TheFooter.vue";
import MultiServerScreen from "../UI/server-management/MultiServerScreen.vue";
import HeaderScreen from "../UI/base-header/HeaderScreen.vue";
import GrafanaModal from "../UI/services-modal/GrafanaModal.vue";
import SsvModal from "../UI/services-modal/SsvModal.vue";
import PrometheusModal from "../UI/services-modal/PrometheusModal.vue";
import MevboostModal from "../UI/services-modal/MevboostModal.vue";
import ObolModal from "../UI/services-modal/ObolModal.vue";
import { useNodeHeader } from "@/store/nodeHeader";
import { useRouter } from "vue-router";
import { useServers } from "@/store/servers";

const router = useRouter();
const serverStore = useServers();
const headerStore = useNodeHeader();

const closeServiceBrowser = () => {
  headerStore.setServiceModal(null);
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
