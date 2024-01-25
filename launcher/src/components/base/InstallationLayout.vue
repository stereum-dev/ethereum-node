<template>
  <div
    class="w-screen h-screen border-2 box-border border-slate-500 rounded-lg bg-[#336666] flex flex-col justify-evenly items-center"
  >
    <div
      class="w-full h-full bg-no-repeat bg-center bg-contain bg-fixed grid grid-cols-24 grid-rows-12"
      style="background-image: url('/img/icon/stereum-logo/stereum-logo-2.png')"
    >
      <div
        id="logo"
        class="absolute left-0 top-0 w-[74px] rounded-tl-lg z-50 p-1 bg-[#537263] rounded-tr-[40px] rounded-br-[40px] rounded-bl-[37px] shadow-md shadow-[#252525]"
        @pointerdown.prevent.stop
        @mousedown.prevent.stop
      >
        <LogoButton :server-acc="serverAccMange" @access-handler="serverAccessHandler" @mouse-leave="mouseLeave" />
      </div>

      <slot></slot>
    </div>
    <TaskManager
      v-if="router.currentRoute.value.fullPath !== '/login' && router.currentRoute.value.fullPath !== '/welcome'"
    />
    <Transition name="slide-fade">
      <ServerScreen v-if="serverStore.isServerAccessManagementActive && router.currentRoute.value.path !== '/login'" />
    </Transition>
  </div>
</template>
<script setup>
import LogoButton from "../UI/multi-server/components/LogoButton.vue";
import TaskManager from "../UI/task-manager/TaskManager.vue";
import ServerScreen from "../UI/multi-server/ServerScreen.vue";
import { useServers } from "@/store/servers";
import { useFooter } from "@/store/theFooter";
import { useRouter } from "vue-router";
import { ref, watchEffect, computed } from "vue";
import i18n from "../../../../launcher/src/includes/i18n";

const t = i18n.global.t;

const footerStore = useFooter();
const serverStore = useServers();

const router = useRouter();

const serverAccessManagement = ref(false);
const tooltip = ref(false);

const serverAccMange = computed(() => {
  return t("serverManagement.serverAccMange");
});

//Computed

watchEffect(() => {
  serverAccessManagement.value = serverStore.serverAccessManagement;
});

// Methods

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
#logo {
  animation: logoAnimation 1s ease-in-out forwards;
}

@keyframes logoAnimation {
  0% {
    opacity: 0;
    transform: scale(0) translate(-300px, -300px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translate(0, 0);
  }
}
</style>
