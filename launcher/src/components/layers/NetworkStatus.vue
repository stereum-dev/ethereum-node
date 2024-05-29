<template>
  <div
    class="w-full h-full col-start-1 col-span-full row-start-1 row-span-1 bg-[#151618] border border-gray-600 rounded-md px-1 mt-1 grid grid-cols-3"
  >
    <WiFiSign :status="nodeStore.connectionStatus?.status" />

    <p class="col-start-2 col-span-full self-center ml-2 text-gray-300">
      Network {{ nodeStore.connectionStatus?.status }}
    </p>
    <!-- <p>Description: {{ nodeStore.connectionStatus?.description }}</p>  -->
  </div>
</template>

<script setup>
import { usePingQuality } from "../../composables/pingQuality";
import { onMounted, onUnmounted } from "vue";
import { useNodeStore } from "../../store/theNode";
import WiFiSign from "./WIFISign.vue";

const nodeStore = useNodeStore();
const { checkConnectionQuality, startPolling, stopPolling } = usePingQuality();

onMounted(() => {
  checkConnectionQuality();
  startPolling(); // Start polling for connection quality when the component is mounted
});

onUnmounted(() => {
  stopPolling(); // Stop polling when the component is unmounted
});
</script>
