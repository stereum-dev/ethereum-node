<template>
  <div class="total-setup-services-parent MachineNameParent bg-[#151618] rounded-md w-full h-full relative flex justify-start items-center">
    <span class="w-4/5 h-full text-teal-700 text-sm font-semibold flex justify-center items-center uppercase">{{
      t("setupServicesWidget.text")
    }}</span>
    <span class="w-1/5 h-full text-gray-100 font-semibold flex justify-center items-center uppercase">{{
      controlStore.setupServices
    }}</span>
  </div>
</template>

<script setup>
import { useControlStore } from "@/store/theControl";

import i18n from "@/includes/i18n";

const controlStore = useControlStore();

const t = i18n.global.t;
</script>
