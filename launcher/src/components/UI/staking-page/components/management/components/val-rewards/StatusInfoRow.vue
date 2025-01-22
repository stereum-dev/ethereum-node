import { useStakingStore } from '@/store/theStaking';
<template>
  <div class="h-full max-h-5 col-start-1 col-span-full row-span-1 grid grid-cols-12 justify-center items-center gap-x-1">
    <span
      v-if="stakingStore.selectedServiceToFilter?.service === 'CharonService'"
      class="col-start-1 col-end-5 text-[8px] text-gray-200 font-normal font-sans text-left pl-2"
      >Peer-Name</span
    >
    <span
      v-if="stakingStore.selectedServiceToFilter?.service === 'SSVNetworkService'"
      class="col-start-1 col-span-2 text-[8px] text-amber-300 font-normal font-sans text-left pl-2"
      >ID:</span
    >
    <span
      class="text-[8px] h-full max-h-4 text-amber-300 font-normal font-sans text-center bg-black rounded-full"
      :class="
        stakingStore.selectedServiceToFilter?.service === 'SSVNetworkService'
          ? 'col-start-5 col-span-full pt-[2px]'
          : 'col-start-5 col-span-full'
      "
    >
      {{ stakingStore.selectedServiceToFilter?.service === "SSVNetworkService" ? getSSVId : getObolPeerName }}
    </span>
  </div>
</template>

<script setup>
import { useStakingStore } from "@/store/theStaking";
import { computed } from "vue";
const stakingStore = useStakingStore();

const getSSVId = computed(() => {
  return stakingStore.ssvStats?.operator ? stakingStore.ssvStats?.operator : "N/A";
});

const getObolPeerName = computed(() => {
  return stakingStore.obolStats?.peerName ? stakingStore.obolStats?.peerName : "N/A";
});
</script>
