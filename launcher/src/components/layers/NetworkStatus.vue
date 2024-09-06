<template>
  <div
    class="w-full h-full col-start-1 col-span-full bg-[#151618] border border-gray-600 px-1 grid grid-cols-3"
    :class="route.path === '/staking' ? 'rounded-[4px]' : 'mt-1 rounded-md'"
  >
    <div class="w-[32px] h-[32px] self-center col-start-1 col-span-1 flex justify-center items-center">
      <WiFiSign :status="nodeStore.connectionStatus?.status" />
    </div>
    <div
      class="col-start-2 col-span-full"
      :class="route.path === '/staking' ? 'flex justify-start items-center space-x-4' : 'flex flex-col  justify-center items-start ml-1'"
    >
      <div class="flex justify-start items-center space-x-1">
        <span class="text-xs text-gray-200">status:</span>
        <p class="text-xs capitalize" :class="circleClass">
          {{ getConnectionStatus }}
        </p>
      </div>

      <div class="flex justify-start items-center space-x-1">
        <span class="text-xs text-gray-200">ping:</span>
        <p class="text-xs" :class="circleClass">{{ getPingTime }} ms</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { useNodeStore } from "../../store/theNode";
import WiFiSign from "./WIFISign.vue";

const nodeStore = useNodeStore();
const route = useRoute();

const alertTimeout = ref(null);

const circleClass = computed(() => {
  switch (nodeStore.connectionStatus?.status) {
    case "excellent":
      return "text-green-500";
    case "good":
      return "text-green-500";
    case "fair":
      return "text-yellow-400";
    case "poor":
      return "text-orange-500";
    case "very poor":
      return "text-red-500";
    default:
      return "text-white";
  }
});

const getPingTime = computed(() => {
  return Math.round(nodeStore.connectionStatus?.pingTime || 0);
});

const getConnectionStatus = computed(() => {
  return nodeStore.connectionStatus?.status || "Unknown";
});

watchEffect(() => {
  if (nodeStore.connectionStatus?.status === "very poor" || nodeStore.connectionStatus?.status === "poor") {
    if (!alertTimeout.value) {
      alertTimeout.value = setTimeout(() => {
        if (nodeStore.connectionStatus?.status === "very poor" || nodeStore.connectionStatus?.status === "poor") {
          nodeStore.connectionStatusIsPoor = true;
        }
        alertTimeout.value = null;
      }, 10000); // 10 seconds
    }
  } else {
    if (alertTimeout.value) {
      clearTimeout(alertTimeout.value);
      alertTimeout.value = null;
    }
    nodeStore.connectionStatusIsPoor = false;
  }
});
</script>
