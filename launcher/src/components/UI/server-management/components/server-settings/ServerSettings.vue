<template>
  <div
    class="w-full h-full col-start-1 col-span-full row-start-1 row-span-full bg-[#1b1b1d] rounded-md grid grid-cols-12 grid-rows-12 p-2 space-y-2"
  >
    <div class="col-start-1 col-span-full row-start-1 row-span-2 border-b border-gray-700 p-1 grid grid-cols-12 grid-rows-2">
      <div class="col-start-1 col-span-full row-start-1 row-span-1 text-xs font-bold uppercase text-[#336666]">
        {{ t("serverSetting.nodeServerTtl") }}
      </div>
      <div class="col-start-1 col-span-full row-start-2 row-span-1 rounded-sm px-1 grid grid-cols-12 items-center">
        <span class="col-start-1 col-end-11 text-left text-gray-200 text-xs"> {{ t("serverSetting.auto") }}</span>
        <label
          class="h-full col-start-11 col-span-full items-center relative cursor-pointer p-[2px]"
          @mouseenter="footerStore.cursorLocation = `${t('serverSetting.tgl')} `"
          @mouseleave="footerStore.cursorLocation = ''"
        >
          <input v-model="isAutoUpdateEnabled" type="checkbox" class="sr-only" />
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, toRaw } from "vue";
import ControlService from "@/store/ControlService";
import { useUpdateCheck } from "@/composables/version.js";
import { useFooter } from "@/store/theFooter";
import i18n from "@/includes/i18n";

const t = i18n.global.t;

const footerStore = useFooter();

const isAutoUpdateEnabled = ref(false);

const onOff = computed(() => {
  return isAutoUpdateEnabled.value ? "absolute left-3" : "absolute right-3";
});

const updateSettings = async () => {
  let settings = await ControlService.getStereumSettings();
  settings.stereum.settings.updates.unattended.install = isAutoUpdateEnabled.value === true;
  await ControlService.setStereumSettings(toRaw(settings));
};

watch(isAutoUpdateEnabled, () => {
  updateSettings();
});

onMounted(async () => {
  useUpdateCheck();
  await getSettings();
});

const getSettings = async () => {
  let settings = await ControlService.getStereumSettings();
  if (settings.stereum?.settings.updates.unattended.install) {
    isAutoUpdateEnabled.value = true;
  } else {
    isAutoUpdateEnabled.value = false;
  }
};
</script>
