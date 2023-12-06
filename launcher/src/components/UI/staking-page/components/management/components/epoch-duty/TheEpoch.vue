import { computed } from 'vue';
<template>
  <div class="w-full h-full rounded-md flex justify-evenly items-center p-1">
    <span class="text-xs font-semibold text-center uppercase" :class="getDutyColor">{{
      props.dutiesNumber > 0 ? "Pending Duties" : "No Duties"
    }}</span>
    <span class="text-sm font-semibold text-center text-gray-300">{{ props.dutiesNumber }} </span>
  </div>
</template>
<script setup>
import { computed } from "vue";

const props = defineProps({
  dutiesNumber: {
    type: Number,
    required: true,
  },
});

const getDutyColor = computed(() => {
  return props.dutiesNumber > 0 ? "text-amber-400" : "text-red-500";
});
</script>
