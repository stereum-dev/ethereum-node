<template>
  <div class="col-start-1 col-span-full row-start-4 row-span-1 flex justify-center items-center space-x-2">
    <span class="text-[10px] text-amber-400 font-semibold text-center">CLIENT SELECTED:</span>
    <span class="text-[10px] text-gray-300 font-semibold text uppercase">{{ props.client.name }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
  client: {
    type: Object || String,
    required: true,
  },
});
</script>
