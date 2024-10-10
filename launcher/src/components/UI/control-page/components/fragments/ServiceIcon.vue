<template>
  <div class="icon h-full w-1/6 flex justify-center items-center">
    <img class="w-4/6" :src="props.icon" :alt="props.altText" />
  </div>
</template>

<script setup>
const props = defineProps({
  icon: String,
  altText: String,
});
</script>
