<template>
  <base-layout>
    <div
      class="Control-screen w-full h-full grid grid-cols-24 grid-rows-12 items-center bg-[#242529]"
    >
      <ControlHeader />
      <CommonSidebar />
      <AlertSection />
      <StakingSidebar />
    </div>
  </base-layout>
</template>

<script setup>
import ControlHeader from "./sections/ControlHeader.vue";
import CommonSidebar from "./sections/CommonSidebar.vue";
import AlertSection from "./sections/AlertSection.vue";
import StakingSidebar from "./sections/StakingSidebar.vue";
import { watch, computed } from "vue";

import { useSetups } from "@/store/setups";
import { useFooter } from "@/store/theFooter";
import { useServices } from "@/store/services";

const setupStore = useSetups();
const footerStore = useFooter();
const serviceStore = useServices();

const selecteConfigServices = computed(() => {
  let test = [];
  const selectedSetup = setupStore.selectedSetup;
  if (selectedSetup && selectedSetup.services) {
    const selectedServiceIds = selectedSetup.services.map(
      (service) => service.config.serviceID
    );
    serviceStore.installedServices.forEach((service) => {
      if (
        (["execution", "validator", "consensus"].includes(service.category) &&
          selectedServiceIds.includes(service.config.serviceID)) ||
        service.category === "service"
      ) {
        test.push({
          isServicePending: false,
          ...service,
        });
      }
    });
  }
  return test;
});

const missingServices = computed(() => {
  const selectedServices = selecteConfigServices.value;
  const hasValidator = selectedServices.some(
    (service) => service.category === "validator"
  );
  const hasConsensus = selectedServices.some(
    (service) => service.category === "consensus"
  );

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
  const consensusServices = selecteConfigServices.value.filter(
    (service) => service.category === "consensus"
  );
  return (
    consensusServices.length > 0 &&
    consensusServices.some((service) => service.state === "running")
  );
});

watch(
  isAnyConsensusRunning,
  (newValue) => {
    footerStore.isConsensusRunning = newValue;
  },
  { immediate: true }
);

const isPrometheusOff = computed(() => {
  const prometheusService = selecteConfigServices.value.find(
    (service) => service.name === "Prometheus"
  );
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
