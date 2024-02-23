<template>
  <div class="flex w-full h-full items-center justify-center">
    <span style="color: aliceblue; width: 40px" class="flex justify-start items-center font-semibold">{{ value }}</span
    ><vue-slider v-model="value" dot-size="14" width="170px" tooltip="none"></vue-slider>
  </div>
</template>

<script setup>
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";
import { ref } from "vue";

const value = ref(0);
</script>
