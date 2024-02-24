<template>
  <div class="flex w-full h-full items-center justify-around">
    <span style="color: aliceblue" class="w-12 flex justify-center items-center font-semibold pr-2">{{ value }}</span
    ><vue-slider
      v-model="value"
      dot-size="16"
      width="185px"
      :process-style="{ backgroundColor: '#336666' }"
      :tooltip-style="{ backgroundColor: 'pink', borderColor: 'pink' }"
      tooltip="none"
    >
      <template #dot="{ focus }">
        <div :class="['custom-dot', { focus }]"></div>
      </template>
    </vue-slider>
  </div>
</template>

<script setup>
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";
import { ref } from "vue";

const value = ref(0);
</script>
<style scoped>
.custom-dot {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #336666;
  transition: 0.2s;
  cursor: pointer;
}
.custom-dot:active {
  background-color: #a1c1ad;
}
</style>
