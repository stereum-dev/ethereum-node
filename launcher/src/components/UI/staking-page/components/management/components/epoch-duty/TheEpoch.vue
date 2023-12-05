import { computed } from 'vue';
<template>
  <div class="w-full h-full rounded-md flex justify-evenly items-center p-1">
    <span class="text-sm text-amber-400 font-semibold text-center uppercase">{{
      props.dutiesNumber > 0 ? "Pending Duties" : "No Duties"
    }}</span>
    <span class="text-sm font-semibold text-center text-gray-300">{{ props.dutiesNumber }} </span>
  </div>
</template>
<script setup>
const props = defineProps({
  dutiesNumber: {
    type: Number,
    required: true,
  },
});
</script>
