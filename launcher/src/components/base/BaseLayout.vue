<template>
  <div
    class="flex flex-col justify-between box-border items-center w-screen h-screen border-2 border-slate-500 rounded-lg z-30 select-none relative"
  >
    <div
      class="w-full rounded-t-lg h-16 bg-gradient-to-b from-10% from-[#264744] via-[#325d5a] vie-10% to-[#264744] to-95% border-b border-[#1c3634]"
    >
      <div
        class="absolute left-0 top-0 w-[74px] rounded-tl-lg z-50 p-1 bg-[#537263] rounded-tr-[40px] rounded-br-[40px] rounded-bl-[37px] shadow-md shadow-[#252525]"
        @mousedown.prevent.stop
      >
        <LogoButton :server-acc="serverAccMange" @access-handler="serverAccessHandler" @mouse-leave="mouseLeave" />
      </div>

      <MainNavbar />
    </div>
    <div class="flex justify-center items-center w-full h-full max-h-[503px] bg-[#33393E] relative">
      <slot></slot>
      <Transition name="slide-fade">
        <ServerScreen v-if="serverStore.isServerAccessManagementActive" />
      </Transition>
    </div>
    <div class="w-full h-[30px] rounded-b-lg bg-[#33393E]" @pointerdown.prevent.stop @mousedown.prevent.stop>
      <TheFooter />
      <TaskManager />
    </div>
  </div>
</template>
<script setup>
import MainNavbar from "../UI/node-header/MainNavbar.vue";
import TaskManager from "../UI/task-manager/TaskManager.vue";
import TheFooter from "../layers/TheFooter.vue";
import ServerScreen from "../UI/multi-server/ServerScreen.vue";
import LogoButton from "../UI/multi-server/components/LogoButton.vue";
import { useFooter } from "@/store/theFooter";
import { ref } from "vue";
import i18n from "../../../../launcher/src/includes/i18n";
import { useServers } from "@/store/servers";

const t = i18n.global.t;
const serverStore = useServers();
const footerStore = useFooter();
const tooltip = ref(false);
const serverAccMange = t("serverManagement.serverAccMange");

const mouseLeave = () => {
  tooltip.value = false;
  footerStore.cursorLocation = "";
};

const serverAccessHandler = () => {
  serverStore.isServerAccessManagementActive = !serverStore.isServerAccessManagementActive;
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
