<template>
  <div class="pair-state-parent w-full h-full flex flex-col justify-center items-center relative">
    <NoData v-if="!setupStore?.selectedSetup" />
    <template v-else>
      <ServiceState
        v-for="(service, type) in reactiveServiceStates"
        :key="type"
        :icon="service.icon"
        :name="service.name"
        :state="service.state"
        @mouseenter="setCursor(service.name)"
        @mouseleave="clearCursor"
      />
    </template>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useSetups } from "@/store/setups";
import { useFooter } from "@/store/theFooter";
import ServiceState from "../fragments/ServiceState.vue";
import NoData from "./NoData.vue";

const setupStore = useSetups();
const footerStore = useFooter();

const reactiveServiceStates = computed(() => ({
  execution: {
    name: setupStore.selectedServicePairs?.executionService?.name || "",
    icon: setupStore.selectedServicePairs?.executionService?.icon || "",
    state: setupStore.selectedServicePairs?.executionService?.state || "",
  },
  consensus: {
    name: setupStore.selectedServicePairs?.consensusService?.name || "",
    icon: setupStore.selectedServicePairs?.consensusService?.icon || "",
    state: setupStore.selectedServicePairs?.consensusService?.state || "",
  },
}));

const setCursor = (name) => {
  footerStore.cursorLocation = name;
};

const clearCursor = () => {
  footerStore.cursorLocation = "";
};
</script>
