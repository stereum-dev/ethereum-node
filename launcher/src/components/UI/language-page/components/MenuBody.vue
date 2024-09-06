<template>
  <div
    ref="scrollContainer"
    class="w-full h-full col-start-8 col-span-full row-start-3 row-end-11 py-4 px-2 space-y-8 flex flex-col justify-center items-center overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-gray-300 scrollbar-track-gray-100 snap-y snap-mandatory"
    @scroll="handleScroll"
  >
    <swiper
      direction="vertical"
      slides-per-view="auto"
      space-between="30"
      :effect="'coverflow'"
      :grab-cursor="true"
      :centered-slides="true"
      :coverflow-effect="coverflowEffect"
      :mousewheel="true"
      :keyboard="true"
      :scrollbar="true"
      :modules="swiperModules"
      class="w-full h-full space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-gray-300 scrollbar-track-gray-100 snap-y snap-mandatory"
      @swiper="setThumbsSwiper"
      @slideChange="playSoundBase(soundStore.change)"
    >
      <swiper-slide
        v-for="(lang, index) in sortedLanguages"
        :key="index"
        class="swiper-slide shadow-sm shadow-black"
        :class="{
          selectedLanguage: lang.isSelected,
        }"
        @click="handleClick(lang, index)"
      >
        <img :src="lang.flag" :alt="`${lang.name} Flag`" class="col-start-1 col-span-3 w-10 h-10 rounded-full" />
        <span class="col-start-4 col-span-full text-lg font-bold uppercase" :class="{ 'text-gray-700': selectedLanguage }">{{
          lang.name
        }}</span>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeMount, onMounted } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/pagination";
import { EffectCoverflow, Mousewheel, Keyboard, Scrollbar, Thumbs } from "swiper/modules";
import { useLangStore } from "@/store/languages";
import { useSoundStore } from "@/store/sound";
import ControlService from "@/store/ControlService";
import { useRouter } from "vue-router";
import i18n from "@/includes/i18n";

const langStore = useLangStore();
const router = useRouter();
const soundStore = useSoundStore();
const selectedLanguage = ref(null);
const thumbsSwiper = ref(null);
const swiperModules = [Mousewheel, Keyboard, Scrollbar, EffectCoverflow, Thumbs];
const coverflowEffect = { rotate: 5, stretch: 0, depth: 100, modifier: 3 };

const sortedLanguages = computed(() => {
  return [...langStore.langOptions].sort((a, b) => a.name.localeCompare(b.name));
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

const setThumbsSwiper = (swiper) => {
  thumbsSwiper.value = swiper;
};

const handleClick = (lang) => {
  playSoundBase(soundStore.click);
  selectItem(lang);
};

const selectItem = async (lang, playSound = true) => {
  if (playSound) {
    playSoundBase(soundStore.click);
  }
  langStore.langOptions.forEach((option) => (option.isSelected = false));
  lang.isSelected = true;
  selectedLanguage.value = lang;
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
.swiper-container {
  width: 100% !important;
  height: 50% !important;
}
.swiper-wrapper {
  width: 100% !important;
  height: 50% !important;
  margin: 0 auto !important;
  overflow-x: hidden !important;
  overflow-y: auto !important ;
  display: flex !important;
  box-shadow: none !important;
}

.swiper-slide {
  width: 90% !important;
  height: 80px !important;
  text-align: center;
  font-size: 18px;
  background: #24282d !important;
  border: 1px solid #77bfbf !important;
  border-radius: 10px;
  display: grid !important;
  grid-template-columns: repeat(12, 1fr) !important;
  box-shadow: none !important;
  cursor: pointer;
  box-shadow: 0 0 10px 0 #272b2b !important;
}

.swiper-slide img {
  margin: auto !important;
  width: 50px !important;
  height: 50px !important;
  border-radius: 50% !important;
  grid-column: 1 / span 3 !important;
}

.swiper-slide span {
  margin: auto !important;
  grid-column: 4 / span 10 !important;
  font-size: 20px !important;
  font-weight: bold !important;
  text-transform: uppercase !important;
  color: #fff;
}

.selectedLanguage {
  background: #77bfbf !important;
  color: #272424 !important;
  border-radius: 15px !important;
  box-shadow: 0 0 10px 0 #272b2b !important;
}
swiper-slide > div {
  display: none !important;
  border-radius: 10px !important;
  background-color: transparent !important;
}

::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: transparent !important;
}

::-webkit-scrollbar {
  width: 12px;
  background-color: #d9dfdf;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #39d7d5;
}
</style>
