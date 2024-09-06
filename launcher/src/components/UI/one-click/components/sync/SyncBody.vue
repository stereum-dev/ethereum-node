import { ref, computed } from 'vue';
<template>
  <div class="w-full h-full col-start-1 col-span-full row-start-3 row-end-11 grid grid-cols-12 grid-rows-7 p-2 mx-auto">
    <div class="w-full h-full col-start-3 col-end-11 row-start-1 row-span-full bg-[#1E2429] rounded-md grid grid-cols-12 grid-rows-7 p-2">
      <div class="col-start-1 col-span-full row-start-1 row-span-1 flex justify-center items-center">
        <span class="text-gray-300 text-sm">{{ $t("oneClick.setNodeClient") }}</span>
      </div>

      <div class="col-start-1 col-span-full row-start-2 row-end-5 grid grid-cols-12 grid-rows-2 gap-2">
        <div
          v-if="executionClient"
          class="h-14 col-start-1 col-span-full row-start-1 row-span-1 w-full flex justify-between items-center space-x-2"
        >
          <ExecutionSync :client="executionClient" />
        </div>
        <div
          v-if="consensusClient && !isPresetArchive"
          class="col-start-1 col-span-full row-start-2 row-span-1 w-full h-14 flex justify-between items-center relative space-x-2"
        >
          <ConsensusSync :client="consensusClient" />
        </div>
        <div
          v-if="consensusClient && isPresetArchive"
          class="col-start-1 col-span-full row-start-2 row-span-1 w-full h-14 flex justify-between items-center relative space-x-2"
        >
          <ExecutionSync :client="consensusClient" />
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
import ExecutionSync from "./components/ExecutionSync.vue";
import ConsensusSync from "./components/ConsensusSync.vue";
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
