<template>
  <div class="w-full h-full col-start-8 col-span-full row-start-2 row-end-11 flex flex-col gap-3 py-4 px-2">
    <input
      v-model="searchTerm"
      type="text"
      placeholder="Search language..."
      class="w-full shrink-0 bg-[#1E2429] text-gray-200 placeholder-gray-400 text-base rounded-md border border-[#33393E] px-4 py-2 focus:outline-none focus:border-[#4d7575]"
    />

    <div class="grow min-h-0 overflow-y-auto bg-[#1E2429] border border-[#4d7575] rounded-md p-2">
      <ul class="grid grid-cols-2 gap-2">
        <li
          v-for="lang in filteredLanguages"
          :key="lang.label"
          class="h-16 px-2 flex items-center gap-2 bg-[#33393E] border border-[#33393E] rounded-md cursor-pointer hover:border-[#4d7575]"
          :class="{ 'selected-language': lang.isSelected }"
          @click="selectItem(lang)"
        >
          <img :src="lang.flag" :alt="`${lang.englishName} Flag`" class="w-9 h-9 rounded-full shrink-0" />
          <span class="flex flex-col min-w-0">
            <span class="text-base font-bold uppercase truncate text-gray-200">{{ lang.name }}</span>
            <span class="text-xs truncate text-gray-400">{{ lang.englishName }}</span>
          </span>
        </li>
      </ul>

      <p v-if="!filteredLanguages.length" class="text-center text-gray-200 text-base mt-6">No language matches "{{ searchTerm }}"</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeMount, onMounted } from "vue";
import { useLangStore } from "@/store/languages";
import { useSoundStore } from "@/store/sound";
import ControlService from "@/store/ControlService";
import { useRouter } from "vue-router";
import i18n from "@/includes/i18n";

const langStore = useLangStore();
const router = useRouter();
const soundStore = useSoundStore();
const searchTerm = ref("");

const sortedLanguages = computed(() => {
  return [...langStore.langOptions].sort((a, b) => a.englishName.localeCompare(b.englishName));
});

const filteredLanguages = computed(() => {
  const term = searchTerm.value.trim().toLowerCase();
  if (!term) return sortedLanguages.value;
  return sortedLanguages.value.filter((lang) =>
    [lang.name, lang.englishName, lang.label].some((value) => value.toLowerCase().includes(term))
  );
});

onBeforeMount(async () => {
  if (!langStore.settingPageIsVisible) {
    await checkSettings();
  } else {
    router.push("/");
  }
});

onMounted(async () => {
  await checkVolume();
  await preselectSavedLanguage();
});

// langStore.settingPageIsVisible ? "/setting" :
const checkSettings = async () => {
  try {
    const savedConfig = await ControlService.readConfig();

    // Handle language settings and routing
    const { savedLanguage, savedVolume } = savedConfig || {};

    if (savedLanguage?.flag && savedLanguage?.label) {
      router.push("/login");
    } else {
      router.push("/");
    }

    // Handle volume settings
    langStore.currentVolume = savedVolume?.volume ?? 0;
  } catch (error) {
    console.error("Failed to load saved settings:", error);
  }
};

const checkVolume = async () => {
  try {
    const savedConfig = await ControlService.readConfig();
    const { savedVolume } = savedConfig || {};
    langStore.currentVolume = savedVolume?.volume ?? 0;
  } catch (error) {
    console.error("Failed to load saved settings:", error);
  }
};

// Highlight the language that is already stored, so the user sees the current choice
// and can continue without having to pick again
const preselectSavedLanguage = async () => {
  try {
    const { savedLanguage } = (await ControlService.readConfig()) || {};
    const saved = langStore.langOptions.find((option) => option.label === savedLanguage?.label);
    if (!saved) return;
    langStore.langOptions.forEach((option) => (option.isSelected = false));
    saved.isSelected = true;
    langStore.setSelectedLang(saved.label);
  } catch (error) {
    console.error("Failed to load saved settings:", error);
  }
};

const selectItem = async (lang, playSound = true) => {
  if (playSound) {
    playSoundBase(soundStore.click);
  }
  langStore.langOptions.forEach((option) => (option.isSelected = false));
  lang.isSelected = true;
  langStore.setSelectedLang(lang.label);
  i18n.global.locale.value = lang.label;
  await updateSettings(lang);
};

const playSoundBase = (base64Data) => {
  const audio = new Audio(base64Data);
  audio.volume = langStore.currentVolume;
  audio.play().catch((e) => console.error("Failed to play sound:", e));
};

const updateSettings = async (lang) => {
  try {
    const prevConf = await ControlService.readConfig();
    const conf = {
      ...prevConf,
      savedLanguage: { language: lang.name, flag: lang.flag, label: lang.label },
    };
    await ControlService.writeConfig(conf);
  } catch (error) {
    console.error("Failed to update settings:", error);
  }
};
</script>

<style scoped>
.selected-language {
  background-color: #447a75;
  border-color: #77bfbf;
}
</style>
