<template>
  <div class="col-start-3 col-end-23 row-start-4 row-span-6 grid grid-cols-12 grid-rows-6 p-4 bg-[#1E2429] rounded-lg">
    <div class="col-start-1 col-end-13 row-start-1 row-end-2 w-full h-full flex justify-center items-center">
      <span class="text-xl text-gray-300 font-normal text-center">{{ $t("welcomePage.chooseInstallNode") }}</span>
    </div>
    <div class="col-start-1 col-end-13 row-start-2 row-end-7 w-full h-full flex justify-evenly items-center space-x-2 bg-white">
      <CardItem v-for="item in welStore.installationOptions" :key="item" :item="item" />
    </div>
  </div>
</template>
<script setup>
import CardItem from "./CardItem.vue";
import { useWelcomeStore } from "@/store/welcomePage";

const welStore = useWelcomeStore();
</script>
