<template>
  <div class="info-Parent flex w-full h-full justify-center items-center">
    <div class="info-Ico w-1/3 h-full flex flex-col justify-center items-center">
      <div class="info-Ico-container flex justify-center items-center w-full h-4/5 p-1">
        <img class="w-3/4" src="/img/icon/control-page-icons/server-icon.png" />
      </div>
      <span class="w-full h-1/5 flex justify-center items-center text-gray-200 text-2xs font-semibold uppercase">{{
        $t("controlPage.info")
      }}</span>
    </div>
    <div class="info-box gap-1 p-1 w-2/3 h-full flex flex-col justify-center items-center">
      <div class="info-row w-full h-1/3 flex justify-center items-center rounded-lg border border-gray-500">
        <div class="w-1/5 h-full flex justify-center items-center">
          <img class="w-8/12 h-4/5" src="/img/icon/control-page-icons/ubuntuIco.svg" alt="" />
        </div>
        <div class="text-widget w-4/5 flex h-full font-semibold items-center justify-start pl-2 text-gray-200 uppercase text-xs">
          <span
            class="server-name"
            @mouseenter="
              footerStore.cursorLocation = `${t('controlPage.machineNameIs', {
                name: controlStore.ServerName,
              })}`
            "
            @mouseleave="footerStore.cursorLocation = ''"
            >{{ controlStore.ServerName }}</span
          >
        </div>
      </div>
      <div class="info-row w-full h-1/3 flex justify-center items-center rounded-lg border border-gray-500">
        <div class="w-1/5 flex h-full font-semibold items-center justify-start pl-2 text-gray-200 uppercase text-xs">ip:</div>
        <div
          class="text-widget w-4/5 flex h-full font-semibold items-center justify-start pl-2 text-gray-200 uppercase text-xs"
          @mouseenter="
            footerStore.cursorLocation = `${t('controlPage.ipAddressIs', {
              ip: controlStore.ipAddress,
            })}`
          "
          @mouseleave="footerStore.cursorLocation = ''"
        >
          <span>{{ controlStore.ipAddress }}</span>
        </div>
      </div>
      <div class="info-row w-full h-1/3 flex justify-center items-center rounded-lg border border-gray-500">
        <div class="w-1/6 h-full flex justify-center items-center">
          <img class="w-3/4 h-4/5" src="/img/icon/control-page-icons/Earth_Western.png" alt="" />
        </div>
        <div
          class="time-box w-2/6 h-full flex justify-center items-center text-gray-200 font-semibold text-[60%]"
          @mouseenter="
            footerStore.cursorLocation = `${t('controlPage.utcTime', {
              time: utcTime,
            })}`
          "
          @mouseleave="footerStore.cursorLocation = ''"
        >
          {{ utcTime }}
        </div>
        <div
          class="time-box w-2/6 h-full flex justify-center items-center text-gray-200 font-semibold text-[60%]"
          @mouseenter="
            footerStore.cursorLocation = `${t('controlPage.serverSetedTimeIs', {
              time: serverTime,
            })}`
          "
          @mouseleave="footerStore.cursorLocation = ''"
        >
          {{ serverTime }}
        </div>
        <div class="w-1/6 h-full flex justify-center items-center">
          <img class="w-1/2 h-4/5" src="/img/icon/control-page-icons/server-icon-download-icons.png" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useControlStore } from "@/store/theControl";
import { onMounted, ref, onUnmounted } from "vue";
import { useFooter } from "@/store/theFooter";
import ControlService from "@/store/ControlService";

import i18n from "@/includes/i18n";

const t = i18n.global.t;

const utcTime = ref("");
const serverTime = ref("");
let polling = null;
const serverOffset = ref(0);

const controlStore = useControlStore();
const footerStore = useFooter();

const getServerTimeZone = async () => {
  try {
    const response = await ControlService.fetchCurrentTimeZone();
    const timeZoneLog = response.stdout.trim();

    const offsetMatch = timeZoneLog.match(/\((UTC), ([+-]\d{2})(\d{2})\)/);
    if (offsetMatch) {
      const hoursOffset = parseInt(offsetMatch[2], 10);
      const minutesOffset = parseInt(offsetMatch[3], 10);
      serverOffset.value = hoursOffset * 60 + minutesOffset;
    }
  } catch (error) {
    console.error("Error fetching time zone:", error);
  }
};

const getServerTime = () => {
  const date = new Date();
  const utcMinutes = date.getUTCMinutes();
  const utcHours = date.getUTCHours();

  const localMinutes = utcMinutes + serverOffset.value;
  const adjustedDate = new Date(date);
  adjustedDate.setUTCHours(utcHours, localMinutes);

  const hours = String(adjustedDate.getUTCHours()).padStart(2, "0");
  const minutes = String(adjustedDate.getUTCMinutes()).padStart(2, "0");
  const seconds = String(adjustedDate.getUTCSeconds()).padStart(2, "0");

  serverTime.value = `${hours}:${minutes}:${seconds}`;
};

onMounted(() => {
  getServerTimeZone();

  polling = setInterval(() => {
    getUtcTime();
    getServerTime();
  }, 1000);
});

onUnmounted(() => {
  clearInterval(polling);
});

const getUtcTime = () => {
  const date = new Date();
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();
  utcTime.value = `${hours}:${minutes}:${seconds}`;
};
</script>

<style scoped>
.server-name {
  white-space: nowrap;
  overflow-x: scroll;
  display: inline-block;
  scrollbar-width: none;
}

.server-name::-webkit-scrollbar {
  display: none;
}
</style>
