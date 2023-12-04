import { ref } from 'vue';
<template>
  <div
    class="w-full h-6 bg-gray-300 rounded-full grid grid-cols-6 row-span-1 items-center px-2 hover:bg-[#336666] active:scale-95 hover:text-gray-300 text-gray-800 cursor-pointer transition-all duration-150 ease-in-out mx-auto"
    @click="props.button.events"
  >
    <img class="col-start-1 col-span-1 row-start-1 w-5 h-5" :src="props.button.icon" alt="Button Icon" />
    <span class="col-start-2 col-span-full row-start-1 text-2xs font-semibold text-center uppercase">{{
      props.button.text
    }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
  button: {
    type: Object,
    required: true,
  },
});
</script>
