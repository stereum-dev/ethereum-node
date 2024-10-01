<template>
  <div class="pair-state-parent w-full h-full flex flex-col justify-center items-center">
    <div class="index-line w-full h-1/2 flex justify-center items-center pl-2">
      <div class="icon-box w-1/4 h-full flex justify-center items-center">
        <img class="w-7 h-7" :src="setupStore.selectedServicePairs?.executionService?.icon" alt="execution" />
      </div>
      <div
        class="status-box w-3/4 h-full flex justify-center items-center uppercase text-xs text-green-500 font-semibold"
        :class="setupStore.selectedServicePairs?.executionService?.state == 'running' ? 'text-green-500' : 'text-red-500'"
      >
        {{ setupStore.selectedServicePairs?.executionService?.state == "running" ? "online" : "offline" }}
      </div>
    </div>
    <div class="index-line w-full h-1/2 flex justify-center items-center pl-2">
      <div class="icon-box w-1/4 h-full flex justify-center items-center">
        <img class="w-7 h-7" :src="setupStore.selectedServicePairs?.consensusService?.icon" alt="execution" />
      </div>
      <div
        class="status-box w-3/4 h-full flex justify-center items-center uppercase text-xs font-semibold"
        :class="setupStore.selectedServicePairs?.consensusService?.state == 'running' ? 'text-green-500' : 'text-red-500'"
      >
        {{ setupStore.selectedServicePairs?.consensusService?.state == "running" ? "online" : "offline" }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSetups } from "@/store/setups";

const setupStore = useSetups();
</script>

<style scoped></style>
