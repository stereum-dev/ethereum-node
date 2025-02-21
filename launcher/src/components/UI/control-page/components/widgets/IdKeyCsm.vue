<template>
  <div class="pair-state-parent w-full h-full flex flex-col justify-center items-center relative">
    <div class="icon-box w-full h-1/2 flex justify-center items-center">
      <img class="w-1/4" :src="setupStore?.selectedLCOMService?.icon" :alt="setupStore?.selectedLCOMService?.name" />
    </div>
    <div class="item-row w-full h-1/4 flex justify-between items-center uppercase text-gray-200 text-2xs pl-1 pr-1">
      operator id
      <span class="text-2xs pl-1 pr-1 text-green-500">{{
        serviceStore.installedServices.find((service) => service.service === "LCOMService")?.config?.env?.NO_ID || 0
      }}</span>
    </div>
    <div class="item-row w-full h-1/4 flex justify-between items-center uppercase text-gray-200 text-2xs pl-1 pr-1">
      <div class="total-ttl h-full w-1/2 flex justify-start items-center">
        <img class="w-1/4 mr-1" src="/img/icon/control-page-icons/key-eth.svg" alt="key icon" />
        total
      </div>
      <span>{{ dvtWithRelatedValidatorCount }}</span>
    </div>
  </div>
</template>
<script setup>
import { useServices } from "@/store/services.js";
import { useSetups } from "@/store/setups.js";
import { useStakingStore } from "@/store/theStaking.js";
import { computed } from "vue";

const serviceStore = useServices();
const stakingStore = useStakingStore();
const setupStore = useSetups();

const dvtWithRelatedValidatorCount = computed(() => {
  return stakingStore.keys.length;
});
</script>
