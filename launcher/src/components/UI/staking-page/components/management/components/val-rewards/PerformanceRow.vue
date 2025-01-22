<template>
  <div class="w-full h-full max-h-5 col-start-1 col-span-full row-span-1 grid grid-cols-6 items-center px-[1px]">
    <div class="h-full col-start-1 col-end-4 self-center flex justify-start items-center px-2 rounded-l-full">
      <span class="text-[8px] text-amber-300 font-normal font-sans text-left">PERFORMANCE</span>
    </div>
    <div class="w-full col-start-4 col-span-full rounded-full self-center flex justify-center items-center bg-black h-full max-h-4 px-1">
      <span class="text-[8px] text-gray-300 font-normal">{{ getPerformance }}</span>
    </div>
  </div>
</template>

<script setup>
import { useStakingStore } from "@/store/theStaking";
import { computed } from "vue";

const stakingStore = useStakingStore();

const getPerformance = computed(() => {
  if (stakingStore.selectedServiceToFilter?.service === "SSVNetworkService") {
    return stakingStore.ssvStats?.performance ? Math.floor(stakingStore.ssvStats?.performance) + "%" : "N/A";
  } else if (stakingStore.selectedServiceToFilter?.service === "CharonService") {
    return stakingStore.obolStats?.attestationPerformance ? Math.floor(stakingStore.obolStats?.attestationPerformance) + "%" : "N/A";
  }
  return "N/A";
});
</script>
