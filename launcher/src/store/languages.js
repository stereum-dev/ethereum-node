import { defineStore } from "pinia";

export const useLangStore = defineStore("languages", {
  state: () => {
    return {
      currentVolume: 1,
      selectedDeviceId: "",
      dialogIsVisible: false,
      settingPageIsVisible: false,
      langOptions: [
        {
          name: "english",
          flag: "img/flag/united-kingdom.png",
          label: "en",
          isSelected: false,
        },
        {
          name: "deutsch",
          flag: "img/flag/germany.png",
          label: "de",
          isSelected: true,
        },
        {
          name: "français",
          flag: "img/flag/france.png",
          label: "fr",
          isSelected: false,
        },
        {
          name: "ESPAÑOL",
          flag: "img/flag/spain.png",
          label: "es",
          isSelected: false,
        },
        {
          name: "فارسی",
          flag: "img/flag/iran.png",
          label: "fa",
          isSelected: false,
        },
        {
          name: "العربية",
          flag: "img/flag/saudi-arabia.png",
          label: "ar",
          isSelected: false,
        },
        {
          name: "Türkçe",
          flag: "img/flag/turkey.png",
          label: "tr",
          isSelected: false,
        },
        {
          name: "dutch",
          flag: "img/flag/netherlands.png",
          label: "nl",
          isSelected: false,
        },
        {
          name: "Português",
          flag: "img/flag/portugal.png",
          label: "po",
          isSelected: false,
        },
        {
          name: "日本語",
          flag: "img/flag/japan.png",
          label: "jp",
          isSelected: false,
        },
        {
          name: "Italiano",
          flag: "img/flag/italy.png",
          label: "it",
          isSelected: false,
        },
        {
          name: "Pусский",
          flag: "img/flag/russia.png",
          label: "ru",
          isSelected: false,
        },
        {
          name: "简体中文",
          flag: "img/flag/china.png",
          label: "zh",
          isSelected: false,
        },
        {
          name: "български",
          flag: "img/flag/bulgaria.png",
          label: "bg",
          isSelected: false,
        },
        {
          name: "монгол хэл",
          flag: "img/flag/mongolia.png",
          label: "mn",
          isSelected: false,
        },
        {
          name: "Српски",
          flag: "img/flag/serbia.png",
          label: "sr",
          isSelected: false,
        },
        {
          name: "Česká",
          flag: "img/flag/czech.png",
          label: "cs",
          isSelected: false,
        },
        {
          name: "Việt Nam",
          flag: "img/flag/vietnam.png",
          label: "vi",
          isSelected: false,
        },
        //new languages added
        {
          name: "हिन्दी",
          flag: "img/flag/india.png",
          label: "hi",
          isSelected: false,
        },
        {
          name: "বাংলা",
          flag: "img/flag/bangladesh.png",
          label: "bn",
          isSelected: false,
        },
        {
          name: "اردو",
          flag: "img/flag/pakistan.png",
          label: "ur",
          isSelected: false,
        },
        {
          name: "Bahasa Indonesia",
          flag: "img/flag/indonesia.png",
          label: "id",
          isSelected: false,
        },
        {
          name: "Kiswahili",
          flag: "img/flag/kenya.png",
          label: "sw",
          isSelected: false,
        },
        {
          name: "मराठी",
          flag: "img/flag/india.png",
          label: "mr",
          isSelected: false,
        },
        {
          name: "తెలుగు",
          flag: "img/flag/india.png",
          label: "te",
          isSelected: false,
        },
        {
          name: "தமிழ்",
          flag: "img/flag/india.png",
          label: "ta",
          isSelected: false,
        },
        {
          name: "한국어",
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
