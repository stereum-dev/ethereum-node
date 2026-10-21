<template>
  <div
    class="w-full h-full col-start-1 col-span-full row-start-1 row-span-full bg-[#1b1b1d] rounded-md flex flex-col p-2 divide-y divide-gray-500 overflow-y-auto"
  >
    <div class="p-1 pb-2 flex flex-col gap-2">
      <div class="text-xs font-bold uppercase text-[#336666]">
        {{ t("serverSetting.nodeServerTtl") }}
      </div>
      <div class="rounded-xs px-1 flex items-center">
        <span class="flex-1 text-left text-gray-200 text-xs"> {{ t("serverSetting.auto") }}</span>
        <label
          class="w-[4.5rem] h-8 items-center relative cursor-pointer p-[2px]"
          @mouseenter="footerStore.cursorLocation = t('serverSetting.tgl')"
          @mouseleave="footerStore.cursorLocation = ''"
        >
          <input v-model="isAutoUpdateEnabled" type="checkbox" class="sr-only" @input="turnOnOff" />
          <div
            class="w-full h-full flex items-center rounded-full p-1 transition-colors duration-300 ease-in-out"
            :class="isAutoUpdateEnabled ? 'bg-green-500' : 'bg-red-500'"
          >
            <div
              class="bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ease-in-out"
              :class="{ 'translate-x-10': isAutoUpdateEnabled }"
            ></div>
            <span class="text-xs text-white font-semibold uppercase" :class="onOff">{{ isAutoUpdateEnabled ? "ON" : "OFF" }}</span>
          </div>
        </label>
      </div>
    </div>
    <div v-if="isAutoUpdateEnabled" class="p-1 py-3 flex flex-col gap-3">
      <div class="flex items-center">
        <div class="flex-1 text-xs font-bold uppercase text-[#336666]">Set your update time and date</div>
        <div
          class="flex items-center justify-center p-1 w-8 h-8 bg-black rounded-md cursor-pointer hover:scale-110 active:scale-95 transition-all duration-300 ease-in-out"
          @click="activeEdit"
        >
          <img src="/img/icon/service-setting-icons/edit.png" alt="Edit" class="w-6 h-6" />
        </div>
      </div>

      <div v-if="inputMsg" class="text-xs text-red-500 bg-[#2a2a2c] p-2 rounded-md">
        {{ inputMsg }}
      </div>

      <div class="grid grid-cols-12 gap-2 items-center">
        <div class="col-span-4 text-xs text-gray-300">Days:</div>
        <div class="col-span-8">
          <input
            v-model="intervalDayInput"
            type="number"
            min="1"
            max="28"
            class="w-full h-7 bg-[#2a2a2c] text-white border border-gray-700 rounded-md p-2 text-sm focus:border-[#336666] focus:outline-hidden transition-colors"
            :class="!isEditActive ? 'cursor-not-allowed opacity-50' : ''"
            :disabled="!isEditActive"
            placeholder="1-28"
          />
        </div>
      </div>
      <div class="grid grid-cols-12 gap-2 items-center">
        <div class="col-span-4 text-xs text-gray-300">Hours:</div>
        <div class="col-span-8">
          <input
            v-model="hourInput"
            type="number"
            min="0"
            max="23"
            class="w-full h-7 bg-[#2a2a2c] text-white border border-gray-700 rounded-md p-2 text-sm focus:border-[#336666] focus:outline-hidden transition-colors"
            :class="!isEditActive ? 'cursor-not-allowed opacity-50' : ''"
            :disabled="!isEditActive"
            placeholder="0-23"
          />
        </div>
      </div>
      <div class="grid grid-cols-12 gap-2 items-center">
        <div class="col-span-4 text-xs text-gray-300">Minutes:</div>
        <div class="col-span-8">
          <input
            v-model="minuteInput"
            type="number"
            min="0"
            max="59"
            class="w-full h-7 bg-[#2a2a2c] text-white border border-gray-700 rounded-md p-2 text-sm focus:border-[#336666] focus:outline-hidden transition-colors"
            :class="!isEditActive ? 'cursor-not-allowed opacity-50' : ''"
            :disabled="!isEditActive"
            placeholder="0-59"
          />
        </div>
      </div>

      <button
        class="bg-linear-to-r from-[#336666] to-[#4a8080] hover:from-[#4a8080] hover:to-[#336666] text-xs uppercase text-white font-medium py-1 px-4 rounded-md transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        :class="!areInputsValid ? 'cursor-not-allowed opacity-50 pointer-events-none' : ''"
        :disabled="!areInputsValid"
        @click="confirmChanges"
      >
        Confirm
      </button>
    </div>
    <div class="p-1 pt-3 flex flex-col gap-2">
      <div class="text-xs font-bold uppercase text-[#336666]">{{ t("serverSetting.nodeVersion") }}</div>
      <div class="flex items-center gap-2 px-1">
        <span class="flex-1 text-left text-gray-200 text-xs">{{ t("serverSetting.nodeVersionFollow") }}</span>
        <button
          v-for="option in nodeVersionOptions"
          :key="option.value"
          class="px-3 py-1 rounded-full text-xs font-semibold border transition-colors flex items-center gap-1.5 disabled:cursor-not-allowed"
          :class="[
            nodeVersion === option.value
              ? 'bg-[#336666] border-[#4b8585] text-white'
              : 'bg-[#1d2023] border-[#4b8585]/40 text-gray-300 hover:border-[#4b8585]',
            savingNodeVersion !== null && savingNodeVersion !== option.value ? 'opacity-50' : '',
            savingNodeVersion === option.value ? 'border-amber-400' : '',
          ]"
          :disabled="savingNodeVersion !== null"
          @click="setNodeVersion(option.value)"
        >
          <img v-if="savingNodeVersion === option.value" src="/animation/loading/turning-circle.gif" alt="" class="w-3 h-3" />
          {{ option.label }}
        </button>
      </div>
      <div v-if="savingNodeVersion !== null" class="flex items-center gap-2 text-2xs text-amber-300 px-1">
        <img src="/animation/loading/turning-circle.gif" alt="" class="w-3 h-3" />
        {{ t("serverSetting.nodeVersionSaving", { ref: savingNodeVersion || t("serverSetting.nodeVersionReleases") }) }}
      </div>
      <div v-else-if="nodeVersionError" class="text-2xs text-red-400 border border-red-500 bg-red-900/20 rounded-md px-2 py-1">
        {{ t("serverSetting.nodeVersionFailed") }} {{ nodeVersionError }}
      </div>
      <div v-else-if="nodeVersion" class="text-2xs text-amber-300 border border-amber-500/60 bg-amber-900/20 rounded-md px-2 py-1">
        {{ t("serverSetting.nodeVersionBranchNote", { ref: nodeVersion }) }}
      </div>
      <div v-else class="text-2xs text-[#7fb3b3] px-1">{{ t("serverSetting.nodeVersionReleaseNote") }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, toRaw, onBeforeMount } from "vue";
