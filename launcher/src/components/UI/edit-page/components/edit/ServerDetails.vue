<template>
  <div
    class="col-start-1 col-span-3 h-[55px] flex flex-col justify-between items-center border border-gray-600 rounded-md bg-[#151618]"
    style="cursor: default"
  >
    <div
      class="w-full flex justify-center items-center px-2 h-[25px]"
      @mouseenter="footerStore.cursorLocation = `server name`"
      @mouseleave="footerStore.cursorLocation = ''"
    >
      <span class="text-md font-semibold ml-1 text-yellow-500 overflow-hidden whitespace-pre text-center">{{
        controlStore.ServerName
      }}</span>
    </div>
    <div
      v-if="controlStore.ipAddress"
      class="w-full flex justify-center items-center px-2 h-[25px]"
      @mouseenter="footerStore.cursorLocation = `server ip`"
      @mouseleave="footerStore.cursorLocation = ''"
    >
      <span class="text-xs text-left text-gray-100 overflow-hidden whitespace-pre ml-[5px]">IP :</span>
      <span class="text-sm pl-2 text-yellow-500 overflow-hidden whitespace-pre">{{ controlStore.ipAddress }}</span>
    </div>
  </div>
</template>
<script setup>
import { useControlStore } from "@/store/theControl";
import { onMounted } from "vue";
import ControlService from "@/store/ControlService";
import { useFooter } from "@/store/theFooter";

const controlStore = useControlStore();
const footerStore = useFooter();

onMounted(() => {
  updateConnectionStats();
});

const updateConnectionStats = async () => {
  const stats = await ControlService.getConnectionStats();
  controlStore.ServerName = stats.ServerName;
  controlStore.ipAddress = stats.ipAddress;
};
</script>
