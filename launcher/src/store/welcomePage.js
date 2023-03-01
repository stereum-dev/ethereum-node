import { defineStore } from "pinia";
export const useWelcomeStore = defineStore("welcomePage", {
  state: () => {
    return {
      installation: [
        {
          img: "/img/icon/welcome-page/oneclick-install.png",
          imgHover: "/img/icon/welcome-page/oneclick-install-hover.png",
          imgDisabled: "/img/icon/welcome-page/oneclick-install-disabled.png",
          path: "/selectPlugin",
          display: true,
        },
        {
          img: "/img/icon/welcome-page/custom-install.png",
          imgHover: "img/icon/welcome-page/custom-install-hover.png",
          imgDisabled: "img/icon/welcome-page/custom-install-disabled.png",
          path: "/custom",
          display: true,
        },
        {
          img: "/img/icon/welcome-page/config-import.png",
          imgHover: "/img/icon/welcome-page/config-import-hover.png",
          imgDisabled: "/img/icon/welcome-page/config-import-disabled.png",
          path: "/upload",
          display: true,
        },
      ],
    };
  },
  getters: {},
  actions: {},
});
