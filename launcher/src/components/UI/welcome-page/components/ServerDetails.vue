<template>
  <div class="col-start-3 col-end-13 row-start-3 row-span-1 py-1 flex justify-between items-center space-x-2">
    <div class="w-1/2 h-10 p-1 bg-[#1E2429] rounded-md flex justify-center items-center overflow-hidden">
      <span class="text-md text-amber-500">{{ serverName }}</span>
    </div>
    <div class="w-1/2 h-10 p-1 bg-[#1E2429] rounded-md flex justify-center items-center overflow-hidden">
      <span class="text-md text-amber-500">{{ ipAddress }}</span>
    </div>
  </div>
</template>

<script setup>
import { useControlStore } from "@/store/theControl";
import { computed } from "vue";

const controlStore = useControlStore();

const serverName = computed(() => {
  return controlStore.ServerName;
});

const ipAddress = computed(() => {
  return controlStore.ipAddress;
});
</script>
