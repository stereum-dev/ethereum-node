<template>
  <div class="UpdateTimer-parent w-full h-full justify-center items-center flex">
    <input
      type="number"
      :value="footerStore.updateTimer"
      class="lang-btn-parent w-full h-full bg-[#33393E] rounded-md flex justify-center items-center cursor-pointer border border-[#33393E] uppercase pl-3 pr-3 text-gray-200 text-base"
      @change="onChange($event)"
    />
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import ControlService from "@/store/ControlService";
import { useFooter } from "@/store/theFooter";
const footerStore = useFooter();
const checkSettings = async () => {
  try {
    const savedConfig = await ControlService.readConfig();
    if (typeof savedConfig.updateTimer?.value !== "undefined") {
      footerStore.updateTimer = savedConfig.updateTimer.value;
    } else {
      updateSettings(7);
    }
  } catch (error) {
    console.error("Failed to load saved settings:", error);
  }
};
const updateSettings = async (updateTime) => {
  try {
    const prevConf = await ControlService.readConfig();
    const conf = {
      ...prevConf,
      updateTimer: { value: updateTime },
    };
    await ControlService.writeConfig(conf);
    useFooter.updateTimer = updateTime;
    checkSettings();
  } catch (error) {
    console.error("Failed to update settings:", error);
  }
};
const onChange = async (event) => {
  if (event.target.value == "" || event.target.value < 7) {
    event.target.value = 7;
  }
  updateSettings(event.target.value);
};
onMounted(() => {
  checkSettings();
});
</script>
<style scoped>
input[type="number"] {
  text-align: center;
}
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.UpdateTimer-parent {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
