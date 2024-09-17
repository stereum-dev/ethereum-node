<template>
  <div class="control-header col-start-1 col-end-25 bg-red-500 row-start-1 row-span-1 grid grid-cols-24 grid-rows-1 h-full p-1 gap-1">
    <ThinCard class="machine-name col-start-3 col-span-5"><MachineName /></ThinCard>
    <NetworkStatus class="network-status col-start-8 col-end-12" />

    <SetupDetails class="SetupDetails col-start-12 col-span-5" :list="setupsList" @select-setup="selectSetup" @server-view="serverView" />
  </div>
</template>

<script setup>
import ThinCard from "../components/cards/ThinCard.vue";
import MachineName from "../components/widgets/MachineName.vue";
import NetworkStatus from "../../../layers/NetworkStatus.vue";
import SetupDetails from "../../edit-page/components/edit/header/SetupDetails.vue";
import { computed } from "vue";
import { useSetups } from "@/store/setups";
import { useMultiSetups } from "@/composables/multiSetups";

const { getSelectedSetup, getServerView } = useMultiSetups();

const setupStore = useSetups();

const setupsList = computed(() => {
  return setupStore.allSetups;
});

const selectSetup = (setup) => {
  getSelectedSetup(setup);
};

const serverView = () => {
  getServerView();
};

// onUnmounted(() => {
//   getServerView();
// });

// const serverView = () => {
//   getServerView();
// };
</script>
