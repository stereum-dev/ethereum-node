import { computed, ref } from 'vue';
<template>
  <div
    class="grid-col-1 col-span-1 relative w-full h-full flex justify-center items-center box-border"
    :class="{ 'opacity-25': client.displayPluginMenu }"
    @pointerdown.prevent.stop
    @mousedown.prevent.stop
    @mouseenter="footerStore.cursorLocation = `${clkEdit}`"
    @mouseleave="footerStore.cursorLocation = ''"
  >
    <div class="flex flex-col justify-center items-center gap-2">
      <span class="text-xs text-gray-200 font-semibold">{{ client.name }}</span>
      <img class="w-10" :src="client.sIcon" alt="icon" />
      <p class="text-[10px] text-gray-400">
        ID:<span class="text-[10px] text-gray-200 ml-1">{{ serviceId }}</span>
      </p>
    </div>

    <div
      v-if="client.category === 'consensus' && getConnectedMevboost?.config.serviceID === client?.config.serviceID"
      class="flex justify-evenly items-center absolute -right-2 -bottom-3"
    >
      <img class="w-5" src="/img/icon/service-icons/Other/mev-sIcon.png" alt="icon" />
    </div>
    <div
      v-if="checkClientConnection && props.client.category !== 'execution' && props.client.service !== 'ExternalConsensusService'"
      class="flex justify-evenly items-center absolute end-1 top-0"
    >
      <img class="w-3" src="/img/icon/edit-node-icons/service-connected.png" alt="icon" />
    </div>
    <div
      v-else-if="!checkClientConnection && props.client.category !== 'execution' && props.client.service !== 'ExternalConsensusService'"
      class="flex justify-evenly items-center absolute end-1 top-0"
    >
      <img class="w-3" src="/img/icon/edit-node-icons/not-service-connected.png" alt="icon" />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useFooter } from "@/store/theFooter";

import i18n from "@/includes/i18n";

const t = i18n.global.t;

const clkEdit = t("editClientLay.clkEdit");

const footerStore = useFooter();

// Props
const props = defineProps({
  client: {
    type: Object,
    required: true,
  },
});

const serviceId = computed(() => formattedServiceID(props.client.config ? props.client.config?.serviceID : props.client.id));

const getConnectedMevboost = computed(() => {
  let connectedMevboost;

  if (props.client.config && props.client.config?.dependencies?.mevboost[0]) {
    connectedMevboost = props.client;
  } else {
    connectedMevboost = null;
  }

  return connectedMevboost;
});

const checkClientConnection = computed(() => {
  let allDependencies = [props.client.config.dependencies?.consensusClients, props.client.config.dependencies?.executionClients].flat();
  if (allDependencies.length > 0) return true;
  return false;
});

// Methods
const formattedServiceID = (item) => {
  return item.slice(0, 6) + "..." + item.slice(-6);
};
</script>
