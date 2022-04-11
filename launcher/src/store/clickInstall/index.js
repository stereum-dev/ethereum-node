import clickInstallActions from "./actions.js";
import clickInstallGetters from "./getters.js";
import clickInstallMutations from "./mutations.js";

export default {
  state() {
    return {
      selectedNetworks: "",
      selectedPlugin: [],
      testnetPlugins: [],
      mainnetPlugins: [],
      plugins: [
        {
          id: 1,
          name: "blox ssv",
          category: "execution",
          network: "testnet",
          networkIcon: require("../../../public/img/icon/click-installation/testnet-icon.png"),
          path: "/opt/stereumnode",
          icon: require("../../../public/img/icon/click-installation/BLOX_SSV.png"),
          requirements: {
            core: 4,
            memory: 64,
          },
        },
        {
          id: 2,
          name: "obol ssv",
          category: "execution",
          network: "mainnet",
          networkIcon: require("../../../public/img/icon/click-installation/mainnet-icon.png"),
          path: "/opt/stereumnode",
          icon: require("../../../public/img/icon/click-installation/OBOL_SSV.png"),
          requirements: {
            core: 4,
            memory: 64,
          },
        },
        {
          id: 3,
          name: "rocketpool",
          category: "execution",
          network: "testnet",
          networkIcon: require("../../../public/img/icon/click-installation/testnet-icon.png"),
          path: "/opt/stereumnode",
          icon: require("../../../public/img/icon/click-installation/rocketpool.png"),
          requirements: {
            core: 8,
            memory: 128,
          },
        },
        {
          id: 4,
          name: "obol ssv",
          category: "validator",
          network: "testnet",
          networkIcon: require("../../../public/img/icon/click-installation/mainnet-icon.png"),
          path: "/opt/stereumnode",
          icon: require("../../../public/img/icon/click-installation/OBOL_SSV.png"),
          requirements: {
            core: 4,
            memory: 64,
          },
        },
        {
          id: 5,
          name: "blox ssv",
          category: "execution",
          network: "mainnet",
          networkIcon: require("../../../public/img/icon/click-installation/testnet-icon.png"),
          path: "/opt/stereumnode",
          icon: require("../../../public/img/icon/click-installation/BLOX_SSV.png"),
          requirements: {
            core: 2,
            memory: 32,
          },
        },
        {
          id: 6,
          name: "rocketpool",
          category: "execution",
          network: "mainnet",
          networkIcon: require("../../../public/img/icon/click-installation/mainnet-icon.png"),
          path: "/opt/stereumnode",
          icon: require("../../../public/img/icon/click-installation/rocketpool.png"),
          requirements: {
            core: 8,
            memory: 64,
          },
        },
        {
          id: 7,
          name: "staking",
          category: "execution",
          networkIcon: require("../../../public/img/icon/click-installation/testnet-icon.png"),
          network: "testnet",
          path: "/opt/stereumnode",
          icon: require("../../../public/img/icon/click-installation/staking-icon.png"),
          requirements: {
            core: 8,
            memory: 64,
          },
        },
        {
          id: 8,
          name: "staking",
          category: "execution",
          network: "mainnet",
          networkIcon: require("../../../public/img/icon/click-installation/mainnet-icon.png"),
          path: "/opt/stereumnode",
          icon: require("../../../public/img/icon/click-installation/staking-icon.png"),
          requirements: {
            core: 8,
            memory: 64,
          },
        },
      ],
      systemInfos: {
        name: "Macbook",
        cpu: 4,
        memory: 128,
      },
    };
  },
  mutations: clickInstallMutations,
  actions: clickInstallActions,
  getters: clickInstallGetters,
};
