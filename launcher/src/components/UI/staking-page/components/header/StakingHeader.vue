<template>
  <div
    class="w-full h-full col-start-1 col-span-full row-start-1 row-span-1 grid grid-cols-24 items-center rounded-md bg-[#151618] border border-gray-600 px-[2px] space-x-1"
  >
    <div class="col-start-1 col-end-8 h-8 flex justify-end items-center">
      <TotalBalance />
    </div>
    <div class="col-start-8 col-end-18 h-8 flex justify-center items-center relative">
      <NetworkStatus :copatible-size="getNetworkSize" />
    </div>
    <div class="col-start-18 col-span-full h-8 flex justify-end items-center">
      <SetupDropdown :list="setupList" :new-height="newHeight" @select-setup="selectSetup" @server-view="serverView" />
    </div>
  </div>
</template>
<script setup>
import { useMultiSetups } from "@/composables/multiSetups";
import { computed } from "vue";
import { useSetups } from "../../../../../store/setups";
import NetworkStatus from "../../../../layers/NetworkStatus.vue";
import SetupDropdown from "../../../edit-page/components/edit/setups/SetupDropdown.vue";
import TotalBalance from "../management/components/val-rewards/TotalBalance.vue";

const setupStore = useSetups();
const { getSelectedSetup, getServerView } = useMultiSetups();

const newHeight = "h-8";

const setupList = computed(() => {
  return setupStore.stakingSetups;
});

const getNetworkSize = computed(() => {
  return "w-full h-full flex justify-center items-center";
});

const selectSetup = (setup) => {
  getSelectedSetup(setup);
};

const serverView = () => {
  getServerView();
};
</script>
