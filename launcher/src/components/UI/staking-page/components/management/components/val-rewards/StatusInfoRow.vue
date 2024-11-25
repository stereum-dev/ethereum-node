import { useStakingStore } from '@/store/theStaking';
<template>
  <div
    class="max-h-9 col-start-1 col-span-full row-span-1 border border-gray-500 rounded-md grid grid-cols-12 justify-center items-center bg-[#363934] gap-x-1"
  >
    <span
      v-if="stakingStore.selectedServiceToFilter?.service === 'CharonService'"
      class="col-start-1 col-end-4 text-[8px] text-gray-200 font-normal font-sans text-left pl-2"
      >PRN</span
    >
    <span
      v-if="stakingStore.selectedServiceToFilter?.service === 'SSVNetworkService'"
      class="col-start-1 col-span-2 text-[10px] text-amber-300 font-normal font-sans text-left pl-2"
      >ID:</span
    >
    <span
      class="text-[10px] text-amber-300 font-normal font-sans text-left"
      :class="
        stakingStore.selectedServiceToFilter?.service === 'SSVNetworkService'
          ? 'col-start-3 col-span-2'
          : 'col-start-4 col-span-full'
      "
    >
      {{
        stakingStore.selectedServiceToFilter?.service === "SSVNetworkService"
          ? getSSVId
          : getObolPeerName
      }}
    </span>
  </div>
</template>

<script setup>
import { useStakingStore } from "@/store/theStaking";
import { computed } from "vue";
const stakingStore = useStakingStore();

const getSSVId = computed(() => {
  return "125#";
});

const getObolPeerName = computed(() => {
  return "fbwdefbwerbwrtebwrtb";
});
</script>
