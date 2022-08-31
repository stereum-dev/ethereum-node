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
          enable: true,
        },
        {
          langImg: "img/flag/germany.png",
          langSelect: "img/flag/germany.png",
          langName: "deutsch",
          enable: false,
        },
        {
          langImg: "img/flag/france.png",
          langSelect: "img/flag/france.png",
          langName: "français",
          enable: false,
        },
        {
          langImg: "img/flag/spain.png",
          langSelect: "img/flag/spain.png",
          langName: "ESPAÑOL",
          enable: false,
        },
        {
          langImg: "img/flag/iran.png",
          langSelect: "img/flag/iran.png",
          langName: "فارسی",
          enable: false,
        },
        {
          langImg: "img/flag/saudi-arabia.png",
          langSelect: "img/flag/saudi-arabia.png",
          langName: "العربية",
          enable: false,
        },
        {
          langImg: "img/flag/turkey.png",
          langSelect: "img/flag/turkey.png",
          langName: "Türkçe",
          enable: false,
        },
        {
          langImg: "img/flag/netherlands.png",
          langSelect: "img/flag/netherlands.png",
          langName: "dutch",
          enable: false,
        },
        {
          langImg: "img/flag/portugal.png",
          langSelect: "img/flag/portugal.png",
          langName: "Português",
          enable: false,
        },
        {
          langImg: "img/flag/japan.png",
          langSelect: "img/flag/japan.png",
          langName: "日本語",
          enable: false,
        },
        {
          langImg: "img/flag/italy.png",
          langSelect: "img/flag/italy.png",
          langName: "Italiano",
          enable: false,
        },
        {
          langImg: "img/flag/russia.png",
          langSelect: "img/flag/russia.png",
          langName: "Pусский",
          enable: false,
        },
        {
          langImg: "img/flag/china.png",
          langSelect: "img/flag/china.png",
          langName: "简体中文",
          enable: false,
        },
        {
          langImg: "img/flag/bulgaria.png",
          langSelect: "img/flag/bulgaria.png",
          langName: "български",
          enable: false,
        },
        {
          langImg: "img/flag/mongolia.png",
          langSelect: "img/flag/mongolia.png",
          langName: "монгол хэл",
          enable: false,
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
