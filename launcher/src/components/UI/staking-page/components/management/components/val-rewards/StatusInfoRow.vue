import { useStakingStore } from '@/store/theStaking';
<template>
  <div
    class="max-h-9 col-start-1 col-span-full row-span-1 border border-gray-500 rounded-md grid grid-cols-12 justify-center items-center bg-[#464A43]"
  >
    <span
      v-if="stakingStore.selectedServiceToFilter?.service === 'CharonService'"
      class="col-start-1 col-span-2 text-[8px] text-gray-200 font-normal font-sans text-left px-2"
      >CLUSTER</span
    >
    <span
      v-if="
        stakingStore.selectedServiceToFilter?.service === 'SSVNetworkService' ||
        stakingStore.selectedServiceToFilter?.service === 'LCOMService'
      "
      class="col-start-1 col-span-2 text-[10px] text-amber-300 font-normal font-sans text-left"
      >ID:</span
    >
    <span
      class="col-start-3 col-span-2 text-[10px] text-amber-300 font-normal font-sans text-left"
    >
      {{
        stakingStore.selectedServiceToFilter?.service === "SSVNetworkService" ||
        stakingStore.selectedServiceToFilter?.service === "LCOMService"
          ? "125#"
          : stakingStore.selectedServiceToFilter?.cluster
      }}
    </span>
  </div>
</template>

<script setup>
import { useStakingStore } from "@/store/theStaking";
const stakingStore = useStakingStore();
</script>
