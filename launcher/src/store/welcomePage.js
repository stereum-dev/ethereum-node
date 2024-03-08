import { defineStore } from "pinia";
export const useWelcomeStore = defineStore("welcomePage", {
  state: () => {
    return {
      installationOptions: [
        {
          img: "/img/icon/welcome-page-icons/oneclick-install.png",
          imgHover: "/img/icon/welcome-page-icons/oneclick-install-hover.png",
          imgDisabled: "/img/icon/welcome-page-icons/oneclick-install-disabled.png",
          path: "/oneClick/preset",
          display: true,
        },
        {
          img: "/img/icon/welcome-page-icons/custom-install.png",
          imgHover: "img/icon/welcome-page-icons/custom-install-hover.png",
          imgDisabled: "img/icon/welcome-page-icons/custom-install-disabled.png",
          path: "/custom/path",
          display: true,
        },
        {
          img: "/img/icon/welcome-page-icons/config-import.png",
          imgHover: "/img/icon/welcome-page-icons/config-import-hover.png",
          imgDisabled: "/img/icon/welcome-page-icons/config-import-disabled.png",
          path: "/config/upload",
          display: true,
        },
      ],
    };
  },
  getters: {},
  actions: {},
});
