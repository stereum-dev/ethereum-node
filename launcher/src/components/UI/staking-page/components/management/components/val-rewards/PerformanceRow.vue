<template>
  <div
    class="w-full h-full max-h-7 col-start-1 col-span-full row-span-1 border border-gray-600 rounded-full grid grid-cols-6 bg-[#2a2c30] items-center p-[1px]"
  >
    <div
      class="h-full col-start-1 col-end-4 self-center flex justify-start items-center px-2 rounded-l-full"
    >
      <span class="text-[10px] text-amber-300 font-normal font-sans text-left"
        >PERFORMANCE</span
      >
    </div>
    <div
      class="w-full h-full col-start-4 col-span-full rounded-r-full self-center flex justify-center items-center bg-[#151618] px-1"
    >
      <span class="text-2xs text-gray-300 font-semibold">{{ getPerformance }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
const getPerformance = computed(() => {
  return "100%";
});
</script>
