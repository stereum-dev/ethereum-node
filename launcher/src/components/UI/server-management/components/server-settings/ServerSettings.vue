<template>
  <div
    class="w-full h-full col-start-1 col-span-full row-start-1 row-span-full bg-[#1b1b1d] rounded-md grid grid-cols-12 grid-rows-12 p-2 space-y-2 divide-y divide-gray-500"
  >
    <div class="col-start-1 col-span-full row-start-1 row-span-2 p-1 grid grid-cols-12 grid-rows-2">
      <div class="col-start-1 col-span-full row-start-1 row-span-1 text-xs font-bold uppercase text-[#336666]">
        {{ t("serverSetting.nodeServerTtl") }}
      </div>
      <div class="col-start-1 col-span-full row-start-2 row-span-1 rounded-sm px-1 grid grid-cols-12 items-center">
        <span class="col-start-1 col-end-11 text-left text-gray-200 text-xs"> {{ t("serverSetting.auto") }}</span>
        <label
          class="h-full col-start-11 col-span-full items-center relative cursor-pointer p-[2px]"
          @mouseenter="footerStore.cursorLocation = t('serverSetting.tgl')"
          @mouseleave="footerStore.cursorLocation = ''"
        >
          <input type="checkbox" class="sr-only" v-model="isAutoUpdateEnabled" @input="turnOnOff" />
          <div
            class="w-full h-full flex items-center rounded-full p-1 transition-colors duration-300 ease-in-out"
            :class="isAutoUpdateEnabled ? 'bg-green-500' : 'bg-red-500'"
          >
            <div
              class="bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ease-in-out"
              :class="{ 'translate-x-8': isAutoUpdateEnabled }"
            ></div>
            <span class="text-xs text-white font-semibold uppercase" :class="onOff">{{ isAutoUpdateEnabled ? "ON" : "OFF" }}</span>
          </div>
        </label>
      </div>
    </div>
    <div v-if="isAutoUpdateEnabled" class="col-start-1 col-span-full row-start-3 row-span-8 p-1 grid grid-cols-12 grid-rows-7 gap-y-3">
      <div class="col-start-1 col-span-10 row-start-1 row-span-1 text-xs font-bold uppercase text-[#336666]">
        Set your update time and date
      </div>
      <div
        class="col-start-12 col-span-1 row-start-1 row-span-1 flex items-center justify-center p-1 w-8 h-full bg-black rounded-md cursor-pointer hover:scale-110 active:scale-95 transition-all duration-300 ease-in-out"
        @click="activeEdit"
      >
        <img src="/img/icon/service-setting-icons/edit.png" alt="Edit" class="w-6 h-6" />
      </div>

      <div v-if="inputMsg" class="col-start-1 col-span-full row-start-2 row-span-1 text-xs text-red-500 bg-[#2a2a2c] p-2 rounded-md">
        {{ inputMsg }}
      </div>

      <div class="col-start-1 col-span-full row-start-3 row-span-1 grid grid-cols-12 gap-2 items-center">
        <div class="col-span-4 text-xs text-gray-300">Days:</div>
        <div class="col-span-8">
          <input
            v-model="intervalDayInput"
            type="number"
            min="1"
            max="100"
            class="w-full h-7 bg-[#2a2a2c] text-white border border-gray-700 rounded-md p-2 text-sm focus:border-[#336666] focus:outline-none transition-colors"
            :class="!isEditActive ? 'cursor-not-allowed opacity-50' : ''"
            :disabled="!isEditActive"
            placeholder="1-100"
          />
        </div>
      </div>

      <div class="col-start-1 col-span-full row-start-4 row-span-1 grid grid-cols-12 gap-2 items-center">
        <div class="col-span-4 text-xs text-gray-300">Hours:</div>
        <div class="col-span-8">
          <input
            v-model="hourInput"
            type="number"
            min="0"
            max="23"
            class="w-full h-7 bg-[#2a2a2c] text-white border border-gray-700 rounded-md p-2 text-sm focus:border-[#336666] focus:outline-none transition-colors"
            placeholder="0-23"
            :class="!isEditActive ? 'cursor-not-allowed opacity-50' : ''"
            :disabled="!isEditActive"
          />
        </div>
      </div>

      <div class="col-start-1 col-span-full row-start-5 row-span-1 grid grid-cols-12 gap-2 items-center">
        <div class="col-span-4 text-xs text-gray-300">Minutes:</div>
        <div class="col-span-8">
          <input
            v-model="minuteInput"
            type="number"
            min="0"
            max="59"
            class="w-full h-7 bg-[#2a2a2c] text-white border border-gray-700 rounded-md p-2 text-sm focus:border-[#336666] focus:outline-none transition-colors"
            placeholder="0-59"
            :class="!isEditActive ? 'cursor-not-allowed opacity-50' : ''"
            :disabled="!isEditActive"
          />
        </div>
      </div>

      <button
        @click="confirmChanges"
        class="col-start-1 col-span-full row-start-7 row-span-1 bg-gradient-to-r from-[#336666] to-[#4a8080] hover:from-[#4a8080] hover:to-[#336666] text-xs uppercase text-white font-medium py-1 px-4 rounded-md transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        :class="!isEditActive ? 'cursor-not-allowed opacity-50 pointer-events-none' : ''"
        :disabled="!areInputsValid || !isEditActive"
      >
        Confirm
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, toRaw, onBeforeMount } from "vue";
import ControlService from "@/store/ControlService";
import { useUpdateCheck } from "@/composables/version.js";
import { useFooter } from "@/store/theFooter";
import i18n from "@/includes/i18n";

