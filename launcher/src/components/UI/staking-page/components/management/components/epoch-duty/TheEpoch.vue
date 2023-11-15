import { computed } from 'vue';
<template>
  <div class="w-full h-full rounded-md flex justify-evenly items-center p-1">
    <span class="text-sm text-amber-400 font-semibold text-center uppercase">{{ props.state }}</span>
    <span class="text-sm font-semibold text-center text-gray-300">{{ props.keyNumber }} </span>
  </div>
</template>
<script setup>
const props = defineProps({
  state: {
    type: String,
    required: true,
  },
  keyNumber: {
    type: Number,
    required: true,
  },
});
</script>
