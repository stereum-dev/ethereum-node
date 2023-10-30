import { ref, computed } from 'vue';
<template>
  <div class="w-full h-full col-start-1 col-span-full row-start-3 row-end-11 grid grid-cols-12 grid-rows-7 p-2 mx-auto">
    <div
      class="w-full h-full col-start-3 col-end-11 row-start-1 row-span-full bg-[#1E2429] rounded-md grid grid-cols-12 grid-rows-7 p-2"
    >
      <div class="col-start-1 col-span-full row-start-1 row-span-1 flex justify-center items-center">
        <span class="text-gray-300 text-sm">Set how the Node clients where synchronize their blockchain data from</span>
      </div>

      <div class="col-start-1 col-span-full row-start-2 row-end-5 grid grid-cols-12 grid-rows-2 gap-2">
        <div
          v-if="executionClient"
          class="col-start-1 col-span-full row-start-1 row-span-1 w-full h-24 flex justify-between items-center space-x-2"
        >
          <div class="w-1/3 h-14 flex justify-start items-center bg-[#33393e] rounded-md px-2">
            <img class="w-10 mr-1" :src="executionClient.sIcon" alt="Client Icon" />
            <div class="flex flex-col justify-center items-start">
              <span class="text-md text-gray-300 font-semibold text-left">{{ executionClient.name }}</span>
              <span class="text-sm text-teal-600 font-semibold text-left">{{ executionClient.category }}</span>
            </div>
          </div>

          <div class="w-4/6 h-14 flex flex-col justify-center items-start bg-[#33393e] rounded-md py-1 px-4">
            <span class="text-md text-gray-300 font-semibold text-left">GENESIS</span>
            <span class="text-sm text-teal-600 font-semibold text-left">Syncs from genesis</span>
          </div>
        </div>
        <div
          v-if="consensusClient && !isPresetArchive"
          class="col-start-1 col-span-full row-start-2 row-span-1 w-full h-24 flex justify-between items-center relative space-x-2"
        >
          <div class="w-1/3 h-14 flex justify-start items-center bg-[#33393e] rounded-md px-2">
            <img class="w-10 mr-1" :src="consensusClient.sIcon" alt="Client Icon" />
            <div class="flex flex-col justify-center items-start">
              <span class="text-md text-gray-300 font-semibold text-left">{{ consensusClient.name }}</span>
              <span class="text-sm text-teal-600 font-semibold text-left">{{ consensusClient.category }}</span>
            </div>
          </div>
          <div class="w-4/6 h-14 flex justify-center items-center bg-[#33393e] rounded-md">
            <SyncCarousel :client="consensusClient" />
          </div>
        </div>
        <div
          v-if="consensusClient && isPresetArchive"
          class="col-start-1 col-span-full row-start-2 row-span-1 w-full h-24 flex justify-between items-center relative space-x-2"
        >
          <div class="w-1/3 h-14 flex justify-start items-center bg-[#33393e] rounded-md px-2">
            <img class="w-10 mr-1" :src="consensusClient.sIcon" alt="Client Icon" />
            <div class="flex flex-col justify-center items-start">
              <span class="text-md text-gray-300 font-semibold text-left">{{ consensusClient.name }}</span>
              <span class="text-sm text-teal-600 font-semibold text-left">{{ consensusClient.category }}</span>
            </div>
          </div>

          <div class="w-4/6 h-14 flex flex-col justify-center items-start bg-[#33393e] rounded-md py-1 px-4">
            <span class="text-md text-gray-300 font-semibold text-left">GENESIS</span>
            <span class="text-sm text-teal-600 font-semibold text-left">Syncs from genesis</span>
          </div>
        </div>
      </div>

      <div class="col-start-2 col-end-12 row-start-6 row-span-1 flex flex-col justify-center items-center px-2">
        <span class="text-gray-300 text-sm text-left">
          {{ $t("fastSync.message") }}
        </span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useClickInstall } from "@/store/clickInstallation";
import SyncCarousel from "./SyncCarousel.vue";
import { computed } from "vue";

//Store

const clickStore = useClickInstall();

//Refs

//Computed & Watcher
const executionClient = computed(() => {
  return clickStore.selectedPreset.includedPlugins.filter((service) => service.category === "execution")[0];
});

const consensusClient = computed(() => {
  return clickStore.selectedPreset.includedPlugins.filter((service) => service.category === "consensus")[0];
});

const isPresetArchive = computed(() => {
  if (clickStore.selectedPreset.name === "archive") {
    return true;
  } else {
    return false;
  }
});
</script>
<style scoped>
.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
}
</style>
