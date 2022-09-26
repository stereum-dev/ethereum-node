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
      actionContents: [
        {
          id: 1,
          content: "INSTALL",
          contentIcon: require("../../public/img/icon/manage-node-icons/plus.png"),
        },
        {
          id: 2,
          content: "DELETE",
          contentIcon: require("../../public/img/icon/manage-node-icons/minus.png"),
        },
        {
          id: 3,
          content: "ACTIVATE",
          contentIcon: require("../../public/img/icon/manage-node-icons/green-power-icon.png"),
        },
        {
          id: 4,
          content: "DEACTIVATE",
          contentIcon: require("../../public/img/icon/manage-node-icons/red-power-icon.png"),
        },
        {
          id: 5,
          content: "LINK WITH",
          contentIcon: require("../../public/img/icon/manage-node-icons/link-icon.png"),
        },
        {
          id: 6,
          content: "DELINK FROM",
          contentIcon: require("../../public/img/icon/manage-node-icons/delink-icon.png"),
        },
      ],
      confirmChanges: [],
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
      currentNetwork: {},
    };
  },
  getters: {},
  actions: {},
});
