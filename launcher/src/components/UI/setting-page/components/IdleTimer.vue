<template>
  <div class="toggle-container">
    <label class="switch">
      <input type="checkbox" :checked="footerStore.idleTimer" @click="toggleIdleTimer" />
      <div class="slider round"></div>
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
    if (typeof savedConfig.idleTimer.enabled !== "undefined") {
      footerStore.idleTimer = savedConfig.idleTimer.enabled;
    } else {
      updateSettings(false);
      checkSettings();
    }
  } catch (error) {
    console.error("Failed to load saved settings:", error);
  }
};

const updateSettings = async (idleT) => {
  try {
    const prevConf = await ControlService.readConfig();
    const conf = {
      ...prevConf,
      idleTimer: { enabled: idleT },
    };
    await ControlService.writeConfig(conf);
    await ControlService.idleTimerCheck(!idleT);
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
  width: 50%;
  height: 93%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.switch {
  width: 100%;
  height: 100%;
  position: relative;
}

.switch input {
  display: none;
}

.slider {
  width: 80%;
  height: 80%;
  margin-top: 2px;
  margin-right: 3px;
  margin: 2px 3px;
  cursor: pointer;
  background-color: rgb(215, 215, 215);
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  width: 18px;
  height: 18px;
  border: 2px solid #0686bd;
  left: 7%;
  bottom: 8.4%;
  background-color: #3183da;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #e9e9e9;
}
input:checked + .slider:before {
  width: 18px;
  height: 18px;
  border: 1px solid #157ca8;
  background-color: #488f63;
  border: 1px solid #09794c;
}

input:checked + .slider:before {
  -webkit-transform: translateX(14px);
  -ms-transform: translateX(14px);
  transform: translateX(15px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
