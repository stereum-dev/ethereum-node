<template>
  <div
    class="control-header col-start-1 col-end-25 row-start-1 row-span-1 grid h-full p-[.10rem] gap-1 mx-h-[145px] shadow-xl shadow-grey-800 rounded-lg mt-2 mr-1 ml-1"
    style="grid-template-columns: repeat(22, 1fr)"
  >
    <ThinCard class="server-name col-start-1 col-span-6"><ServerName /></ThinCard>
    <ThinCard class="network-status col-start-7 col-end-13"><NetworkStatus /></ThinCard>

    <SetupDetails
      class="SetupDetails col-start-13 col-span-4"
      :border="false"
      :list="setupsList"
      @select-setup="selectSetup"
      @server-view="serverView"
    />
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
// import MachineName from "../components/widgets/MachineName.vue";
import NetworkStatus from "../../../layers/NetworkStatus.vue";
import SetupDetails from "../../edit-page/components/edit/header/SetupDetails.vue";
import SetupServices from "../../control-page/components/widgets/SetupServices.vue";
import ServerName from "../../control-page/components/widgets/ServerName.vue";

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
