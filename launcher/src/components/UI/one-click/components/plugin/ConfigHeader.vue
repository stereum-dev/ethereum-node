<template>
  <div
    class="col-start-1 col-span-full row-start-1 row-span-1 p-1 flex justify-center items-center relative bg-[#264744] rounded-t-md"
  >
    <div class="flex justify-center items-center">
      <img class="w-10 mr-2" :src="selectedPreset.icon" alt="Preset Icon" />
      <div class="h-10 flex flex-col justify-center items-start">
        <span class="w-fit h-fit text-[18px] font-bold text-gray-200 uppercase tracking-wider">
          {{ selectedPreset.name }}</span
        >
        <span class="w-fit h-fit text-sm font-bold text-gray-900 uppercase tracking-wider">{{
          currentNetwork.name
        }}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useClickInstall } from "@/store/clickInstallation";
import { computed } from "vue";
import { useNodeManage } from "@/store/nodeManage";

const installStore = useClickInstall();
const manageStore = useNodeManage();

const selectedPreset = computed(() => {
  return installStore.selectedPreset;
});

const currentNetwork = computed(() => {
  return manageStore.currentNetwork;
});
</script>
