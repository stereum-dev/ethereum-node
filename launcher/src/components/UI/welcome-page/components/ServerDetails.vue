<template>
  <div class="col-start-3 col-end-13 row-start-3 row-span-1 py-1 flex justify-between items-center space-x-2">
    <div class="w-1/2 h-10 p-1 bg-[#1E2429] rounded-md flex justify-center items-center overflow-hidden">
      <span class="text-md text-amber-500">{{ controlStore.ServerName }}</span>
    </div>
    <div class="w-1/2 h-10 p-1 bg-[#1E2429] rounded-md flex justify-center items-center overflow-hidden">
      <span class="text-md text-amber-500">{{ controlStore.ipAddress }}</span>
    </div>
  </div>
</template>

<script setup>
import { useControlStore } from "@/store/theControl";
import { onMounted } from "vue";
import ControlService from "@/store/ControlService";

const controlStore = useControlStore();

//Hooks

onMounted(() => {
  updateConnectionStats();
});

//Methods
const updateConnectionStats = async () => {
  const stats = await ControlService.getConnectionStats();
  controlStore.ServerName = stats.ServerName;
  controlStore.ipAddress = stats.ipAddress;
};
</script>
