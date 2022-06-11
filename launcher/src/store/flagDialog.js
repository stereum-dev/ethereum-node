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
        },
        {
          langImg: "img/flag/germany.png",
          langSelect: "img/flag/germany.png",
          langName: "german",
        },
        {
          langImg: "img/flag/france.png",
          langSelect: "img/flag/france.png",
          langName: "french",
        },
        {
          langImg: "img/flag/spain.png",
          langSelect: "img/flag/spain.png",
          langName: "spanish",
        },
        {
          langImg: "img/flag/iran.png",
          langSelect: "img/flag/iran.png",
          langName: "persian",
        },
        {
          langImg: "img/flag/saudi-arabia.png",
          langSelect: "img/flag/saudi-arabia.png",
          langName: "arabic",
        },
        {
          langImg: "img/flag/turkey.png",
          langSelect: "img/flag/turkey.png",
          langName: "turkish",
        },
        {
          langImg: "img/flag/netherlands.png",
          langSelect: "img/flag/netherlands.png",
          langName: "dutch",
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
