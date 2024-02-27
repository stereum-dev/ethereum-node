<!-- <template>
  <div class="flex w-full h-full items-center justify-around">
    <span style="color: aliceblue" class="w-12 flex justify-center items-center font-semibold pr-2">{{ value }}</span
    ><vue-slider
      v-model="value"
      dot-size="16"
      width="185px"
      :process-style="{ backgroundColor: '#336666' }"
      
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
</style> -->

<template>
  <div class="flex w-full m-auto items-center h-32 justify-center">
    <div class="px-2 py-1 relative w-10/12">
      <div ref="sliderBar" class="h-2 bg-gray-200 rounded-full mx-auto">
        <div
          :style="{ width: (volumePercentage <= 92 ? volumePercentage : 92) + '%' }"
          class="absolute h-2 rounded-full bg-teal-600"
        ></div>
        <div
          :style="{ left: (volumePercentage <= 92 ? volumePercentage : 92) + '%' }"
          class="slider-thumb absolute h-4 flex items-center justify-center w-4 rounded-full shadow border border-gray-300 top-0 cursor-pointer"
          @mousedown="startDrag"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const sliderBar = ref(null);
const audio = new Audio("path_to_your_audio_file");
const volumePercentage = ref(95);

const updateVolume = (clientX) => {
  const barRect = sliderBar.value.getBoundingClientRect();
  const newVolume = Math.max(0, Math.min(1, (clientX - barRect.left) / barRect.width));
  audio.volume = newVolume;
  volumePercentage.value = newVolume * 100;
};

const onMouseMove = (event) => {
  updateVolume(event.clientX);
};

const onMouseUp = () => {
  document.removeEventListener("mousemove", onMouseMove);
  document.removeEventListener("mouseup", onMouseUp);
  console.log("Volume set to", volumePercentage.value);
};

const startDrag = () => {
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
};

onMounted(() => {
  sliderBar.value.addEventListener("click", (event) => {
    updateVolume(event.clientX);
  });
});

onUnmounted(() => {
  document.removeEventListener("mousemove", onMouseMove);
  document.removeEventListener("mouseup", onMouseUp);
});
</script>

<style>
.slider-thumb {
  background-color: #336666;
  cursor: pointer;
  touch-action: none;
}
.slider-thumb:active {
  background-color: #a1c1ad;
}
</style>
