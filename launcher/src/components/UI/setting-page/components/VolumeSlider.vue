<template>
  <div class="flex w-full m-auto items-center h-32 justify-center bg-[#33393E] rounded-md">
    <div class="px-2 py-1 relative w-10/12">
      <div ref="sliderBar" class="h-2 bg-gray-200 rounded-full mx-auto">
        <div :style="{ width: (volumePercentage <= 92 ? volumePercentage : 92) + '%' }" class="absolute h-2 rounded-full bg-teal-600"></div>
        <div
          :style="{
            left: (volumePercentage <= 92 ? volumePercentage : 92) + '%',
            background: langStore.currentVolume === 0 ? '#ff0000' : '#336666',
          }"
          class="slider-thumb absolute h-4 flex items-center justify-center w-4 rounded-full shadow border border-gray-300 top-0 cursor-pointer"
          @mousedown="startDrag"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useLangStore } from "@/store/languages";
import { useSoundStore } from "@/store/sound";
import ControlService from "@/store/ControlService";

const soundStore = useSoundStore();
const langStore = useLangStore();

const sliderBar = ref(null);
const volumePercentage = ref(95);

const checkSettings = async () => {
  try {
    const savedConfig = await ControlService.readConfig();

    if (savedConfig?.savedVolume?.volume) {
      langStore.currentVolume = savedConfig.savedVolume.volume;
      volumePercentage.value = savedConfig.savedVolume.volume * 100;
    } else if (savedConfig?.savedVolume?.volume === 0) {
      langStore.currentVolume = 0;
      volumePercentage.value = 0;
    } else {
      langStore.currentVolume = 0.95;
      volumePercentage.value = 95;
    }
  } catch (error) {
    console.error("Failed to load saved settings:", error);
  }
};

const updateSettings = async (vol) => {
  try {
    const prevConf = await ControlService.readConfig();
    const conf = {
      ...prevConf,
      savedVolume: { volume: vol },
    };
    await ControlService.writeConfig(conf);
  } catch (error) {
    console.error("Failed to update settings:", error);
  }
};

const updateVolume = async (clientX) => {
  const barRect = sliderBar.value.getBoundingClientRect();
  const newVolume = Math.max(0, Math.min(1, (clientX - barRect.left) / barRect.width));
  langStore.currentVolume = newVolume;
  volumePercentage.value = newVolume * 100;
  await updateSettings(langStore.currentVolume);
};

const playSoundEffect = async (base64Data) => {
  const audio = new Audio(base64Data);
  audio.volume = langStore.currentVolume;

  if ("setSinkId" in audio && langStore.selectedDeviceId) {
    try {
      await audio.setSinkId(langStore.selectedDeviceId);
    } catch (error) {
      console.warn("Failed to set audio output device:", error);
    }
  } else {
    if (!("setSinkId" in audio)) {
      console.warn("setSinkId is not supported by this browser.");
    }
    if (!langStore.selectedDeviceId) {
      console.warn("No audio output device selected.");
    }
  }

  audio.play().catch((e) => console.error("Failed to play sound:", e));
};

const onMouseMove = (event) => {
  updateVolume(event.clientX);
};

const onMouseUp = () => {
  document.removeEventListener("mousemove", onMouseMove);
  document.removeEventListener("mouseup", onMouseUp);
  playSoundEffect(soundStore.click, langStore.selectedDeviceId);
};

const startDrag = () => {
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
};

onMounted(() => {
  checkSettings();
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
  cursor: pointer;
  touch-action: none;
}
.slider-thumb:active {
  background-color: #a1c1ad;
}
</style>
