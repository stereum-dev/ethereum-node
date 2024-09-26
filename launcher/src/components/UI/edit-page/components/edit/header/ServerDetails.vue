<template>
  <div
    class="col-start-1 col-span-3 h-[55px] flex flex-col justify-between items-center border border-gray-600 rounded-md bg-[#151618]"
    style="cursor: default"
  >
    <div
      class="w-full px-2 h-[25px] grid grid-cols-24 items-center"
      @mouseenter="footerStore.cursorLocation = `${machineName}`"
      @mouseleave="footerStore.cursorLocation = ''"
    >
      <span class="col-start-2 col-end-8 text-xs text-left text-gray-100 overflow-hidden whitespace-pre ml-[5px]">Mach</span>
      <span class="col-start-8 col-span-full text-md text-yellow-500 overflow-hidden whitespace-pre">{{ controlStore.ServerName }}</span>
    </div>
    <div
      v-if="controlStore.ipAddress"
      class="w-full px-2 h-[25px] grid grid-cols-24 items-center"
      @mouseenter="footerStore.cursorLocation = `${machineIp}`"
      @mouseleave="footerStore.cursorLocation = ''"
    >
      <span class="col-start-2 col-end-7 text-xs text-left text-gray-100 overflow-hidden whitespace-pre ml-[5px]">IP </span>
      <span class="col-start-8 col-end-22 text-sm text-yellow-500 overflow-hidden whitespace-pre">{{ controlStore.ipAddress }}</span>

      <img
        class="w-7 col-start-23 col-span-full cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200 ease-in-out"
        src="/img/icon/service-modals-icons/copy.png"
        alt="icon"
        @click="copyServerIp"
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

const machineName = t("serverDetails.machineName");
const machineIp = t("serverDetails.machineIp");

const controlStore = useControlStore();
const footerStore = useFooter();

onMounted(() => {
  updateConnectionStats();
});

const copyServerIp = () => {
  let ipToCopy = controlStore.ipAddress;
  navigator.clipboard
    .writeText(ipToCopy)
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
