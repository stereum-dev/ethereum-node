import { useStakingStore } from '@/store/theStaking';
<template>
  <div class="w-full h-8 bg-[#336666] rounded-full grid grid-cols-12 p-1">
    <div class="col-start-1 col-end-5 self-center overflow-hidden flex justify-start items-center">
      <img class="w-7 h-7" src="/img/icon/the-staking/newfolder-icon.png" alt="Folder Icon" @mousedown.prevent />
      <span class="text-center text-xs text-gray-300 ml-1 overflow-hidden">{{ props.item.name }}</span>
    </div>
    <div
      class="col-start-5 col-end-8 self-center text-center text-xs text-gray-300 overflow-hidden flex justify-center items-center"
    >
      <span class="">{{ `Contains ${getkeyNumbers} key (s)` }}</span>
    </div>

    <div class="col-start-8 col-end-10 self-center overflow-hidden flex justify-start items-center">
      <span class="text-left ml-2 text-xs text-gray-300">{{ getBalanceSum }}</span>
    </div>
    <div class="col-start-10 col-span-full bg-[#151618] rounded-full grid grid-cols-4 items-center">
      <div class="col-start-1 col-span-1 w-4 h-4 bg-teal-800 rounded-md justify-self-center"></div>
      <div class="col-start-2 col-span-1 w-4 h-4 bg-teal-800 rounded-md justify-self-center"></div>
      <div class="col-start-3 col-span-1 w-4 h-4 bg-teal-800 rounded-md justify-self-center"></div>
      <div class="col-start-4 col-span-1 w-4 h-4 bg-teal-800 rounded-md justify-self-center"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  item: {
    type: Object || String,
    required: true,
  },
});

const getBalanceSum = computed(() => {
  return props.item.keys.reduce((acc, key) => {
    if (key.balance === "-") {
      return acc;
    }
    return acc + key.balance;
  }, 0);
});

const getkeyNumbers = computed(() => {
  return props.item.keys.length;
});
</script>
