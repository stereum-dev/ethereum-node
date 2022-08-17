import { defineStore } from "pinia";
export const useWelcomeStore = defineStore("welcomePage", {
  state: () => {
    return {
      installation: [
        {
          img: "/img/icon/one-click-installer.png",
          img2: "/img/icon/click-installation/click-installer.png",
          img3: "/img/icon/click-installation/click-installer.png",
          path: "/selectPlugin",
          display: true,
        },
        {
          img: "/img/icon/custom_installer.png",
          img2: "img/icon/click-installation/custom-nstallation.png",
          img3: "/img/icon/custom_installer2.png",
          path: "/manage",
          display: false,
        },
        {
          img: "/img/icon/IMPORT_CONFIGURATIONS.png",
          img2: "/img/icon/click-installation/import.png",
          img3: "/img/icon/IMPORT_CONFIGURATIONS2.png",
          path: "/",
          display: false,
        },
      ],
    };
  },
  getters: {},
  actions: {},
});