const t = i18n.global.t;
const footerStore = useFooter();

const isAutoUpdateEnabled = ref(false);
const intervalDayInput = ref(7);
const hourInput = ref(3);
const minuteInput = ref(0);
const isChangesConfirmed = ref(false);
const inputMsg = ref("");
const isEditActive = ref(false);

const areInputsValid = computed(() => {
  if (intervalDayInput.value === null || hourInput.value === null || minuteInput.value === null) {
    return false;
  }

  const dayValid = intervalDayInput.value >= 1 && intervalDayInput.value <= 100;
  const hourValid = hourInput.value >= 0 && hourInput.value <= 23;
  const minuteValid = minuteInput.value >= 0 && minuteInput.value <= 59;

  return dayValid && hourValid && minuteValid;
});

const onOff = computed(() => {
  return isAutoUpdateEnabled.value ? "absolute left-3" : "absolute right-3";
});

const activeEdit = () => {
  isEditActive.value = !isEditActive.value;
};

const turnOnOff = () => {
  isAutoUpdateEnabled.value = !isAutoUpdateEnabled.value;
  if (!isAutoUpdateEnabled.value) {
    updateSettings();
    updateConfigFile();
  }
};

const confirmChanges = async () => {
  if (!areInputsValid.value) {
    if (intervalDayInput.value < 1 || intervalDayInput.value > 100) {
      inputMsg.value = "Days must be between 1 and 100";
      return;
    }
    if (hourInput.value < 0 || hourInput.value > 23) {
      inputMsg.value = "Hour must be between 0 and 23";
      return;
    }
    if (minuteInput.value < 0 || minuteInput.value > 59) {
      inputMsg.value = "Minute must be between 0 and 59";
      return;
    }
    return;
  }

  inputMsg.value = "";
  isChangesConfirmed.value = true;
  isEditActive.value = false;
  footerStore.cursorLocation = t("serverSetting.confirmed");
  setTimeout(() => {
    footerStore.cursorLocation = "";
  }, 2000);
  await updateSettings();
  updateConfigFile();
};

const updateSettings = async () => {
  let settings = await ControlService.getStereumSettings();
  const unattended = settings.stereum.settings.updates.unattended;
  unattended.install = isAutoUpdateEnabled.value;

  if (isAutoUpdateEnabled.value && isChangesConfirmed.value) {
    unattended.interval_days = parseInt(intervalDayInput.value);
    unattended.hour = parseInt(hourInput.value);
    unattended.min = parseInt(minuteInput.value);
  }

  await ControlService.setStereumSettings(toRaw(settings));
};

const updateConfigFile = async () => {
  try {
    const config = await ControlService.readConfig();
    config.autoUpdate = isAutoUpdateEnabled.value;
    await ControlService.writeConfig(config);
    const test = await ControlService.readConfig();
  } catch (error) {
    console.error("Error updating config file:", error);
  }
};

const getSettings = async () => {
  let settings = await ControlService.getStereumSettings();
  if (settings.stereum?.settings.updates.unattended.install) {
    isAutoUpdateEnabled.value = true;

    if (settings.stereum?.settings.updates.unattended.interval_days) {
      intervalDayInput.value = settings.stereum.settings.updates.unattended.interval_days;
    }
    if (settings.stereum?.settings.updates.unattended.hour !== undefined) {
      hourInput.value = settings.stereum.settings.updates.unattended.hour;
    }
    if (settings.stereum?.settings.updates.unattended.min !== undefined) {
      minuteInput.value = settings.stereum.settings.updates.unattended.min;
    }
  } else {
    isAutoUpdateEnabled.value = false;
  }
};

const loadConfigValues = async () => {
  try {
    const config = await ControlService.readConfig();
    if (config.hasOwnProperty("autoUpdate")) {
      isAutoUpdateEnabled.value = config.autoUpdate;
    }
  } catch (error) {
    console.error("Error loading config values:", error);
  }
};

useUpdateCheck();

onMounted(async () => {
  await getSettings();

  inputMsg.value = "";
});

onBeforeMount(async () => {
  await loadConfigValues();
});
</script>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>
