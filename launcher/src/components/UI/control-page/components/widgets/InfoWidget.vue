<template>
  <div class="info-Parent flex w-full h-full justify-center items-center">
    <div class="info-Ico w-1/3 h-full flex flex-col justify-center items-center">
      <div class="info-Ico-container flex justify-center items-center w-full h-4/5">
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
          <span class="server-name">{{ controlStore.ServerName }}</span>
        </div>
      </div>
      <div class="info-row w-full h-1/3 flex justify-center items-center rounded-lg border border-gray-500">
        <div class="w-1/5 flex h-full font-semibold items-center justify-start pl-2 text-gray-200 uppercase text-xs">ip:</div>
        <div class="text-widget w-4/5 flex h-full font-semibold items-center justify-start pl-2 text-gray-200 uppercase text-xs">
          <span>{{ controlStore.ipAddress }}</span>
        </div>
      </div>
      <div class="info-row w-full h-1/3 flex justify-center items-center rounded-lg border border-gray-500">
        <div class="w-1/6 h-full flex justify-center items-center">
          <img class="w-3/4 h-4/5" src="/img/icon/control-page-icons/Earth_Western.png" alt="" />
        </div>
        <div class="time-box w-2/6 h-full flex justify-center items-center text-gray-200 font-semibold text-[60%]">
          {{ utcTime }}
        </div>
        <div class="time-box w-2/6 h-full flex justify-center items-center text-gray-200 font-semibold text-[60%]">
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

const utcTime = ref("");
const serverTime = ref("--:--:--");
let polling = null;

const controlStore = useControlStore();

onMounted(() => {
  polling = setInterval(() => {
    getUtcTime();
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
