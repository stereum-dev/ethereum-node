<template>
  <div
    class="col-start-1 col-span-3 h-[55px] flex flex-col justify-between items-center border border-gray-600 rounded-md bg-[#151618]"
    style="cursor: default"
  >
    <div
      class="w-full px-2 h-[25px] grid grid-cols-24 items-center"
      @mouseenter="
        footerStore.cursorLocation = `${t('serverDetail.machine', {
          machineName: controlStore?.ServerName,
        })}`
      "
      @mouseleave="footerStore.cursorLocation = ''"
    >
      <span class="col-start-2 col-end-22 text-md text-yellow-500 overflow-hidden whitespace-pre">{{ controlStore.ServerName }}</span>

      <img
        class="w-5 col-start-23 col-span-full cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200 ease-in-out opacity-50"
        src="/img/icon/service-modals-icons/copy.png"
        alt="icon"
        @click="toClipboard(controlStore.ServerName)"
      />
    </div>
    <div
      v-if="controlStore.ipAddress"
      class="w-full px-2 h-[25px] grid grid-cols-24 items-center"
      @mouseenter="
        footerStore.cursorLocation = `${t('serverDetail.serverIp', {
          serverIp: controlStore?.ipAddress,
        })}`
      "
      @mouseleave="footerStore.cursorLocation = ''"
    >
      <span class="col-start-2 col-end-22 text-md text-yellow-500 overflow-hidden whitespace-pre">{{ controlStore.ipAddress }}</span>

      <img
        class="w-5 col-start-23 col-span-full cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200 ease-in-out opacity-50"
        src="/img/icon/service-modals-icons/copy.png"
        alt="icon"
        @click="toClipboard(controlStore.ipAddress)"
      />
    </div>
  </div>
</template>
<script setup>
import { useControlStore } from "@/store/theControl";
import { onMounted } from "vue";
import ControlService from "@/store/ControlService";
import { useFooter } from "@/store/theFooter";
import i18n from "@/includes/i18n";

const t = i18n.global.t;

const controlStore = useControlStore();
const footerStore = useFooter();

onMounted(() => {
  updateConnectionStats();
});

const toClipboard = (stringToCopy) => {
  navigator.clipboard
    .writeText(stringToCopy.trim())
    .then(() => {
      console.log("copied!");
    })
    .catch(() => {
      console.log(`can't copy`);
    });
};

const updateConnectionStats = async () => {
  const stats = await ControlService.getConnectionStats();
  controlStore.ServerName = stats.ServerName;
  controlStore.ipAddress = stats.ipAddress;
};
</script>
