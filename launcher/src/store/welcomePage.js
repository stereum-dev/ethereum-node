import { defineStore } from "pinia";
export const useWelcomeStore = defineStore("welcomePage", {
  state: () => {
    return {
      installationOptions: [
        {
          img: "/img/icon/welcome-page/oneclick-install.png",
          imgHover: "/img/icon/welcome-page/oneclick-install-hover.png",
          imgDisabled: "/img/icon/welcome-page/oneclick-install-disabled.png",
          path: "/oneClick/preset",
          display: true,
        },
        {
          img: "/img/icon/welcome-page/custom-install.png",
          imgHover: "img/icon/welcome-page/custom-install-hover.png",
          imgDisabled: "img/icon/welcome-page/custom-install-disabled.png",
          path: "/custom/path",
          display: true,
        },
        {
          img: "/img/icon/welcome-page/config-import.png",
          imgHover: "/img/icon/welcome-page/config-import-hover.png",
          imgDisabled: "/img/icon/welcome-page/config-import-disabled.png",
          path: "/config/upload",
          display: true,
        },
      ],
    };
  },
  getters: {},
  actions: {},
});
