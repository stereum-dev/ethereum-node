<template>
  <div class="w-full h-full col-start-1 col-span-full row-start-1 row-span-full grid grid-cols-24 grid-rows-12 p-1">
    <div
      class="w-full h-full col-start-5 col-end-21 row-start-3 row-end-11 grid grid-cols-12 grid-rows-12 p-2 mx-auto bg-[#1E2429] rounded-md"
    >
      <div class="col-start-1 col-span-full row-start-1 row-span-1 bg-teal-600 rounded-md py-1 px-2 grid grid-cols-12 z-10">
        <span class="col-start-1 col-end-5 text-sm text-gray-200 font-normal uppercase self-center justify-self-start">{{
          $t("importingVerify.pluginInst")
        }}</span>
        <span class="col-start-5 col-end-7 text-sm text-gray-200 font-normal uppercase self-center justify-self-start">{{
          $t("importingVerify.cat")
        }}</span>
        <span class="col-start-7 col-span-full text-sm text-gray-200 font-normal uppercase self-center justify-self-start">{{
          $t("importingVerify.path")
        }}</span>
      </div>
      <div
        class="col-start-1 col-span-full row-start-2 row-span-full w-full max-h-[320px] flex flex-col justify-start items-start space-y-2 mt-2 overflow-x-hidden overflow-y-scroll"
      >
        <TransitionGroup name="fade" tag="div" class="w-full space-y-2">
          <div
            v-for="(plugin, index) in configServices.filter((item) => item.category !== undefined)"
            :key="`${plugin.name} + ${index}`"
            class="w-full h-10 grid grid-cols-12 bg-[#32363A] rounded-md px-2"
          >
            <img class="w-8 h-8 col-start-1 col-span-1 self-center justify-self-start" :src="plugin.icon" alt="icon" />
            <div class="col-start-2 col-end-5 flex justify-start items-center">
              <span class="text-sm text-gray-300 font-semibold capitalize">
                {{ plugin.name ? plugin.name : plugin.service }}
              </span>
            </div>
            <div class="col-start-5 col-end-7 flex justify-start items-center">
              <span class="text-teal-500 text-sm font-semibold">
                {{ plugin.category }}
              </span>
            </div>
            <div class="col-start-7 col-span-full flex justify-start items-center">
              <span class="text-sm text-amber-500 font-semibold"> {{ plugin.path }}</span>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useClickInstall } from "@/store/clickInstallation";
import { computed } from "vue";

const installStore = useClickInstall();
const configServices = computed(() => {
  return installStore.configServices;
});
</script>
