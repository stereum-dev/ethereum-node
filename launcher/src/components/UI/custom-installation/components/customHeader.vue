<template>
  <div
    class="col-start-5 col-end-21 row-start-1 row-span-2 grid grid-cols-6 grid-rows-2 p-1 items-end gap-2"
  >
    <div
      class="h-14 col-start-1 col-end-4 row-start-1 row-span-2 flex justify-center bg-[#1E2429] rounded-md p-1"
    >
      <div class="w-full h-full flex justify-center items-center ml-2">
        <span class="w-full text-[24px] font-bold text-gray-400 uppercase tracking-wider">
          {{ t("customInstallation.customInstallationTitle") }}</span
        >
      </div>
    </div>
  </div>
</template>
<script setup>
import i18n from "../../../../launcher/src/includes/i18n";

const t = i18n.global.t;
</script>
