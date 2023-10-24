<template>
  <div class="box-border w-screen h-screen border-2 border-slate-500 rounded-lg bg-[#336666]">
    <div
      class="w-full h-full bg-no-repeat bg-center bg-contain bg-fixed grid grid-cols-24 grid-rows-12"
      style="background-image: url('/img/icon/stereum-logo/stereum-logo-2.png')"
    >
      <div
        id="logo"
        class="absolute left-1 top-1 w-[74px] rounded-tl-lg z-50 p-1 bg-[#537263] rounded-tr-[37px] rounded-br-[37px] rounded-bl-[37px] shadow-md shadow-[#252525]"
        @pointerdown.prevent.stop
        @mousedown.prevent.stop
      >
        <SecurityButton
          :tooltip="tooltip"
          @mouse-enter="mouseEnter"
          @access-switch="accessSwitch"
          @mouse-leave="mouseLeave"
        />
      </div>

      <slot></slot>
    </div>
    <ServerAccessManagement v-if="serverAccessManagement && !isRouterLogin" />
  </div>
</template>
<script setup>
import SecurityButton from "../UI/node-header/SecurityButton.vue";
import ServerAccessManagement from "../UI/node-header/ServerAccessManagement.vue";
import { useNodeHeader } from "@/store/nodeHeader";
import { useFooter } from "@/store/theFooter";
import { useRouter } from "vue-router";
import { ref, watchEffect, computed } from "vue";
import i18n from "../../../../launcher/src/includes/i18n";

const t = i18n.global.t;

const footerStore = useFooter();
const headerStore = useNodeHeader();

const router = useRouter();
const isRouterLogin = ref(false);
const serverAccessManagement = ref(false);
const tooltip = ref(false);

const serverAccMange = computed(() => {
  return t("serverManagement.serverAccMange");
});

//Computed
watchEffect(() => {
  if (router.currentRoute.value.path === "/login") {
    isRouterLogin.value = true;
  } else {
    isRouterLogin.value = false;
  }
});

watchEffect(() => {
  serverAccessManagement.value = headerStore.serverAccessManagement;
});

// Methods
const mouseEnter = () => {
  tooltip.value = true;
  footerStore.cursorLocation = serverAccMange.value;
};

const mouseLeave = () => {
  tooltip.value = false;
  footerStore.cursorLocation = "";
};

const accessSwitch = () => {
  headerStore.serverAccessManagement = !headerStore.serverAccessManagement;
};
</script>
<style scoped>
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
