<template>
  <div class="w-full h-full fixed inset-0 flex justify-center items-center rounded-lg z-20">
    <div class="w-full h-full opacity-70 fixed inset-0 bg-black z-30 rounded-lg"></div>
    <div class="w-2/3 flex justify-center items-center p-8 z-50">
      <img class="opacity-80" :src="props.anime" alt="Modify Gif" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  anime: {
    type: String,
    required: true,
  },
});
</script>
