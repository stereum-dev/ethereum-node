import { useStakingStore } from '@/store/theStaking';
<template>
  <div class="w-full h-9 bg-[#336666] rounded-full grid grid-cols-12 p-1">
    <div class="col-start-1 col-end-4 self-center overflow-hidden flex justify-start items-center">
      <img class="w-7 h-7" src="/img/icon/the-staking/newfolder-icon.png" alt="Folder Icon" @mousedown.prevent />
      <span class="text-center text-xs text-gray-300 ml-1 overflow-hidden">{{ props.item.name }}</span>
    </div>
    <div
      class="col-start-4 col-end-7 self-center text-center text-xs text-gray-300 overflow-hidden flex justify-center items-center"
    >
      <span class="">{{ `Contains ${getkeyNumbers} key (s)` }}</span>
    </div>
    <div
      class="col-start-7 col-end-8 self-center text-center text-xs text-gray-300 overflow-hidden flex justify-center items-center"
      @mousedown.prevent
    >
      <img class="w-6 h-6 mx-auto" :src="getGroupStates" alt="Status Icon" />
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
import { useStakingStore } from "@/store/theStaking";
import { useKeyStates } from "../../../../../../composables/keyStates";

const props = defineProps({
  item: {
    type: Object || String,
    required: true,
  },
});

const stakingStore = useStakingStore();
const keyStates = useKeyStates(props.item.keys[0].status);

const getBalanceSum = computed(() => {
  return stakingStore.keys.reduce((acc, key) => {
    if (key.balance === "-") {
      return acc;
    }
    return acc + key.balance;
  }, 0);
});

const getkeyNumbers = computed(() => {
  return stakingStore.keys.length;
});

const getGroupStates = computed(() => {
  return keyStates;
});
</script>
