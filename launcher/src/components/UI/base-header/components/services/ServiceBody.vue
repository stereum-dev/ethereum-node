<template>
  <div class="col-start-13 col-end-19 grid grid-cols-12 p-1">
    <ServiceCarousel :slides="slides" />
  </div>
</template>

<script setup>
import ServiceCarousel from "./ServiceCarousel.vue";
import { useNodeHeader } from "@/store/nodeHeader";
import { computed } from "vue";

const headerStore = useNodeHeader();

const slides = computed(() => {
  return JSON.parse(JSON.stringify(headerStore.runningServices));
});
</script>
