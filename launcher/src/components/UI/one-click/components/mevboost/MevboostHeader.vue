<template>
  <div
    class="col-start-5 col-span-8 row-start-1 row-span-2 grid grid-cols-6 grid-rows-2 p-1 items-end"
  >
    <div
      class="h-14 col-start-1 col-span-full row-start-1 row-span-2 flex justify-center bg-[#1E2429] rounded-md p-1"
    >
      <img
        class="w-[50px] h-[50px] col-start-1 col-span-2 row-start-1 row-span-2 z-10 self-center"
        :src="selectedPreset.icon"
        alt="Preset Icon"
      />
      <div class="w-full h-full flex flex-col justify-evenly items-start ml-2">
        <span
          class="w-full text-[16px] font-semibold text-gray-200 uppercase tracking-wider"
        >
          {{ selectedPreset.name }}</span
        >
        <span
          class="w-full h-fit text-xs font-semibold text-amber-500 uppercase tracking-wider"
          >{{ currentNetwork.name }}</span
        >
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
