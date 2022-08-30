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
          langName: "german",
          enable: false,
        },
        {
          langImg: "img/flag/france.png",
          langSelect: "img/flag/france.png",
          langName: "french",
          enable: false,
        },
        {
          langImg: "img/flag/spain.png",
          langSelect: "img/flag/spain.png",
          langName: "spanish",
          enable: false,
        },
        {
          langImg: "img/flag/iran.png",
          langSelect: "img/flag/iran.png",
          langName: "persian",
          enable: false,
        },
        {
          langImg: "img/flag/saudi-arabia.png",
          langSelect: "img/flag/saudi-arabia.png",
          langName: "arabic",
          enable: false,
        },
        {
          langImg: "img/flag/turkey.png",
          langSelect: "img/flag/turkey.png",
          langName: "turkish",
          enable: false,
        },
        {
          langImg: "img/flag/netherlands.png",
          langSelect: "img/flag/netherlands.png",
          langName: "dutch",
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
