<template>
  <div class="w-full h-8 bg-gray-700 rounded-full grid grid-cols-12 p-1">
    <div class="col-start-1 col-end-5 self-center overflow-hidden flex justify-start items-center">
      <span class="w-6 h-6 bg-gray-300 rounded-full"></span>
      <span class="text-center text-xs text-gray-300 ml-1">{{ props.item.pubkey }}</span>
    </div>

    <img
      class="w-6 h-6 col-start-5 col-span-1 justify-self-center self-center"
      :src="props.item.service"
      alt="Client Icon"
    />
    <span class="col-start-6 col-end-7 self-center text-center text-xs text-gray-300 overflow-hidden">{{
      props.item.since
    }}</span>
    <span class="col-start-7 col-end-8 self-center text-center text-xs text-gray-300 overflow-hidden">{{
      props.item.state
    }}</span>
    <span class="col-start-8 col-end-10 self-center text-center text-xs text-gray-300 overflow-hidden">{{
      props.item.balance
    }}</span>

    <div class="col-start-10 col-span-full bg-[#151618] rounded-full grid grid-cols-4 items-center">
      <div class="col-start-1 col-span-1 w-4 h-4 bg-teal-800 rounded-md justify-self-center"></div>
      <div class="col-start-2 col-span-1 w-4 h-4 bg-teal-800 rounded-md justify-self-center"></div>
      <div class="col-start-3 col-span-1 w-4 h-4 bg-teal-800 rounded-md justify-self-center"></div>
      <div class="col-start-4 col-span-1 w-4 h-4 bg-teal-800 rounded-md justify-self-center"></div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});
</script>
