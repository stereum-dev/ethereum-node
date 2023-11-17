import { computed } from 'vue';
<template>
  <div class="w-full h-8 bg-gray-700 rounded-full grid grid-cols-24 p-1 items-center">
    <div class="col-start-1 col-span-1 self-center overflow-hidden flex justify-start items-center">
      <span class="w-5 h-5 bg-gray-300 rounded-full"></span>
    </div>
    <div class="col-start-2 col-end-9 self-center overflow-hidden flex justify-start items-center">
      <span class="text-center text-sm text-gray-300 ml-1">{{ formattedPubKey }}</span>
    </div>

    <img
      class="w-6 h-6 col-start-9 col-end-11 justify-self-center self-center"
      :src="props.item.service"
      alt="Client Icon"
    />
    <span class="col-start-11 col-end-13 self-center text-center text-xs text-gray-300 overflow-hidden">{{
      props.item.since
    }}</span>
    <span class="col-start-13 col-end-15 self-center text-center text-xs text-gray-300 overflow-hidden">{{
      props.item.state
    }}</span>
    <span class="col-start-15 col-end-18 self-center text-center text-xs text-gray-300 overflow-hidden"
      >32.534432423</span
    >

    <div class="col-start-18 col-span-full bg-[#151618] rounded-full grid grid-cols-4 items-center">
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
    type: Object,
    required: true,
  },
});

const formattedPubKey = computed(() => {
  const pubkey = props.item.pubkey;
  if (pubkey && pubkey.length > 20) {
    return `${pubkey.substring(0, 10)} . . . ${pubkey.substring(pubkey.length - 10)}`;
  }
  return pubkey;
});
</script>
