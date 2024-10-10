<template>
  <div class="pair-state-parent w-full h-full flex flex-col justify-center items-center">
    <ServiceState
      v-for="(service, type) in reactiveServiceStates"
      :key="type"
      :icon="service.icon"
      :name="service.name"
      :state="service.state"
      @mouseenter="setCursor(service.name)"
      @mouseleave="clearCursor"
    />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useSetups } from "@/store/setups";
import { useFooter } from "@/store/theFooter";
import ServiceState from "../fragments/ServiceState.vue";

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
