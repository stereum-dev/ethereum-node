<template>
  <div class="col-start-14 col-end-19 grid grid-cols-12 p-1">
    <ServiceCarousel :slides="slides" />
  </div>
</template>

<script setup>
import { isObolDVTService, OBOL_DVT_SERVICES } from "@/share/ObolDVTServices";
import ServiceCarousel from "./ServiceCarousel.vue";
import { useNodeHeader } from "@/store/nodeHeader";
import { useSetups } from "@/store/setups";
import { computed, onBeforeUnmount, watch } from "vue";
import { useBuilders } from "@/store/builders";
import { BUILDER_CLIENTS } from "@/share/builders";
import { gloasForkTime } from "@/share/gloasFork";

const headerStore = useNodeHeader();
const setupsStore = useSetups();
const buildersStore = useBuilders();

// only inside a setup whose network has Glamsterdam scheduled and that runs a builder-capable validator client
const showBuilders = computed(() => {
  const setup = setupsStore.selectedSetup;
  return !!setup?.setupId && gloasForkTime(setup.network) !== null && (setup.services ?? []).some((s) => BUILDER_CLIENTS[s.service]);
});
let buildersTimer = null;
watch(
  showBuilders,
  (show) => {
    clearInterval(buildersTimer);
    buildersTimer = null;
    if (!show) return;
    buildersStore.load();
    buildersTimer = setInterval(() => buildersStore.load(), 5 * 60 * 1000);
  },
  { immediate: true }
);
onBeforeUnmount(() => clearInterval(buildersTimer));
const buildersSlide = computed(() => ({
  service: "Builders",
  name: "Builders",
  sIcon: "/img/icon/service-icons/Other/Builders-s.png",
  marker: buildersStore.markerOf(setupsStore.selectedSetup?.setupId),
}));

const slides = computed(() => (showBuilders.value ? [buildersSlide.value, ...serviceSlides.value] : serviceSlides.value));

const serviceSlides = computed(() => {
  const services = headerStore.runningServices;
  const selectedSetup = setupsStore.selectedSetup;

  if (!selectedSetup || !Array.isArray(selectedSetup.services)) {
    return services.filter(
      (service) =>
        service.service !== "FlashbotsMevBoostService" && service.service !== "SSVNetworkService" && !isObolDVTService(service.service)
    );
  }

  const mevBoostInSetup = selectedSetup.services.some((service) => service.service === "FlashbotsMevBoostService");

  const ssvInSetup = selectedSetup.services.some((service) => service.service === "SSVNetworkService");

  const obolInSetup = selectedSetup.services.some((service) => isObolDVTService(service.service));

  let filteredServices = services.filter((service) => {
    if (!mevBoostInSetup && service.service === "FlashbotsMevBoostService") return false;
    if (!ssvInSetup && service.service === "SSVNetworkService") return false;
    if (!obolInSetup && isObolDVTService(service.service)) return false;
    return true;
  });

  const uniqueServices = ["FlashbotsMevBoostService", "SSVNetworkService", ...OBOL_DVT_SERVICES];

  uniqueServices.forEach((uniqueService) => {
    const serviceIndex = filteredServices.findIndex((service) => service.service === uniqueService);
    if (serviceIndex !== -1) {
      filteredServices = filteredServices.filter((service, index) => service.service !== uniqueService || index === serviceIndex);
    }
  });

  return filteredServices;
});
</script>
