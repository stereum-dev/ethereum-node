<template>
  <div
    class="h-full col-start-1 col-span-full row-start-1 row-span-1 bg-black rounded-md grid grid-cols-6 p-[2px] items-center"
  >
    <img
      class="col-start-1 col-span-1 w-3 h-3"
      src="/img/icon/the-staking/predicition-icon.png"
      alt="Prediction Icon"
      @mousedown.prevent
    />
    <span class="col-start-2 col-end-6 text-[10px] text-gray-300 font-semibold text-center"
      >EPOCH {{ stakingStore.currentEpoch }}# DUTY</span
    >
    <div
      class="w-full h-full self-center bg-gray-300 rounded-sm col-start-6 col-span-1 flex justify-center items-center overflow-hidden"
    >
      <span class="text-[10px] text-gray-800 font-semibold">{{
        stakingStore.currentSlot % stakingStore.slotsPerEpoch | 0
      }}</span>
    </div>
  </div>
</template>
<script setup>
import { useStakingStore } from "@/store/theStaking";

const stakingStore = useStakingStore();
</script>
