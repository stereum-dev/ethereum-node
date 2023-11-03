<template>
  <div
    class="w-full col-start-1 col-span-full row-start-1 row-span-1 rounded-t-md border-b-2 border-gray-500 grid grid-cols-12"
  >
    <span
      id="name"
      class="col-start-2 col-end-5 text-xs text-gray-300 font-semibold self-center text-center uppercase"
      >{{ t("displayValidator.pk") }}</span
    >
    <span id="service" class="col-start-5 col-span-1 text-xs text-gray-300 font-semibold self-center text-center">{{
      t("displayValidator.service")
    }}</span>
    <span id="active" class="col-start-6 col-span-1 text-xs text-gray-300 font-semibold self-center text-center"
      >PERIOD</span
    >
    <span id="state" class="col-start-7 col-span-1 text-xs text-gray-300 font-semibold self-center text-center">{{
      t("displayValidator.state")
    }}</span>
    <span id="balance" class="col-start-8 col-span-2 text-xs text-gray-300 font-semibold self-center text-center">{{
      t("displayValidator.balance")
    }}</span>
    <span id="option" class="col-start-10 col-span-full text-xs text-gray-300 font-semibold self-center text-center">{{
      t("displayValidator.option")
    }}</span>
  </div>
</template>

<script setup>
import i118n from "@/includes/i18n";
const t = i118n.global.t;
</script>
