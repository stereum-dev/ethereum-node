<template>
  <div class="lang-btn-perent w-full h-full bg-[#33393E] rounded-md flex justify-center items-center cursor-pointer">
    <div class="icon-box w-9 h-full flex justify-center items-center">
      <img class="w-6 h-6" :src="langIco" alt="" />
    </div>
    <span class="w-4/5 flex h-full justify-center items-center uppercase pl-1 text-gray-200 font-semibold text-base">{{
      langName
    }}</span>
  </div>
</template>

<script setup>
import { ref, onMounted, onUpdated } from "vue";
import i18n from "@/includes/i18n";
import ControlService from "@/store/ControlService";

const langIco = ref("");
const langName = ref("");

const checkSettings = async () => {
  const savedConfig = await ControlService.readConfig();
  if (savedConfig !== undefined && savedConfig.savedLanguage !== undefined) {
    langIco.value = savedConfig.savedLanguage.flag;
    langName.value = savedConfig.savedLanguage.language;
    i18n.locale = savedConfig.savedLanguage.label; // Directly use imported i18n to set locale
  }
};

onMounted(() => {
  checkSettings();
});

onUpdated(() => {
  checkSettings();
});
checkSettings();

console.log("langIco: ", langIco);
console.log("langName: ", langName);
</script>

<style scoped></style>
