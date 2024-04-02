<template>
  <div
    class="lang-btn-parent w-full h-full bg-[#33393E] rounded-md flex justify-center items-center cursor-pointer border border-[#33393E] hover:border-[#4d7575]"
    @click="languageSelector"
  >
    <div class="icon-box w-9 h-full flex justify-center items-center">
      <img class="lang-icon w-6 h-6" :src="langIco" :alt="langIco" />
    </div>
    <span class="w-4/5 flex h-full justify-center items-center font-medium uppercase pl-1 text-gray-200 text-base">
      {{ langName }}
    </span>
  </div>
</template>

<script setup>
import { ref, onMounted, onUpdated } from "vue";
import i18n from "@/includes/i18n";
import ControlService from "@/store/ControlService";

const langIco = ref("");
const langName = ref("");

const emit = defineEmits(["languageChanged"]);

const languageSelector = () => {
  emit("languageChanged");
};

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
</script>

<style scoped>
.lang-btn-parent:active {
  box-shadow: 1px 1px 10px 1px #171717 inset;
}

.lang-btn-parent:active .lang-icon {
  transform: scale(0.9);
}

.lang-btn-parent:active span {
  transform: scale(0.95);
}
</style>
