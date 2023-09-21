import { computed, ref } from 'vue';
<template>
  <div
    class="grid-col-1 col-span-1 relative w-full h-full flex justify-center items-center box-border"
    :class="{ 'opacity-25': client.displayPluginMenu }"
    @pointerdown.prevent.stop
    @mousedown.prevent.stop
  >
    <div class="flex flex-col justify-center items-center gap-2">
      <span class="text-xs text-gray-200 font-semibold">{{ client.name }}</span>
      <img class="w-10" :src="client.sIcon" alt="icon" />
      <p class="text-[10px] text-gray-400">
        ID:<span class="text-[10px] text-gray-200 ml-1">{{ serviceId }}</span>
      </p>
    </div>

    <div
      v-if="getConnectedMevboost === client.config.serviceID"
      class="h-1/3 flex justify-evenly items-center absolute -start-2 -top-4"
    >
      <img class="w-5" src="/img/icon/plugin-icons/Other/mev-sIcon.png" alt="icon" />
    </div>
    <div v-if="client.serviceIsConnected" class="flex justify-evenly items-center absolute end-1 top-0">
      <img class="w-3" src="/img/icon/manage-node-icons/connected.png" alt="icon" />
    </div>
    <div v-else-if="!client.serviceIsConnected" class="flex justify-evenly items-center absolute end-1 top-0">
      <img class="w-3" src="/img/icon/manage-node-icons/not-connected.png" alt="icon" />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useServices } from "@/store/services";
const { client } = defineProps({
  client: {
    type: Object,
    required: true,
  },
});
const serviceStore = useServices();

const serviceId = computed(() => formattedServiceID(client?.config.serviceID));

const getConnectedMevboost = computed(() => {
  let connectedMevboost;
  connectedMevboost = serviceStore.installedServices
    .filter((e) => e?.category === "consensus")
    .find((e) => e?.config.dependencies.mevboost[0]);
  return connectedMevboost?.config.serviceID;
});

// Methods
const formattedServiceID = (item) => {
  return item.slice(0, 6) + "..." + item.slice(-6);
};
</script>
