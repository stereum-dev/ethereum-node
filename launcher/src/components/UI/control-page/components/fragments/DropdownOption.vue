<template>
  <div
    class="p-2 bg-gray-200 capitalize transition-colors duration-300 transform text-gray-600 hover:bg-blue-300 hover:text-gray-700 cursor-pointer text-2xs font-bold"
    @click="$emit('select')"
  >
    <span class="col-start-1 col-span-full self-center text-left text-xs font-semibold overflow-hidden truncate font-sans uppercase">
      {{ props.text }}
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  text: String,
});
</script>
