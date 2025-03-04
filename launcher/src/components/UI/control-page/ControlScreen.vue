<template>
  <base-layout>
    <div class="Control-screen w-full h-full grid grid-cols-24 grid-rows-12 items-center bg-[#2A2A30]">
      <ControlHeader />
      <CommonSidebar />
      <AlertSection @expert-handler="expertModeHandlerAlert" />
      <StakingSidebar />
      <SidebarRight />
      <ExpertWindow v-if="isExpertWindowOpen" :item="expertModeClient" bg-opacity="opacity-25" @hide-modal="hideExpertMode(item)" />
    </div>
  </base-layout>
</template>

<script setup>
import { useSetups } from "@/store/setups";
import { useFooter } from "@/store/theFooter";
import { useServices } from "@/store/services";

import { watch, computed, ref } from "vue";

import ControlHeader from "./sections/ControlHeader.vue";
import CommonSidebar from "./sections/CommonSidebar.vue";
import AlertSection from "./sections/AlertSection.vue";
import StakingSidebar from "./sections/StakingSidebar.vue";
import SidebarRight from "./sections/SidebarRight.vue";
import ExpertWindow from "../node-page/sections/ExpertWindow.vue";

const setupStore = useSetups();
const footerStore = useFooter();
const serviceStore = useServices();

const isExpertWindowOpen = ref(false);
const expertModeClient = ref(null);

const hideExpertMode = (el) => {
  expertModeClient.value = el;
  isExpertWindowOpen.value = false;
};

const expertModeHandlerAlert = (validator) => {
  expertModeClient.value = validator;
  isExpertWindowOpen.value = true;
};

const selectedConfigServices = computed(() => {
  let services = [];
  const selectedSetup = setupStore.selectedSetup;
  const allSetups = setupStore.allSetups;

  if (selectedSetup && selectedSetup.services) {
    const selectedServiceIds = selectedSetup.services.map((service) => service.config.serviceID);

    serviceStore.installedServices.forEach((service) => {
      if (
        (["execution", "validator", "consensus"].includes(service.category) && selectedServiceIds.includes(service.config.serviceID)) ||
        service.category === "service"
      ) {
        services.push({
          isServicePending: false,
          ...service,
        });
      }
    });
  } else {
    allSetups.forEach((setup) => {
      setup.services.forEach((service) => {
        if (["execution", "validator", "consensus", "service"].includes(service.category)) {
          services.push({
            isServicePending: false,
            ...service,
          });
        }
      });
    });
  }
  return services;
});

const missingServices = computed(() => {
  const selectedServices = selectedConfigServices.value;
  const hasValidator = selectedServices.some((service) => service.category === "validator");
  const hasConsensus = selectedServices.some((service) => service.category === "consensus");

  let missing = [];
  if (!hasValidator) missing.push("validator");
  if (!hasConsensus) missing.push("consensus");

  return missing;
});

watch(
  missingServices,
  (newValue) => {
    footerStore.missingServices = newValue;
  },
  { immediate: true }
);
const isAnyConsensusRunning = computed(() => {
  const consensusServices = selectedConfigServices.value.filter((service) => service.category === "consensus");
  return consensusServices.length > 0 && consensusServices.some((service) => service.state === "running");
});

watch(
  isAnyConsensusRunning,
  (newValue) => {
    footerStore.isConsensusRunning = newValue;
  },
  { immediate: true }
);

const isPrometheusOff = computed(() => {
  const prometheusService = selectedConfigServices.value.find((service) => service.name === "Prometheus");
  return prometheusService?.state === "running" ? false : true;
});

watch(
  isPrometheusOff,
  (newValue) => {
    footerStore.prometheusIsOff = newValue;
  },
  { immediate: true }
);
</script>
<style scoped>
.Control-screen {
  max-height: 488px;
}
</style>
