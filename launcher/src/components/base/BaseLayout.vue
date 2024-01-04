<template>
  <div
    class="flex flex-col justify-between box-border items-center w-screen h-screen border-2 border-slate-500 rounded-lg z-30 select-none relative"
  >
    <div
      class="w-full rounded-t-lg h-16 bg-gradient-to-b from-10% from-[#264744] via-[#325d5a] vie-10% to-[#264744] to-95% border-b border-[#1c3634]"
    >
      <div
        class="absolute left-1 top-1 w-[74px] rounded-tl-lg z-50 p-1 bg-[#537263] rounded-tr-[37px] rounded-br-[37px] rounded-bl-[37px] shadow-md shadow-[#252525]"
        @mousedown.prevent.stop
      >
        <LogoButton :server-acc="serverAccMange" @access-switch="accessSwitch" @mouse-leave="mouseLeave" />
      </div>

      <MainNavbar />
    </div>
    <div class="flex justify-center items-center w-full h-full max-h-[503px] bg-[#33393E]">
      <slot></slot>
    </div>
    <div class="w-full h-[30px] rounded-b-lg bg-[#33393E]" @pointerdown.prevent.stop @mousedown.prevent.stop>
      <TheFooter />
      <TaskManager />
    </div>
    <!-- <serverAccessManagement v-if="headerStore.serverAccessManagement" /> -->
    <ServerScreen v-if="headerStore.isServerAccessManagementActive" />
  </div>
</template>
<script setup>
import MainNavbar from "../UI/node-header/MainNavbar.vue";
import TaskManager from "../UI/task-manager/TaskManager.vue";
import TheFooter from "../layers/TheFooter.vue";
import ServerScreen from "../UI/multi-server/ServerScreen.vue";
import LogoButton from "../UI/multi-server/components/LogoButton.vue";
// import SecurityButton from "../UI/node-header/SecurityButton.vue";
// import serverAccessManagement from "../UI/node-header/ServerAccessManagement.vue";
import { useNodeHeader } from "@/store/nodeHeader";
import { useFooter } from "@/store/theFooter";
import { useI18n } from "vue-i18n";
import { ref } from "vue";

const headerStore = useNodeHeader();
const footerStore = useFooter();
const { t } = useI18n();
const tooltip = ref(false);
const serverAccMange = t("serverManagement.serverAccMange");

const mouseLeave = () => {
  tooltip.value = false;
  footerStore.cursorLocation = "";
};

const accessSwitch = () => {
  console.log("Multi-Server Page");
  headerStore.isServerAccessManagementActive = !headerStore.isServerAccessManagementActive;
};
</script>

<style scoped>
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
