<template>
  <div class="control-header col-start-1 col-end-25 row-start-1 row-span-1 grid grid-cols-24 grid-rows-1 h-full p-1 gap-1">
    <ThinCard class="machine-name col-start-3 col-span-5"><MachineName /></ThinCard>
    <NetworkStatus class="network-status col-start-8 col-end-12" />
    <SetupDetails class="SetupDetails col-start-12 col-span-5" :list="setupsList" @select-setup="selectSetup" @server-view="serverView" />
    <ThinCard class="setup-services col-start-17 col-span-6"><SetupServices /></ThinCard>
  </div>
</template>

<script setup>
import { computed, watch } from "vue";

import { useSetups } from "@/store/setups";
import { useServices } from "@/store/services";
import { useControlStore } from "@/store/theControl";

import { useMultiSetups } from "@/composables/multiSetups";

import ThinCard from "../components/cards/ThinCard.vue";
import MachineName from "../components/widgets/MachineName.vue";
import NetworkStatus from "../../../layers/NetworkStatus.vue";
import SetupDetails from "../../edit-page/components/edit/header/SetupDetails.vue";
import SetupServices from "../../control-page/components/widgets/SetupServices.vue";

const { getSelectedSetup, getServerView } = useMultiSetups();

const setupStore = useSetups();
const serviceStore = useServices();
const controlStore = useControlStore();

const setupsList = computed(() => {
  return setupStore.allSetups;
});

const selectSetup = (setup) => {
  getSelectedSetup(setup);
};

const serverView = () => {
  getServerView();
};

const selectedConfigServices = computed(() => {
  let test = [];
  const selectedSetup = setupStore.selectedSetup;

  if (selectedSetup && selectedSetup.services) {
    const selectedServiceIds = selectedSetup.services.map((service) => service.config.serviceID);

    serviceStore.installedServices.forEach((service) => {
      if (
        (["execution", "validator", "consensus"].includes(service.category) && selectedServiceIds.includes(service.config.serviceID)) ||
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

watch(
  () => setupStore.selectedSetup,
  () => {
    if (selectedConfigServices.value && selectedConfigServices.value.length === 0) {
      controlStore.setupServices = 0;
    } else {
      controlStore.setupServices = selectedConfigServices.value.length;
    }
  },
  { immediate: true }
);
</script>
