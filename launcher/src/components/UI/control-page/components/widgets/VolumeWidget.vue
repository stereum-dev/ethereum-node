<template>
  <div class="volume-Parent flex w-full h-full justify-center items-center">
    <div class="volume-Ico w-1/3 h-full flex flex-col justify-center items-center">
      <div class="volume-Ico-container flex justify-center items-center w-full h-4/5">
        <img class="w-3/4" src="/img/icon/control-page-icons/hdd.svg" />
      </div>
      <span
        class="w-full h-1/5 flex justify-center items-center text-gray-200 text-2xs font-semibold uppercase"
        >volume</span
      >
    </div>
    <div class="volume-box w-2/3 h-full flex flex-col justify-center items-center p-1">
      <div
        class="volume_services flex w-full h-1/3 border rounded-sm border-gray-500 overflow-hidden relative"
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
        ></div>
      </div>

      <div class="hdd-services w-full h-2/3 flex">
        <div
          class="left-side w-2/3 h-full flex justify-center items-center text-[45%] text-green-500 uppercase"
        >
          <span
            @mouseenter="
              footerStore.cursorLocation = `${availDisk} GB ${t('controlPage.free')}`
            "
            @mouseleave="footerStore.cursorLocation = ''"
            >{{ availDisk }} GB {{ t("controlPage.free") }} </span
          ><span
            class="text-gray-400"
            @mouseenter="
              footerStore.cursorLocation = `${totalDisk} GB ${t('controlPage.total')}`
            "
            @mouseleave="footerStore.cursorLocation = ''"
          >
            / {{ totalDisk }} GB {{ $t("controlPage.total") }}</span
          >
        </div>
        <div class="right-side w-1/3 h-full flex justify-center items-center uppercase">
          <div class="ttl-box w-1/4 h-full flex flex-col justify-center items-center">
            <div
              class="title w-full text-[50%] h-1/2 flex justify-center items-center text-gray-200 uppercase mr-1"
            >
              write
            </div>
            <div
              class="title w-full text-[50%] h-1/2 flex justify-center items-center text-gray-200 uppercase mr-1"
            >
              read
            </div>
          </div>
          <div
            class="val-box w-3/4 h-full flex flex-col text-[70%] justify-center font-semibold items-center"
          >
            <div
              class="title w-full h-1/2 flex justify-center items-center text-orange-500 uppercase"
              @mouseenter="
                footerStore.cursorLocation = `Write: ${convertWriteValueToMb} ${
                  controlStore.writeValue / 1024 < 1 && controlStore.writeValue / 1024 > 0
                    ? 'KB'
                    : 'MB'
                }`
              "
              @mouseleave="footerStore.cursorLocation = ''"
            >
              {{ convertWriteValueToMb }}
              {{
                controlStore.writeValue / 1024 < 1 && controlStore.writeValue / 1024 > 0
                  ? "KB"
                  : "MB"
              }}
            </div>
            <div
              class="title w-full h-1/2 flex justify-center items-center text-teal-700 uppercase"
              @mouseenter="
                footerStore.cursorLocation = `Read: ${convertReadValueToMb} ${
                  controlStore.readValue / 1024 < 1 && controlStore.writeValue / 1024 > 0
                    ? 'KB'
                    : 'MB'
                }`
              "
              @mouseleave="footerStore.cursorLocation = ''"
            >
              {{ convertReadValueToMb }}
              {{
                controlStore.readValue / 1024 < 1 && controlStore.writeValue / 1024 > 0
                  ? "KB"
                  : "MB"
              }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useControlStore } from "@/store/theControl";
import { useServices } from "@/store/services";
import { useFooter } from "@/store/theFooter";

import i18n from "@/includes/i18n";

const t = i18n.global.t;

const controlStore = useControlStore();
const serviceStore = useServices();
const footerStore = useFooter();

const totalDisk = computed(() => controlStore.totalDisk);

const storagestatus = computed(() => {
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

    const matchingService = serviceStore.installedServices.find(
      (service) => service.service === item.service
    );
    const serviceIcon = matchingService
      ? matchingService.icon
      : "/path/to/default/icon.png";

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

<style scoped>
.volume_services {
  white-space: nowrap;
  overflow-x: scroll;
  scrollbar-width: none;
}

.volume_services::-webkit-scrollbar {
  display: none;
}

.squa {
  flex-shrink: 0;
}
</style>
