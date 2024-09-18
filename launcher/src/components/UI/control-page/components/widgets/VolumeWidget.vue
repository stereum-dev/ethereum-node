<template>
  <div class="volume-Parent flex w-full h-full justify-center items-center">
    <div class="volume-Ico w-1/3 h-full flex flex-col justify-center items-center">
      <div class="volume-Ico-container flex justify-center items-center w-full h-4/5">
        <img class="w-3/4" src="/img/icon/control-page-icons/hdd.svg" />
      </div>
      <span class="w-full h-1/5 flex justify-center items-center text-gray-200 text-2xs font-semibold uppercase">volume</span>
    </div>
    <div class="volume-box w-2/3 h-full flex flex-col justify-center items-center p-1">
      <div class="volume_services w-full h-2/3 flex rounded-md border border-gray-500"></div>
      <div class="hdd-services w-full h-1/3 flex">
        <div class="left-side w-3/5 h-full flex justify-center items-center text-[40%] text-green-500 uppercase">
          <span>{{ availDisk }} GB {{ $t("controlPage.free") }} </span
          ><span class="text-gray-400"> / {{ totalDisk }} GB {{ $t("controlPage.total") }}</span>
        </div>
        <div class="right-side w-2/5 h-full flex justify-center items-center uppercase">
          <div class="ttl-box w-1/4 h-full flex flex-col justify-center items-center">
            <div class="title w-full text-[40%] h-1/2 flex justify-center items-center text-gray-200 uppercase">write</div>
            <div class="title w-full text-[40%] h-1/2 flex justify-center items-center text-gray-200 uppercase">read</div>
          </div>
          <div class="val-box w-3/4 h-full flex flex-col text-[60%] justify-center font-semibold items-center">
            <div class="title w-full h-1/2 flex justify-center items-center text-orange-500 uppercase">
              {{ convertWriteValueToMb }}
              {{ controlStore.writeValue / 1024 < 1 && controlStore.writeValue / 1024 > 0 ? "KB" : "MB" }}
            </div>
            <div class="title w-full h-1/2 flex justify-center items-center text-teal-700 uppercase">
              {{ convertReadValueToMb }}
              {{ controlStore.readValue / 1024 < 1 && controlStore.writeValue / 1024 > 0 ? "KB" : "MB" }}
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

const controlStore = useControlStore();

const availDisk = computed(() => controlStore.availDisk);

const totalDisk = computed(() => controlStore.totalDisk);

const writeValue = computed(() => controlStore.writeValue);

const readValue = computed(() => controlStore.readValue);

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

<style scoped></style>
