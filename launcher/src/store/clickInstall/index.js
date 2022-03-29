import clickInstallActions from "./actions.js";
import clickInstallGetters from "./getters.js";
import clickInstallMutations from "./mutations.js";

export default {
  state() {
    return {
      plugins: [
        {
          name: "blox ssv",
          category: "execution",
          network: "testnet",
          path: "/opt/stereumnode",
          icon: require("../../../public/Img/icon/BLOX_SSV.png"),
          requirements: {
            core: 4,
            memory: 64,
          },
        },
        {
          name: "obol ssv",
          category: "execution",
          network: "mainnet",
          path: "/opt/stereumnode",
          icon: require("../../../public/Img/icon/OBOL_SSV.png"),
          requirements: {
            core: 4,
            memory: 64,
          },
        },
        {
          name: "rocketpool",
          category: "execution",
          network: "testnet",
          path: "/opt/stereumnode",
          icon: require("../../../public/Img/icon/ROCKETPOOL.png"),
          requirements: {
            core: 8,
            memory: 128,
          },
        },
        {
          name: "obol ssv",
          category: "validator",
          network: "testnet",
          path: "/opt/stereumnode",
          icon: require("../../../public/Img/icon/OBOL_SSV.png"),
          requirements: {
            core: 4,
            memory: 64,
          },
        },
        {
          name: "blox ssv",
          category: "execution",
          network: "mainnet",
          path: "/opt/stereumnode",
          icon: require("../../../public/Img/icon/BLOX_SSV.png"),
          requirements: {
            core: 2,
            memory: 32,
          },
        },
        {
          name: "rocketpool",
          category: "execution",
          network: "mainnet",
          path: "/opt/stereumnode",
          icon: require("../../../public/Img/icon/ROCKETPOOL.png"),
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
