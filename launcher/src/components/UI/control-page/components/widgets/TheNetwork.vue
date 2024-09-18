<template>
  <div class="networkParent flex w-full h-full justify-center items-center">
    <div class="networkIco w-1/3 h-full flex flex-col justify-center items-center">
      <div class="networkIco-container flex justify-center items-center w-full h-4/5">
        <img class="w-3/4" src="/img/icon/control-page-icons/wifiIcon.svg" />
      </div>
      <span class="w-full h-1/5 flex justify-center items-center text-gray-200 text-2xs font-semibold uppercase">{{
        $t("controlPage.network")
      }}</span>
    </div>
    <div class="totalReceived w-1/3 h-full flex flex-col justify-center items-center">
      <div class="receivePerSecond w-full h-1/2 flex justify-center items-end">
        <span class="text-orange-600 font-semibold text-lg">{{ controlStore.rx }}</span>
      </div>
      <div class="w-full h-1/3 font-semibold text-gray-200 text-sm flex justify-center items-end">
        <span>KB/s</span>
      </div>
      <div class="receiveTitle w-full h-1/3 flex justify-center items-center font-light text-gray-200 text-[50%]">
        {{ $t("controlPage.receive") }}
      </div>
    </div>
    <div class="totalTransmitted w-1/3 h-full flex flex-col">
      <div class="transPerSecond w-full h-1/2 flex justify-center items-end">
        <span class="text-teal-700 font-semibold text-lg">{{ controlStore.tx }}</span>
      </div>
      <div class="w-full h-1/3 font-semibold text-gray-200 text-sm flex justify-center items-end">
        <span>KB/s</span>
      </div>
      <div class="receiveTitle w-full h-1/3 flex justify-center items-center font-light text-gray-200 text-[50%]">
        {{ $t("controlPage.transmit") }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useControlStore } from "@/store/theControl";

const controlStore = useControlStore();
</script>
