import { defineStore } from "pinia";

export const useLangStore = defineStore("languages", {
  state: () => {
    return {
      currentVolume: 1.0,
      selectedDeviceId: "",
      dialogIsVisible: false,
      settingPageIsVisible: false,
      langOptions: [
        {
          name: "english",
          englishName: "English",
          flag: "img/flag/united-kingdom.png",
          label: "en",
          isSelected: false,
        },
        {
          name: "deutsch",
          englishName: "German",
          flag: "img/flag/germany.png",
          label: "de",
          isSelected: false,
        },
        {
          name: "français",
          englishName: "French",
          flag: "img/flag/france.png",
          label: "fr",
          isSelected: false,
        },
        {
          name: "ESPAÑOL",
          englishName: "Spanish",
          flag: "img/flag/spain.png",
          label: "es",
          isSelected: false,
        },
        {
          name: "فارسی",
          englishName: "Persian",
          flag: "img/flag/iran.png",
          label: "fa",
          isSelected: false,
        },
        {
          name: "العربية",
          englishName: "Arabic",
          flag: "img/flag/saudi-arabia.png",
          label: "ar",
          isSelected: false,
        },
        {
          name: "Türkçe",
          englishName: "Turkish",
          flag: "img/flag/turkey.png",
          label: "tr",
          isSelected: false,
        },
        {
          name: "dutch",
          englishName: "Dutch",
          flag: "img/flag/netherlands.png",
          label: "nl",
          isSelected: false,
        },
        {
          name: "Português",
          englishName: "Portuguese",
          flag: "img/flag/portugal.png",
          label: "pt",
          isSelected: false,
        },
        {
          name: "日本語",
          englishName: "Japanese",
          flag: "img/flag/japan.png",
          label: "ja",
          isSelected: false,
        },
        {
          name: "Italiano",
          englishName: "Italian",
          flag: "img/flag/italy.png",
          label: "it",
          isSelected: false,
        },
        {
          name: "Pусский",
          englishName: "Russian",
          flag: "img/flag/russia.png",
          label: "ru",
          isSelected: false,
        },
        {
          name: "简体中文",
          englishName: "Chinese",
          flag: "img/flag/china.png",
          label: "zh",
          isSelected: false,
        },
        {
          name: "български",
          englishName: "Bulgarian",
          flag: "img/flag/bulgaria.png",
          label: "bg",
          isSelected: false,
        },
        {
          name: "монгол хэл",
          englishName: "Mongolian",
          flag: "img/flag/mongolia.png",
          label: "mn",
          isSelected: false,
        },
        {
          name: "Српски",
          englishName: "Serbian",
          flag: "img/flag/serbia.png",
          label: "sr",
          isSelected: false,
        },
        {
          name: "Česká",
          englishName: "Czech",
          flag: "img/flag/czech.png",
          label: "cs",
          isSelected: false,
        },
        {
          name: "Việt Nam",
          englishName: "Vietnamese",
          flag: "img/flag/vietnam.png",
          label: "vi",
          isSelected: false,
        },
        //new languages added
        {
          name: "हिन्दी",
          englishName: "Hindi",
          flag: "img/flag/india.png",
          label: "hi",
          isSelected: false,
        },
        {
          name: "বাংলা",
          englishName: "Bengali",
          flag: "img/flag/bangladesh.png",
          label: "bn",
          isSelected: false,
        },
        {
          name: "اردو",
          englishName: "Urdu",
          flag: "img/flag/pakistan.png",
          label: "ur",
          isSelected: false,
        },
        {
          name: "Bahasa Indonesia",
          englishName: "Indonesian",
          flag: "img/flag/indonesia.png",
          label: "id",
          isSelected: false,
        },
        {
          name: "Kiswahili",
          englishName: "Swahili",
          flag: "img/flag/kenya.png",
          label: "sw",
          isSelected: false,
        },
        {
          name: "मराठी",
          englishName: "Marathi",
          flag: "img/flag/india.png",
          label: "mr",
          isSelected: false,
        },
        {
          name: "తెలుగు",
          englishName: "Telugu",
          flag: "img/flag/india.png",
          label: "te",
          isSelected: false,
        },
        {
          name: "தமிழ்",
          englishName: "Tamil",
          flag: "img/flag/india.png",
          label: "ta",
          isSelected: false,
        },
        {
          name: "한국어",
          englishName: "Korean",
          flag: "img/flag/korea.png",
          label: "ko",
          isSelected: false,
        },
      ],
      selectedLang: "",
      isEntryAnimationActive: false,
    };
  },
  actions: {
    showDialog() {
      this.dialogIsVisible = true;
    },
    hideDialog() {
      this.dialogIsVisible = false;
    },
    setSelectedLang(payload) {
      this.selectedLang = payload;
    },
    runEntryAnimation() {
      this.isEntryAnimationActive = true;
    },
  },
});
