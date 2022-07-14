import { defineStore } from "pinia";
export const useNodeManage = defineStore("nodeManage", {
  state: () => {
    return {
      newConfiguration: [],
      selectedItemToRemove: {},
      clickPresets: [
        {
          id: 1,
          name: "blox-ssv",
          category: "execution",
          defaultPath: "/opt/stereum",
          icon: require("../../public/img/icon/click-installation/BLOX_SSV.png"),
        },
        {
          id: 2,
          name: "obol ssv",
          category: "execution",
          defaultPath: "/opt/stereum",
          icon: require("../../public/img/icon/click-installation/OBOL_SSV.png"),
        },
        {
          id: 3,
          name: "rocketpool",
          category: "execution",
          defaultPath: "/opt/stereum",
          icon: require("../../public/img/icon/click-installation/rocketpool.png"),
        },
        {
          id: 7,
          name: "staking",
          network: "testnet",
          defaultPath: "/opt/stereum",
          icon: require("../../public/img/icon/click-installation/staking-icon.png"),
        },
      ],
    };
  },
  getters: {},
  actions: {},
});
