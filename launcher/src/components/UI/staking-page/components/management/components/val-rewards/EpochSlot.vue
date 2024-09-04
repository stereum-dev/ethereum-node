<template>
  <div
    class="max-h-9 col-start-1 col-span-full row-start-1 row-span-1 border border-gray-500 rounded-md grid grid-cols-7 items-center bg-[#334B3F]"
  >
    <div
      class="col-start-1 col-end-4 flex justify-between items-center px-1 space-x-1"
      @mouseenter="footerStore.cursorLocation = `epoch: ${stakingStore.currentEpoch}`"
      @mouseleave="footerStore.cursorLocation = ''"
    >
      <span class="w-1/2 flex justify-center items-center text-[10px] text-amber-300 font-semibold"> Epoch </span>

      <span class="w-1/2 text-[10px] text-amber-300 font-semibold text-center"> {{ stakingStore.currentEpoch }}</span>
    </div>
    <div
      class="w-full h-full col-start-4 col-span-full bg-[#151618] rounded-r-md overflow-hidden grid grid-cols-3 divide-x divide-gray-600"
    >
      <span
        class="col-start-1 col-span-1 text-[8px] text-amber-300 font-semibold self-center text-center overflow-hidden"
        @mouseenter="footerStore.cursorLocation = `slot index`"
        @mouseleave="footerStore.cursorLocation = ''"
        >{{ (stakingStore.currentSlot % stakingStore.slotsPerEpoch | 0) + 1 + " / " + stakingStore.slotsPerEpoch }} #</span
      >

      <div
        class="col-start-2 col-span-full self-center text-center overflow-hidden flex justify-evenly items-center"
        @mouseenter="footerStore.cursorLocation = `slot: ${stakingStore.currentSlot}`"
        @mouseleave="footerStore.cursorLocation = ''"
      >
        <span class="text-[10px] text-amber-300 font-semibold">Slot</span>
        <span class="text-[10px] text-amber-300 font-semibold">{{ stakingStore.currentSlot }}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useStakingStore } from "@/store/theStaking";
const stakingStore = useStakingStore();
import { useFooter } from "@/store/theFooter";

const footerStore = useFooter();
</script>
