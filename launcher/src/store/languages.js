import { defineStore } from "pinia";

export const useLangStore = defineStore("languages", {
  state: () => {
    return {
      currentVolume: 1,
      selectedDeviceId: "",
      dialogIsVisible: false,
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
