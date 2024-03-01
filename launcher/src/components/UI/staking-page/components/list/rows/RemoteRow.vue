import { computed, ref } from 'vue';
<template>
  <div
    class="w-full h-8 rounded-full grid grid-cols-24 p-1 items-center animate__animated animate__faster animate__slideInLeft cursor-pointer"
    :class="props.item.selected ? 'bg-blue-500' : 'bg-gray-700'"
  >
    <div class="w-full h-full col-start-1 col-span-1 self-center overflow-hidden flex justify-start items-center">
      <div class="w-6 h-6 bg-gray-300 rounded-full p-1">
        <img class="w-full" src="/img/icon/staking-page-icons/key-icon.png" alt="Key Icon" @mousedown.prevent />
      </div>
    </div>
    <div class="w-full h-full col-start-2 col-end-25 self-center overflow-hidden flex justify-between items-center">
      <span class="text-left text-xs text-gray-300 ml-2">{{ props.item.pubkey }}</span>
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
