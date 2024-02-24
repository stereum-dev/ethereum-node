<template>
  <div class="w-full audio-output-parent flex h-ful">
    <div class="selected-option w-full h-full flex justify-between items-center" @click="toggleDropdown">
      <span class="device-label w-11/12 flex justify-start items-center font-semibold capitalize pl-2 mr-0">
        {{ selectedDevice.label || "Select a device" }}
      </span>
      <img
        class="mr-2"
        :style="{ transform: dropdownVisible ? 'rotate(0deg)' : 'rotate(180deg)' }"
        src="/img/icon/control/arrowIcon.png"
        alt="topDown"
      />
    </div>
    <ul v-if="dropdownVisible" class="dropdown-audio-output w-64 bg-white h-full absolute z-50">
      <li v-for="device in audioOutputDevices" :key="device.deviceId" @click="selectDevice(device)">
        {{ device.label }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const audioOutputDevices = ref([]);
const selectedDevice = ref({});
const dropdownVisible = ref(false);

const toggleDropdown = () => {
  dropdownVisible.value = !dropdownVisible.value;
};

const selectDevice = (device) => {
  selectedDevice.value = device;
  toggleDropdown();
};

onMounted(() => {
  getAudioDevices();
});

const getAudioDevices = async () => {
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    const devices = await navigator.mediaDevices.enumerateDevices();
    audioOutputDevices.value = devices.filter((device) => device.kind === "audiooutput");

    if (audioOutputDevices.value.length > 0) {
      selectedDevice.value = audioOutputDevices.value[0];
    }
  } catch (error) {
    console.error("Error accessing media devices:", error);
  }
};
</script>

<style scoped>
.selected-option {
  color: #eee;
}
.selected-option img {
  width: 15px;
  height: 15px;
  transition: 0.3s;
  transform: rotate(180deg);
}

.device-label {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 0.75rem;
}

.dropdown-audio-output span:hover {
  background: #a1c1ad;
  color: #000;
  cursor: pointer;
}
.dropdown-audio-output li:hover {
  background-color: aquamarine;
}
</style>
