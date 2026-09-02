<template>
  <div class="toggle-container">
    <label class="switch relative">
      <input type="checkbox" :checked="footerStore.idleTimer" @click="toggleIdleTimer" />
      <div class="slider round w-full h-full cursor-pointer bg-gray-400"></div>
    </label>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import ControlService from "@/store/ControlService";
import { useFooter } from "@/store/theFooter";

const footerStore = useFooter();

let idleTimer = false;

const checkSettings = async () => {
  try {
    const savedConfig = await ControlService.readConfig();
    if (typeof savedConfig?.idleTimer?.enabled !== "undefined") {
      footerStore.idleTimer = savedConfig.idleTimer.enabled;
    } else {
      updateSettings(false, footerStore.idleTimerTime);
      checkSettings();
    }
  } catch (error) {
    console.error("Failed to load saved settings:", error);
  }
};

const updateSettings = async (idleT) => {
  console.log(idleT + " " + footerStore.idleTimerTime);
  try {
    const prevConf = await ControlService.readConfig();
    const conf = {
      ...prevConf,
      idleTimer: { enabled: idleT },
      idleTimerTime: { value: footerStore.idleTimerTime },
    };
    await ControlService.writeConfig(conf);
    await ControlService.idleTimerCheck(!idleT);
    await ControlService.setIdleTime(footerStore.idleTimerTime);
    checkSettings();
  } catch (error) {
    console.error("Failed to update settings:", error);
  }
};

const toggleIdleTimer = async () => {
  idleTimer = !idleTimer;
  footerStore.idleTimer = !footerStore.idleTimer;
  updateSettings(idleTimer);
};

onMounted(() => {
  checkSettings();
});
</script>
<style scoped>
.toggle-container {
  width: 100%;
  height: 93%;
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.switch {
  width: 50px;
  height: 24px;
}

.switch input {
  display: none;
}

.slider {
  border-radius: 34px;
  transition: 0.4s;
  box-shadow: inset 0px 0px 6px rgba(0, 0, 0, 0.3);
}

.slider:before {
  position: absolute;
  content: "";
  width: 20px;
  height: 20px;
  border: 2px solid #0686bd;
  left: 3px;
  bottom: 2px;
  background-color: #3183da;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #e9e9e9;
}

input:checked + .slider:before {
  transform: translateX(24px);
  background-color: #488f63;
  border: 1px solid #09794c;
}
</style>
