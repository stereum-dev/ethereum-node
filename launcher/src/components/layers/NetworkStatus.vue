<template>
  <div
    class="w-full h-full col-start-1 col-span-full row-start-1 row-span-1 bg-[#151618] border border-gray-600 rounded-md px-1 mt-1 grid grid-cols-3 relative"
  >
    <div class="col-start-1 col-span-1 flex justify-center items-center">
      <WiFiSign :status="nodeStore.connectionStatus?.status" />
    </div>
    <div class="col-start-2 col-span-full flex flex-col justify-center items-start ml-1">
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
import { usePingQuality } from "../../composables/pingQuality";
import { computed, onMounted, onUnmounted } from "vue";
import { useNodeStore } from "../../store/theNode";
import WiFiSign from "./WIFISign.vue";

const nodeStore = useNodeStore();
const { checkConnectionQuality, startPolling, stopPolling } = usePingQuality();

const circleClass = computed(() => {
  switch (nodeStore.connectionStatus?.status) {
    case "excellent":
      return "circle-excellent";
    case "good":
      return "circle-good";
    case "fair":
      return "circle-fair";
    case "poor":
      return "circle-poor";
    case "very poor":
      return "circle-very-poor";
    default:
      return "default";
  }
});

const getPingTime = computed(() => {
  return Math.round(nodeStore.connectionStatus?.pingTime || 0);
});

const getConnectionStatus = computed(() => {
  return nodeStore.connectionStatus?.status || "Unknown";
});

onMounted(() => {
  checkConnectionQuality();
  startPolling(); // Start polling for connection quality when the component is mounted
});

onUnmounted(() => {
  stopPolling(); // Stop polling when the component is unmounted
});
</script>

<style scoped>
.circle-excellent {
  color: green;
}

.circle-good {
  color: lightgreen;
}

.circle-fair {
  color: yellow;
}

.circle-poor {
  color: orange;
}

.circle-very-poor {
  color: red;
}

.default {
  color: white;
}
</style>
