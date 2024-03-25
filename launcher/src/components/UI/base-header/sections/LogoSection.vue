<template>
  <div class="col-start-1 col-end-3 flex justify-center items-center">
    <div
      class="absolute left-0 top-0 w-[74px] rounded-tl-lg z-50 p-1 bg-[#537263] rounded-tr-[40px] rounded-br-[40px] rounded-bl-[37px] shadow-md shadow-[#252525]"
      :class="logoDisabled ? 'pointer-events-none ' : ''"
      @mousedown.prevent.stop
    >
      <LogoButton :server-acc="serverAccMange" @access-handler="btnHandler" @mouse-leave="mouseLeave" />
    </div>
  </div>
</template>

<script setup>
import LogoButton from "../../server-management/components/LogoButton.vue";
import { useFooter } from "@/store/theFooter";
import { ref, computed } from "vue";
import i18n from "@/includes/i18n";
import { useServers } from "@/store/servers";
import { useRouter } from "vue-router";

const t = i18n.global.t;
const serverStore = useServers();
const footerStore = useFooter();
const router = useRouter();
const tooltip = ref(false);
const serverAccMange = t("multiServer.serverAccMang");

const logoDisabled = computed(() => {
  if (
    router.currentRoute.value.fullPath === "/config/play" ||
    router.currentRoute.value.fullPath === "/oneClick/play" ||
    router.currentRoute.value.fullPath === "/custom/play" ||
    router.currentRoute.value.fullPath === "/login"
  ) {
    return true;
  } else {
    return false;
  }
});

const mouseLeave = () => {
  tooltip.value = false;
  footerStore.cursorLocation = "";
};

const serverAccessHandler = () => {
  serverStore.isServerAccessManagementActive = !serverStore.isServerAccessManagementActive;
};

const btnHandler = () => {
  if (footerStore.stereumStatus) {
    serverAccessHandler();
  } else {
    return;
  }
};
</script>