import ControlService from "@/store/ControlService";
import { useUpdateCheck } from "@/composables/version.js";
import { useFooter } from "@/store/theFooter";
import i18n from "@/includes/i18n";

const t = i18n.global.t;
const footerStore = useFooter();

const isAutoUpdateEnabled = ref(false);
const intervalDayInput = ref(1);
// set random default value for hour and minute
const hourInput = ref(Math.floor(Math.random() * 3));
const minuteInput = ref(Math.floor(Math.random() * 60));
const isChangesConfirmed = ref(false);
const inputMsg = ref("");
const isEditActive = ref(false);
// the git ref the node's Ansible checkout follows instead of the releases, "" for the releases
const nodeVersion = ref("");
// the ref being saved, null when idle
const savingNodeVersion = ref(null);
const nodeVersionError = ref("");
const nodeVersionOptions = computed(() => {
  const options = [
    { value: "", label: t("serverSetting.nodeVersionReleases") },
    { value: "main", label: "main" },
  ];
  // a ref set by hand in stereum.yaml
  if (nodeVersion.value && nodeVersion.value !== "main") options.push({ value: nodeVersion.value, label: nodeVersion.value });
  return options;
});

const areInputsValid = computed(() => {
  if (intervalDayInput.value === null || hourInput.value === null || minuteInput.value === null) {
    return false;
  }

  const dayValid = intervalDayInput.value >= 1 && intervalDayInput.value <= 28;
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
    if (intervalDayInput.value < 1 || intervalDayInput.value > 28) {
      inputMsg.value = "Days must be between 1 and 28";
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

const setNodeVersion = async (value) => {
  if (value === nodeVersion.value || savingNodeVersion.value !== null) return;
  savingNodeVersion.value = value;
  nodeVersionError.value = "";
  try {
    const settings = await ControlService.getStereumSettings();
    const updates = settings.stereum.settings.updates;
    if (value) updates.node_version = value;
    else delete updates.node_version;
    await ControlService.setStereumSettings(toRaw(settings));
    nodeVersion.value = value;
    // the Stereum update offered follows the new target
    await useUpdateCheck();
  } catch (error) {
    console.error("Error setting the node version:", error);
    nodeVersionError.value = error?.message ?? String(error);
  } finally {
    savingNodeVersion.value = null;
  }
};

const updateConfigFile = async () => {
  try {
    const config = await ControlService.readConfig();
    config.autoUpdate = isAutoUpdateEnabled.value;
    await ControlService.writeConfig(config);
  } catch (error) {
    console.error("Error updating config file:", error);
  }
};

const getSettings = async () => {
  let settings = await ControlService.getStereumSettings();
  const ref = settings.stereum?.settings?.updates?.node_version;
  nodeVersion.value = ref ? String(ref) : "";
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
