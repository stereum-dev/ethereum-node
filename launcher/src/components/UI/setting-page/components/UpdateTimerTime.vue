<template>
  <div class="UpdateTimerTime-parent w-full h-full justify-center items-center flex">
    <input
      type="number"
      :value="footerStore.updateTimerTime"
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
    if (typeof savedConfig.updateTimerTime?.value !== "undefined") {
      footerStore.updateTimerTime = savedConfig.updateTimerTime.value;
    } else {
      updateSettings(12);
    }
  } catch (error) {
    console.error("Failed to load saved settings:", error);
  }
};
const updateSettings = async (updateTimeT) => {
  try {
    const prevConf = await ControlService.readConfig();
    const conf = {
      ...prevConf,
      updateTimerTime: { value: updateTimeT },
    };
    await ControlService.writeConfig(conf);
    useFooter.updateTimer = updateTimeT;
    checkSettings();
  } catch (error) {
    console.error("Failed to update settings:", error);
  }
};
const onChange = async (event) => {
  if (event.target.value == "" || event.target.value < 12) {
    event.target.value = 12;
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
.UpdateTimerTime-parent {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
