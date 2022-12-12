import { defineStore } from "pinia";

export const useFlagDialog = defineStore("flagDialog", {
  state: () => {
    return {
      dialogIsVisible: false,
      linkFlags: [
        {
          langImg: "img/flag/united-kingdom.png",
          langSelect: "img/flag/united-kingdom.png",
          langName: "english",
          label: "en",
          enable: true,
        },
        {
          langImg: "img/flag/germany.png",
          langSelect: "img/flag/germany.png",
          langName: "deutsch",
          label: "de",
          enable: true,
        },
        {
          langImg: "img/flag/france.png",
          langSelect: "img/flag/france.png",
          langName: "français",
          label: "fr",
          enable: false,
        },
        {
          langImg: "img/flag/spain.png",
          langSelect: "img/flag/spain.png",
          langName: "ESPAÑOL",
          label: "es",
          enable: false,
        },
        {
          langImg: "img/flag/iran.png",
          langSelect: "img/flag/iran.png",
          langName: "فارسی",
          label: "fa",
          enable: true,
        },
        {
          langImg: "img/flag/saudi-arabia.png",
          langSelect: "img/flag/saudi-arabia.png",
          langName: "العربية",
          label: "ar",
          enable: false,
        },
        {
          langImg: "img/flag/turkey.png",
          langSelect: "img/flag/turkey.png",
          langName: "Türkçe",
          label: "tr",
          enable: false,
        },
        {
          langImg: "img/flag/netherlands.png",
          langSelect: "img/flag/netherlands.png",
          langName: "dutch",
          label: "nl",
          enable: false,
        },
        {
          langImg: "img/flag/portugal.png",
          langSelect: "img/flag/portugal.png",
          langName: "Português",
          label: "po",
          enable: false,
        },
        {
          langImg: "img/flag/japan.png",
          langSelect: "img/flag/japan.png",
          langName: "日本語",
          label: "jp",
          enable: false,
        },
        {
          langImg: "img/flag/italy.png",
          langSelect: "img/flag/italy.png",
          langName: "Italiano",
          label: "it",
          enable: false,
        },
        {
          langImg: "img/flag/russia.png",
          langSelect: "img/flag/russia.png",
          langName: "Pусский",
          label: "ru",
          enable: false,
        },
        {
          langImg: "img/flag/china.png",
          langSelect: "img/flag/china.png",
          langName: "简体中文",
          label: "ch",
          enable: false,
        },
        {
          langImg: "img/flag/bulgaria.png",
          langSelect: "img/flag/bulgaria.png",
          langName: "български",
          label: "bg",
          enable: true,
        },
        {
          langImg: "img/flag/mongolia.png",
          langSelect: "img/flag/mongolia.png",
          langName: "монгол хэл",
          label: "mn",
          enable: true,
        },
        {
          langImg: "img/flag/sr.png",
          langSelect: "img/flag/sr.png",
          langName: "Српски",
          label: "sr",
          enable: true,
        },
      ],
    };
  },
  actions: {
    showDialog() {
      this.dialogIsVisible = true;
    },
    hideDialog() {
      this.dialogIsVisible = false;
    },
  },
});
