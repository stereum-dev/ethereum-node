<template>
  <div class="col-start-1 col-span-full row-start-1 row-span-1 p-1 bg-[#264744] rounded-t-md flex justify-center items-center">
    <span class="text-xl font-bold text-gray-200 uppercase tracking-wider"> {{ t("customInstallation.customInstallationTitle") }}</span>
  </div>
</template>
<script setup>
import i18n from "@/includes/i18n";

const t = i18n.global.t;
</script>
