import { defineStore } from "pinia";

export const useClickInstall = defineStore("clickInstallation", {
  state: () => {
    return {
      selectedNetworks: "",
      installationPath: "/opt/stereum",
      selectedPreset: [],
      testnetPlugins: [],
      mainnetPlugins: [],
      installation: [
        {
          img: "/img/icon/one-click-installer.png",
          img2: "/img/icon/click-installation/click-installer.png",
          path: "/clickinstall",
        },
        {
          img: "/img/icon/custom_installer.png",
          img2: "img/icon/click-installation/custom-nstallation.png",
          path: "/manage",
        },
        {
          img: "/img/icon/IMPORT_CONFIGURATIONS.png",
          img2: "/img/icon/click-installation/import.png",
          path: "/",
        },
      ],
      R1clkInstls: [
        { clkId: "staking", img: "/img/icon/STAKING.png" },
        { clkId: "testnet", img: "/img/icon/TESTNET.png" },
        { clkId: "blox", img: "/img/icon/BLOX_SSV.png" },
        { clkId: "obol", img: "/img/icon/OBOL_SSV.png" },
        { clkId: "rocket", img: "/img/icon/ROCKETPOOL_1.png" },
      ],
      plugins: [
        {
          id: 1001,
          name: "GETH",
          category: "execution",
          path: "/geth",
          icon: require("../..//public/img/icon/plugin-icons/execution/Geth.png"),
          sIcon: require("../../public/img/icon/plugin-icons/execution/Geth-s.png"),
          showDropDown: false,
          status: "success",
          subTasks: [
            {
              label: "Creating Server ...",
              status: "success",
            },
            {
              label: "Preparing node ...",
              status: "success",
            },
            {
              label: "Checking configuration path ...",
              status: "success",
            },
            {
              label: "Writing the configuration ...",
              status: "success",
            },
            {
              label: "Running docker container ...",
              status: "success",
            },
          ],
        },
        {
          id: 1009,
          name: "HYPERLEDGER BESU",
          category: "execution",
          path: "/hyperledger",
          icon: require("../../public/img/icon/plugin-icons/execution/hyperLedger-besu.png"),
          SIcon: require("../../public/img/icon/plugin-icons/execution/HyperLedger-besu-s.png"),
          showDropDown: false,
          status: "success",
          subTasks: [
            {
              label: "Creating Server ...",
              status: "success",
            },
          ],
        },
        {
          id: 1008,
          name: "ERIGON",
          category: "execution",
          path: "/erigon",
          icon: require("../../public/img/icon/plugin-icons/execution/Erigon.png"),
          sIcon: require("../../public/img/icon/plugin-icons/execution/Erigon-s.png"),
          status: "success",
          showDropDown: false,
          subTasks: [
            {
              label: "Creating Server ...",
              status: "success",
            },
          ],
        },
        {
          id: 1010,
          name: "NETHERMIND",
          category: "execution",
          path: "/nethermind",
          icon: require("../../public/img/icon/plugin-icons/execution/Nethermind.png"),
          sIcon: require("../../public/img/icon/plugin-icons/execution/Nethermind-s.png"),
          status: "success",
          showDropDown: false,
          subTasks: [
            {
              label: "Creating Server ...",
              status: "success",
            },
          ],
        },
        {
          id: 1011,
          name: "OPEN ETHEREUM",
          category: "execution",
          path: "/open-ethereum",
          icon: require("../../public/img/icon/plugin-icons/execution/OpenEthereum.png"),
          sIcon: require("../../public/img/icon/plugin-icons/execution/Open-ethereum-s.png"),
          status: "success",
          showDropDown: false,
          subTasks: [
            {
              label: "Creating Server ...",
              status: "success",
            },
          ],
        },
        {
          id: 1002,
          name: "GRAFANA",
          category: "service",
          path: "/grafana",
          icon: require("../../public/img/icon/plugin-icons/Other/grafana-service.png"),
          sIcon: require("../../public/img/icon/plugin-icons/Other/Grafana-s.png"),
          status: "success",
          showDropDown: false,
          subTasks: [
            {
              label: "Creating Server ...",
              status: "success",
            },
          ],
        },
        {
          id: 1003,
          name: "LIGHTHOUSE",
          category: "consensus",
          path: "/lighthouse",
          icon: require("../../public/img/icon/plugin-icons/consensus/LightHouse.png"),
          sIcon: require("../../public/img/icon/plugin-icons/consensus/Lighthouse-s.png"),
          status: "success",
          showDropDown: false,
          subTasks: [
            {
              label: "Creating Server ...",
              status: "success",
            },
          ],
        },
        {
          id: 1004,
          name: "LODESTAR",
          category: "consensus",
          path: "/lodestar",
          icon: require("../../public/img/icon/plugin-icons/consensus/Lodestar.png"),
          sIcon: require("../../public/img/icon/plugin-icons/consensus/Lodestar-s.png"),
          status: "success",
          showDropDown: false,
          subTasks: [
            {
              label: "Creating Server ...",
              status: "success",
            },
          ],
        },
        {
          id: 1005,
          name: "NIMBUS",
          category: "consensus",
          path: "/nimbus",
          icon: require("../../public/img/icon/plugin-icons/consensus/Nimbus.png"),
          sIcon: require("../../public/img/icon/plugin-icons/consensus/Nimbus-s.png"),
          status: "success",
          showDropDown: false,
          subTasks: [
            {
              label: "Creating Server ...",
              status: "success",
            },
          ],
        },
        {
          id: 1006,
          name: "TEKU",
          category: "consensus",
          path: "/teku",
          icon: require("../../public/img/icon/plugin-icons/consensus/Teku.png"),
          sIcon: require("../../public/img/icon/plugin-icons/consensus/Teku-s.png"),
          status: "success",
          showDropDown: false,
          subTasks: [
            {
              label: "Creating Server ...",
              status: "success",
            },
          ],
        },
        {
          id: 1007,
          name: "PRYSM",
          category: "consensus",
          path: "/prysm",
          icon: require("../../public/img/icon/plugin-icons/consensus/Prysm.png"),
          sIcon: require("../../public/img/icon/plugin-icons/consensus/Prysm-s.png"),
          status: "success",
          showDropDown: false,
          subTasks: [
            {
              label: "Creating Server ...",
              status: "success",
            },
          ],
        },
        {
          id: 1012,
          name: "LIGHTHOUSE",
          category: "validator",
          path: "/lighthouse",
          icon: require("../../public/img/icon/plugin-icons/validator/lighthouse-validator.png"),
          sIcon: require("../../public/img/icon/plugin-icons/validator/Lighthouse-s.png"),
          status: "success",
          showDropDown: false,
          subTasks: [
            {
              label: "Creating Server ...",
              status: "success",
            },
          ],
        },
        {
          id: 1013,
          name: "LOSESTAR",
          category: "validator",
          path: "/lodestar",
          icon: require("../../public/img/icon/plugin-icons/validator/lodestar-validator.png"),
          sIcon: require("../../public/img/icon/plugin-icons/validator/Lodestar-s.png"),
          status: "success",
          showDropDown: false,
          subTasks: [
            {
              label: "Creating Server ...",
              status: "success",
            },
          ],
        },
        {
          id: 1014,
          name: "PRYSM",
          category: "validator",
          path: "/prysm",
          icon: require("../../public/img/icon/plugin-icons/validator/prysm-validator.png"),
          sIcon: require("../../public/img/icon/plugin-icons/validator/Prysm-s.png"),
          status: "success",
          showDropDown: false,
          subTasks: [
            {
              label: "Creating Server ...",
              status: "success",
            },
          ],
        },
        {
          id: 1015,
          name: "NIMBUS",
          category: "validator",
          path: "/nimbus",
          icon: require("../../public/img/icon/plugin-icons/validator/nimbus-validator.png"),
          sIcon: require("../../public/img/icon/plugin-icons/validator/Nimbus-s.png"),
          status: "success",
          showDropDown: false,
          subTasks: [
            {
              label: "Creating Server ...",
              status: "success",
            },
            {
              label: "Preparing node ...",
              status: "success",
            },
            {
              label: "Checking configuration path ...",
              status: "success",
            },
            {
              label: "Writing the configuration ...",
              status: "success",
            },
            {
              label: "Running docker container ...",
              status: "success",
            },
          ],
        },
        {
          id: 1016,
          name: "TEKU",
          category: "validator",
          path: "/teku",
          icon: require("../../public/img/icon/plugin-icons/validator/teku-validator.png"),
          sIcon: require("../../public/img/icon/plugin-icons/validator/Teku-s.png"),
          showDropDown: false,
          subTasks: [
            {
              label: "Creating Server ...",
              status: "success",
            },
          ],
        },
        {
          id: 1017,
          name: "BLOX SSV",
          category: "service",
          path: "/blox-ssv",
          icon: require("../../public/img/icon/plugin-icons/Other/blox-ssv.png"),
          sIcon: require("../../public/img/icon/plugin-icons/Other/Blox-ssv-s.png"),
          showDropDown: false,
          subTasks: [
            {
              label: "Creating Server ...",
              status: "success",
            },
          ],
        },
        {
          id: 1018,
          name: "EY NIGHTFALL",
          category: "service",
          path: "/ey-nightfall",
          icon: require("../../public/img/icon/plugin-icons/Other/ey-nightfall.png"),
          sIcon: require("../../public/img/icon/plugin-icons/Other/EY-nightfall-s.png"),
          showDropDown: false,
          subTasks: [
            {
              label: "Creating Server ...",
              status: "success",
            },
          ],
        },
        {
          id: 1019,
          name: "OBOL SSV",
          category: "service",
          path: "/obol-ssv",
          icon: require("../../public/img/icon/plugin-icons/Other/obol-ssv.png"),
          sIcon: require("../../public/img/icon/plugin-icons/Other/Obol-ssv-s.png"),
          showDropDown: false,
          subTasks: [
            {
              label: "Creating Server ...",
              status: "success",
            },
          ],
        },
        {
          id: 1020,
          name: "PROMETHEUS",
          category: "service",
          path: "/prometheus",
          icon: require("../../public/img/icon/plugin-icons/Other/prometheus.png"),
          sIcon: require("../../public/img/icon/plugin-icons/Other/Prometheus-s.png"),
          showDropDown: false,
          subTasks: [
            {
              label: "Creating Server ...",
              status: "success",
            },
          ],
        },
        {
          id: 1021,
          name: "ROCKETPOOL",
          category: "service",
          path: "/rocketpool",
          icon: require("../../public/img/icon/plugin-icons/Other/rocketpool.png"),
          sIcon: require("../../public/img/icon/plugin-icons/Other/Rocketpool-s.png"),
          subTasks: [
            {
              label: "Creating Server ...",
              status: "success",
            },
          ],
        },
      ],
      presets: [
        {
          id: 1,
          name: "blox ssv",
          category: "execution",
          network: "testnet",
          networkIcon: require("../../public/img/icon/click-installation/testnet-icon.png"),
          defaultPath: "/opt/stereum",
          icon: require("../../public/img/icon/click-installation/BLOX_SSV.png"),
          requirements: {
            core: 4,
            memory: 64,
          },
          includedPlugins: [],
        },
        {
          id: 2,
          name: "obol ssv",
          category: "execution",
          network: "mainnet",
          networkIcon: require("../../public/img/icon/click-installation/mainnet-icon.png"),
          defaultPath: "/opt/stereum",
          icon: require("../../public/img/icon/click-installation/OBOL_SSV.png"),
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
          networkIcon: require("../../public/img/icon/click-installation/testnet-icon.png"),
          defaultPath: "/opt/stereum",
          icon: require("../../public/img/icon/click-installation/rocketpool.png"),
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
          networkIcon: require("../../public/img/icon/click-installation/mainnet-icon.png"),
          defaultPath: "/opt/stereum",
          icon: require("../../public/img/icon/click-installation/OBOL_SSV.png"),
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
          networkIcon: require("../../public/img/icon/click-installation/testnet-icon.png"),
          defaultPath: "/opt/stereum",
          icon: require("../../public/img/icon/click-installation/BLOX_SSV.png"),
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
          networkIcon: require("../../public/img/icon/click-installation/mainnet-icon.png"),
          defaultPath: "/opt/stereum",
          icon: require("../../public/img/icon/click-installation/rocketpool.png"),
          requirements: {
            core: 8,
            memory: 64,
          },
        },
        {
          id: 7,
          name: "staking",
          category: "execution",
          networkIcon: require("../../public/img/icon/click-installation/testnet-icon.png"),
          network: "testnet",
          defaultPath: "/opt/stereum",
          icon: require("../../public/img/icon/click-installation/staking-icon.png"),
          showDropDown: false,
          requirements: {
            core: 8,
            memory: 64,
          },
          includedPlugins: [],
        },
        {
          id: 8,
          name: "staking",
          network: "mainnet",
          defaultPath: "/opt/stereum",
          networkIcon: require("../../public/img/icon/click-installation/mainnet-icon.png"),
          icon: require("../../public/img/icon/click-installation/staking-icon.png"),
          requirements: {
            core: 8,
            memory: 64,
          },
          showDropDown: false,
          includedPlugins: [],
        },
      ],
      services: [
        {
          serviceName: "grafana",
          icon: "/img/icon/service-icons/grafana.png",
          linkUrl: "https://stereum.net",
        },
        {
          serviceName: "prometheus",
          icon: "/img/icon/service-icons/prometheus.png",
          linkUrl: "https://stereum.net",
        },
        {
          serviceName: "ssv",
          icon: "/img/icon/service-icons/ssv.png",
          linkUrl: "https://stereum.net",
        },
      ],
      runningServices: [],
     
    };
  },
  actions: {
    updatePresets() {
      this.selectedPreset = item;
    },
  },
});
