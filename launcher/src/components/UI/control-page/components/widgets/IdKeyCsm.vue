<template>
  <div class="pair-state-parent w-full h-full flex flex-col justify-center items-center relative">
    <div class="icon-box w-full h-1/2 flex justify-center items-center">
      <img class="w-1/4" :src="setupStore?.selectedLCOMService?.icon" :alt="setupStore?.selectedLCOMService?.name" />
    </div>
    <div class="item-row w-full h-1/4 flex justify-between items-center uppercase text-gray-200 text-2xs pl-1 pr-1">
      operator id
      <span class="text-2xs pl-1 pr-1 text-green-500">{{ setupStore?.selectedLCOMService?.id }}</span>
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
import { useSetups } from "@/store/setups";
import { useStakingStore } from "@/store/theStaking";
import { computed } from "vue";

const stakingStore = useStakingStore();
const setupStore = useSetups();

const dvtWithRelatedValidatorCount = computed(() => {
  if (!stakingStore?.keys || !setupStore?.allSetups || !setupStore?.selectedLCOMService) {
    return 0;
  }

  return stakingStore?.keys.filter((key) => {
    if (key?.dvt !== true || !key?.validatorID) {
      return false;
    }

    const relatedValidator = setupStore?.allSetups.some((setup) => {
      return (
        setup?.setupId === setupStore?.selectedLCOMService.setupId &&
        setup?.services.some((service) => service?.category === "validator" && service?.validatorID === key?.validatorID)
      );
    });

    return relatedValidator;
  }).length;
});
</script>
