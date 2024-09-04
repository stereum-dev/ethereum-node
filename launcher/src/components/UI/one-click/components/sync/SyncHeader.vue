<template>
  <div class="col-start-5 col-end-21 row-start-1 row-span-2 grid grid-cols-6 grid-rows-2 p-1 items-end gap-2">
    <div class="h-14 col-start-1 col-end-4 row-start-1 row-span-2 flex justify-center bg-[#1E2429] rounded-md p-1">
      <img
        class="w-[50px] h-[50px] col-start-1 col-span-2 row-start-1 row-span-2 z-10 self-center"
        :src="selectedPreset?.icon"
        alt="Preset Icon"
      />
      <div class="w-full h-full flex justify-center items-center ml-4">
        <span class="w-full text-[24px] font-bold text-gray-400 uppercase tracking-wider"> {{ selectedPreset?.name }}</span>
      </div>
    </div>
    <div v-if="network.name" class="h-14 col-start-4 col-span-full row-start-1 row-span-2 flex justify-end bg-[#1E2429] rounded-md p-1">
      <div class="w-fit h-full flex justify-end items-center mr-2">
        <span class="w-full text-[22px] font-bold text-gray-400 uppercase tracking-wider"> {{ network?.name }}</span>
      </div>
      <img
        class="w-[50px] h-[50px] col-start-1 col-span-2 row-start-1 row-span-2 z-10 self-center"
        :src="network?.icon"
        alt="Preset Icon"
      />
    </div>
  </div>
</template>
<script setup>
import { useClickInstall } from "@/store/clickInstallation";
import { computed } from "vue";
import { useNodeManage } from "@/store/nodeManage";

const installStore = useClickInstall();
const manageStore = useNodeManage();

const network = computed(() => {
  return manageStore.currentNetwork;
});

const selectedPreset = computed(() => {
  return installStore.selectedPreset;
});
</script>
