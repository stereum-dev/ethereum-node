import { computed } from 'vue';
<template>
  <div class="w-full h-8 bg-gray-700 rounded-full grid grid-cols-24 p-1 items-center">
    <div class="w-full h-full col-start-1 col-span-1 self-center overflow-hidden flex justify-start items-center">
      <div class="w-6 h-6 bg-gray-300 rounded-full p-1">
        <img class="w-full" src="/img/icon/the-staking/select-key.png" alt="Key Icon" @mousedown.prevent />
      </div>
    </div>
    <div class="w-full h-full col-start-2 col-end-25 self-center overflow-hidden flex justify-start items-center">
      <span class="text-center text-xs text-gray-300 ml-2">{{ props.item.pubkey }}</span>
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

console.log(props.item.key);
</script>
