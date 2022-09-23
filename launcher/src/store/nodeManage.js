import { defineStore } from "pinia";
export const useNodeManage = defineStore("nodeManage", {
  state: () => {
    return {
      newConfiguration: [],
      selectedItemToRemove: [],
      clickPresets: [
        {
          id: 1,
          name: "ssv.network",
          category: "execution",
          defaultPath: "/opt/stereum",
          icon: require("../../public/img/icon/click-installation/ssv-network.png"),
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
      actionContents: [],
      networkList: [
        {
          id: 1,
          name: "Mainnet",
          network: "mainnet",
          icon: "/img/icon/click-installation/mainnet-icon.png",
        },
        {
          id: 2,
          name: "Testnet",
          network: "testnet",
          icon: "/img/icon/click-installation/testnet-icon.png",
        },
      ],
      currentNetwork: {
        id: 1,
        name: "Mainnet",
        network: "mainnet",
        icon: "/img/icon/click-installation/mainnet-icon.png",
      },
    };
  },
  getters: {},
  actions: {},
});
