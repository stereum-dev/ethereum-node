<template>
  <div class="w-full h-full max-h-5 col-start-1 col-span-full row-span-1 grid grid-cols-6 items-center px-[1px]">
    <div class="h-full col-start-1 col-end-4 self-center flex justify-start items-center px-2 rounded-l-full">
      <span class="text-[8px] text-amber-300 font-normal font-sans text-left">PARTICIPATION</span>
    </div>
    <div class="w-full bg-black h-full max-h-4 col-start-4 col-span-full rounded-r-full self-center flex justify-center items-center px-1">
      <span class="text-[8px] text-gray-300 font-normal">{{ getObolParticipation }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStakingStore } from "@/store/theStaking";

const stakingStore = useStakingStore();

const getObolParticipation = computed(() => {
  if (stakingStore.obolStats?.attestationParticipation && stakingStore.obolStats?.operators) {
    return `${stakingStore.obolStats?.attestationParticipation} / ${stakingStore.obolStats?.operators}`;
  } else {
    return "N/A";
  }
});
</script>
