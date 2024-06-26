<template>
  <div class="w-full h-full flex justify-center items-center">
    <img class="w-[80%] h-[70%]" :src="getIcon" alt="WIFI Icon" />
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  status: {
    type: String,
  },
});

const getIcon = computed(() => {
  switch (props.status) {
    case "excellent":
      return "/img/icon/connection-status/excellent.png";
    case "good":
      return "/img/icon/connection-status/good.png";
    case "fair":
      return "/img/icon/connection-status/fair.png";
    case "poor":
      return "/img/icon/connection-status/poor.png";
    case "very poor":
      return "/img/icon/connection-status/very-poor.png";
    default:
      return "/img/icon/connection-status/searching.gif";
  }
});
</script>
