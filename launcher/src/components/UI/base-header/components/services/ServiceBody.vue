<template>
  <div class="col-start-14 col-end-19 grid grid-cols-12 p-1">
    <ServiceCarousel :slides="slides" />
  </div>
</template>

<script setup>
import ServiceCarousel from "./ServiceCarousel.vue";
import { useNodeHeader } from "@/store/nodeHeader";
import { useSetups } from "@/store/setups";
import { computed } from "vue";

const headerStore = useNodeHeader();
const setupsStore = useSetups();

const slides = computed(() => {
  const services = headerStore.runningServices;
  const selectedSetup = setupsStore.selectedSetup;

  if (!selectedSetup || !Array.isArray(selectedSetup.services)) {
    return services.filter(
      (service) =>
        service.service !== "FlashbotsMevBoostService" && service.service !== "SSVNetworkService" && service.service !== "CharonService"
    );
  }

  const mevBoostInSetup = selectedSetup.services.some((service) => service.service === "FlashbotsMevBoostService");

  const ssvInSetup = selectedSetup.services.some((service) => service.service === "SSVNetworkService");

  const obolInSetup = selectedSetup.services.some((service) => service.service === "CharonService");

  let filteredServices = services.filter((service) => {
    if (!mevBoostInSetup && service.service === "FlashbotsMevBoostService") return false;
    if (!ssvInSetup && service.service === "SSVNetworkService") return false;
    if (!obolInSetup && service.service === "CharonService") return false;
    return true;
  });

  const uniqueServices = ["FlashbotsMevBoostService", "SSVNetworkService", "CharonService"];

  uniqueServices.forEach((uniqueService) => {
    const serviceIndex = filteredServices.findIndex((service) => service.service === uniqueService);
    if (serviceIndex !== -1) {
      filteredServices = filteredServices.filter((service, index) => service.service !== uniqueService || index === serviceIndex);
    }
  });

  return filteredServices;
});
</script>
