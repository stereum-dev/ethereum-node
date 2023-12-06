<template>
  <div
    class="max-h-[29px] col-start-1 col-span-full row-start-1 row-span-1 border border-gray-500 rounded-md grid grid-cols-7 items-center bg-[#334B3F] overflow-hidden"
  >
    <div class="col-start-1 col-end-4 flex justify-between items-center px-1 space-x-1">
      <span class="w-1/2 flex justify-center items-center text-[10px] text-amber-300 font-semibold"> Epoch </span>

      <span class="w-1/2 text-[10px] text-amber-300 font-semibold text-center">{{ formattedEpoch }}</span>
    </div>
    <div
      class="w-full h-full col-start-4 col-span-full bg-[#151618] rounded-md overflow-hidden grid grid-cols-3 divide-x divide-gray-600"
    >
      <span
        class="col-start-1 col-span-1 text-[8px] text-amber-300 font-semibold self-center text-center overflow-hidden"
        >{{ formattedSlotEpochRatio }}</span
      >

      <div class="col-start-2 col-span-full self-center text-center overflow-hidden flex justify-evenly items-center">
        <span class="text-[10px] text-amber-300 font-semibold">Slot</span>
        <span class="text-[10px] text-amber-300 font-semibold">{{ formattedCurrentSlot }}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from "vue";
import { useStakingStore } from "@/store/theStaking";

const stakingStore = useStakingStore();

const formattedCurrentSlot = computed(() => {
  if (!isNaN(stakingStore.currentSlot) && stakingStore.currentSlot !== undefined) {
    return stakingStore.currentSlot;
  }
  return "";
});

const formattedEpoch = computed(() => {
  if (!isNaN(stakingStore.currentEpoch) && stakingStore.currentEpoch !== undefined) {
    return stakingStore.currentEpoch;
  }
  return "";
});

const formattedSlotEpochRatio = computed(() => {
  const currentSlot = stakingStore.currentSlot;
  const slotsPerEpoch = stakingStore.slotsPerEpoch;

  if (
    !isNaN(currentSlot) &&
    !isNaN(slotsPerEpoch) &&
    currentSlot !== null &&
    currentSlot !== undefined &&
    slotsPerEpoch !== null &&
    slotsPerEpoch !== undefined
  ) {
    return `${currentSlot % slotsPerEpoch} / ${slotsPerEpoch}#`;
  }

  return "";
});
</script>
