<template>
  <div class="volume-Parent flex w-full h-full justify-center items-center">
    <div class="volume-Ico w-1/3 h-full flex flex-col justify-center items-center">
      <div class="volume-Ico-container flex justify-center items-center w-full h-4/5 p-2">
        <img class="w-3/4" src="/img/icon/control-page-icons/hdd.svg" />
      </div>
      <span class="w-full h-1/5 flex justify-center items-center text-gray-200 text-2xs font-semibold uppercase">volume</span>
    </div>
    <div class="volume-box w-2/3 h-full flex flex-col justify-center items-center">
      <div
        class="volume_services flex w-full h-1/4 border rounded-sm border-gray-700 overflow-hidden relative mt-1 mr-2 cursor-pointer"
        @click="storageToggl"
      >
        <div
          v-for="item in storagestatus"
          :key="item.id"
          class="h-full"
          :style="{
            width: getSegmentWidth(item.percentage),
            backgroundColor: getStableColor(item.service),
            minWidth: '1px',
          }"
          @mouseenter="footerStore.cursorLocation = `${item.title} ${item.storageValue}`"
          @mouseleave="footerStore.cursorLocation = ''"
        />
      </div>
      <template v-if="starogeRows">
        <div class="w-full h-3/4 overflow-y-auto scrollable-container pr-1">
          <div v-for="item in storagestatus" :key="item" class="w-full flex pt-1">
            <div
              :class="getTextColor(getStableColor(item.service))"
              class="text-gray-200 text-2xs border border-gray-600 w-full h-4 pl-1 rounded-md flex justify-between pr-1"
              :style="{
                backgroundColor: getStableColor(item.service),
              }"
            >
              <span>{{ item.title }}</span
              ><span>{{ item.storageValue }}</span>
            </div>
          </div>
        </div>
      </template>

      <div v-else class="hdd-services w-full h-3/4 flex pt-1 pb-1 overflow-hidden">
        <div class="write-read-box h-full w-1/2 flex justify-start items-center text-[50%]">
          <div class="ttl-box w-1/4 h-full flex flex-col justify-center items-center mr-1">
            <div class="title w-full text-[7px] h-1/2 flex justify-start items-center text-gray-200 uppercase mr-1">
              <span>write</span>
            </div>
            <div class="title w-full text-[7px] h-1/2 flex justify-center items-center text-gray-200 uppercase">read</div>
          </div>
          <div class="val-box w-3/4 h-full flex flex-col text-xs justify-center items-center">
            <div
              class="title w-full h-1/2 flex justify-center items-center text-2xs font-medium text-orange-500"
              @mouseenter="footerStore.cursorLocation = `Write: ${convertWriteValueToMb} MB`"
              @mouseleave="footerStore.cursorLocation = ''"
            >
              {{ convertWriteValueToMb }}
              MB
            </div>
            <div
              class="title w-full h-1/2 flex justify-center items-center text-2xs font-medium text-emerald-500 uppercase"
              @mouseenter="
                footerStore.cursorLocation = `Read: ${convertReadValueToMb}   MB
                `
              "
              @mouseleave="footerStore.cursorLocation = ''"
            >
              {{ convertReadValueToMb }}
              MB
            </div>
          </div>
        </div>
        <div class="storage-box flex h-full w-1/2 flex-col ml-1">
          <div
            class="used-storage h-1/2 w-full text-2xs flex justify-start items-center text-emerald-500"
            @mouseenter="footerStore.cursorLocation = `${availDisk} GB ${t('controlPage.free')}`"
            @mouseleave="footerStore.cursorLocation = ''"
          >
            {{ availDisk }} GB {{ t("controlPage.free") }}
          </div>
          <div
            class="total-storage h-1/2 w-full text-2xs font-normal text-gray-300 flex justify-start items-center"
            @mouseenter="footerStore.cursorLocation = `${totalDisk} GB ${t('controlPage.total')}`"
            @mouseleave="footerStore.cursorLocation = ''"
          >
            {{ totalDisk }} GB {{ $t("controlPage.total") }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useControlStore } from "@/store/theControl";
import { useServices } from "@/store/services";
import { useFooter } from "@/store/theFooter";

import i18n from "@/includes/i18n";

const t = i18n.global.t;

const controlStore = useControlStore();
const serviceStore = useServices();
const footerStore = useFooter();

const starogeRows = ref(false);

const storageToggl = () => {
  starogeRows.value = !starogeRows.value;
};

const totalDisk = computed(() => controlStore.totalDisk);

const storagestatus = computed(() => {
  if (!Array.isArray(controlStore.storagestatus)) {
    return [];
  }

  if (!serviceStore.installedServices.length) {
    return [];
  }

  return controlStore.storagestatus.map((item) => {
    let valueInGB = parseFloat(item.storageValue);
    if (item.storageValue.includes("MB")) {
      valueInGB /= 1024;
    } else if (item.storageValue.includes("KB")) {
      valueInGB /= 1024 * 1024;
    }

    const percentage = (valueInGB / totalDisk.value) * 100;

    const matchingService = serviceStore.installedServices.find((service) => service.service === item.service);
    const serviceIcon = matchingService ? matchingService.icon : "/path/to/default/icon.png";

    return {
      ...item,
      percentage: parseFloat(percentage.toFixed(2)),
      icon: serviceIcon,
    };
  });
});

const availDisk = computed(() => controlStore.availDisk);

const writeValue = computed(() => controlStore.writeValue);

const readValue = computed(() => controlStore.readValue);

const getSegmentWidth = (percentage) => {
  return percentage < 1 ? "1px" : `${percentage}%`;
};

const getStableColor = (identifier) => {
  let hash = 0;
  for (let i = 0; i < identifier.length; i++) {
    hash = identifier.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).slice(-2);
  }

  return color;
};

const getTextColor = (bgColor) => {
  const hex = bgColor.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 128 ? "text-gray-800" : "text-gray-200";
};

const convertWriteValueToMb = computed(() => {
  const mbValue = writeValue.value / 1024;
  if (mbValue < 1 && mbValue > 0) {
    return Math.floor(writeValue.value);
  }
  return Math.floor(mbValue);
});

const convertReadValueToMb = computed(() => {
  const mbValue = readValue.value / 1024;
  if (mbValue < 1 && mbValue > 0) {
    return Math.floor(readValue.value);
  }
  return Math.floor(mbValue);
});
</script>
