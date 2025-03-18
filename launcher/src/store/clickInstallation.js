import { defineStore } from "pinia";

export const useClickInstall = defineStore("clickInstallation", {
  state: () => {
    return {
      isPathValid: true,
      startServicesAfterInstall: false,
      isConfigButtonEnbabled: false,
      installMonitoring: false,
      resetMevBoost: false,
      relayURL: "",
      checkPointSync: "",
      currentSlide: 0,
      btnActive: false,
      selectedItem: "- SELECT A SOURCE -",
      selectedLink: null,
      selectedIcon: null,
      syncType: [
        {
          id: 1,
          name: "checkpoint sync",
          type: "recommended",
          displayCategory: "Sync your client",
          display: true,
        },
        {
          id: 2,
          name: "checkpoint sync",
          type: "custom source",
          displayCategory: "Sync from a custom source",
          display: true,
        },
        {
          id: 3,
          name: "genesis",
          type: "Syncs from genesis",
          displayCategory: "Syncs from genesis",
          display: false,
        },
      ],
      selectedNetwork: {},
      installationPath: "/opt/stereum",
      selectedPreset: null,
      installation: [
        {
          img: "/img/icon/one-click-installer.png",
          img2: "/img/icon/welcome-page-icons/oneclick-install.png",
          path: "/selectPlugin",
        },
        {
          img: "/img/icon/custom_installer.png",
          img2: "img/icon/welcome-page-icons/custom-install.png",
          path: "/manage",
        },
        {
          img: "/img/icon/IMPORT_CONFIGURATIONS.png",
          img2: "/img/icon/welcome-page-icons/config-import.png",
          path: "/",
        },
      ],
      presets: [
        {
          id: 0,
          name: "staking",
          defaultPath: "/opt/stereum",
          icon: "/img/icon/one-click-icons/preset-icons/staking-preset.png",
          serviceAvailable: true,
          includedPlugins: [],
        },
        {
          id: 1,
          name: "mev boost",
          defaultPath: "/opt/stereum",
          icon: "/img/icon/one-click-icons/preset-icons/mev-staking-preset.png",
          showDropDown: false,
          includedPlugins: [],
        },
        {
          id: 2,
          name: "ssv.network",
          defaultPath: "/opt/stereum",
          icon: "/img/icon/one-click-icons/preset-icons/ssv-network-preset.png",
          includedPlugins: [],
        },
        {
          id: 3,
          name: "obol",
          defaultPath: "/opt/stereum",
          icon: "/img/icon/one-click-icons/preset-icons/obol-charon-preset.png",
          includedPlugins: [],
        },
        {
          id: 4,
          name: "stereum on arm",
          defaultPath: "/opt/stereum",
          icon: "/img/icon/one-click-icons/preset-icons/stereum-on-arm-preset.png",
          includedPlugins: [],
        },

        {
          id: 5,
          name: "archive",
          defaultPath: "/opt/stereum",
          icon: "/img/icon/one-click-icons/preset-icons/archive-preset.png",
          includedPlugins: [],
        },
        {
          id: 6,
          name: "lidoobol",
          defaultPath: "/opt/stereum",
          icon: "/img/icon/one-click-icons/preset-icons/OBOL-LIDO-SDVT.png",
          includedPlugins: [],
        },
        {
          id: 7,
          name: "lidossv",
          defaultPath: "/opt/stereum",
          icon: "/img/icon/one-click-icons/preset-icons/SSV-LIDO-SDVT.png",
          includedPlugins: [],
        },
        {
          id: 7,
          name: "lidocsm",
          defaultPath: "/opt/stereum",
          icon: "/img/icon/one-click-icons/preset-icons/LIDO-CSM.png",
          includedPlugins: [],
        },
      ],
      services: [
        {
          serviceName: "grafana",
          icon: "/img/icon/service-icons/Other/Grafana-s.png",
          linkUrl: "https://stereum.net",
        },
        {
          serviceName: "prometheus",
          icon: "/img/icon/service-icons/Other/Prometheus-s.png",
          linkUrl: "https://stereum.net",
        },
        {
          serviceName: "ssv",
          icon: "/img/icon/service-icons/Other/ssv-network-s.png",
          linkUrl: "https://stereum.net",
        },
      ],
      filteredPluginsToChange: [],

      customAnimations: [
        { id: 1, src: "/animation/custom-start.gif", alt: "Animation", display: false },
        { id: 2, src: "/animation/custom-loop.gif", alt: "Animation", display: false },
      ],
      unzippedData: [],
      configServices: [],
      removedServices: [],
      configNetwork: {},
      mainnet: [
        {
          id: 1,
          name: "Attestant",
          icon: "/img/icon/checkpoint-sync-icons/attestant-checkpoint-icon.png",
          url: "https://mainnet-checkpoint-sync.attestant.io/",
        },
        {
          id: 2,
          name: "Lodestar",
          icon: "/img/icon/checkpoint-sync-icons/lodestar-checkpoint-icon.png",
          url: "https://beaconstate-mainnet.chainsafe.io/",
        },
        {
          id: 3,
          name: "EthStaker",
          icon: "/img/icon/checkpoint-sync-icons/ethstaker-checkpoint-icon.png",
          url: "https://beaconstate.ethstaker.cc/",
        },
        {
          id: 4,
          name: "beaconcha.in",
          icon: "/img/icon/checkpoint-sync-icons/beaconchain-checkpoint-icon.png",
          url: "https://sync-mainnet.beaconcha.in/",
        },
        {
          id: 5,
          name: "Sigma Prime",
          icon: "/img/icon/checkpoint-sync-icons/sigmaprime-checkpoint-icon.png",
          url: "https://mainnet.checkpoint.sigp.io/",
        },
        {
          id: 6,
          name: "PietjePuk",
          icon: "/img/icon/checkpoint-sync-icons/pietjepuk-checkpoint-icon.png",
          url: "https://checkpointz.pietjepuk.net/",
        },
        {
          id: 7,
          name: "invis.tools",
          icon: "/img/icon/checkpoint-sync-icons/invis-tools-checkpoint-icon.png",
          url: "https://sync.invis.tools/",
        },
        {
          id: 8,
          name: "stakely.io",
          icon: "/img/icon/checkpoint-sync-icons/stakely-io-checkpoint-icon.png",
          url: "https://mainnet-checkpoint-sync.stakely.io/",
        },
        {
          id: 9,
          name: "BeaconState.info",
          icon: "",
          url: "https://beaconstate.info/",
        },
      ],
      sepolia: [
        {
          id: 1,
          name: "Lodestar",
          icon: "/img/icon/checkpoint-sync-icons/lodestar-checkpoint-icon.png",
          url: "https://beaconstate-sepolia.chainsafe.io/",
        },
        {
          id: 2,
          name: "Checkpoint",
          icon: "/img/icon/checkpoint-sync-icons/checkpointz-checkpoint-icon.png",
          url: "https://checkpoint-sync.sepolia.ethpandaops.io/",
        },
        {
          id: 3,
          name: "BeaconState.info",
          icon: "",
          url: "https://sepolia.beaconstate.info/",
        },
      ],
      gnosis: [
        {
          id: 2,
          name: "Gnosis",
          icon: "/img/icon/network-icons/gnosis-mainnet.png",
          url: "https://checkpoint.gnosischain.com/",
        },
      ],
      holesky: [
        {
          id: 1,
          name: "Lodestar",
          icon: "/img/icon/checkpoint-sync-icons/lodestar-checkpoint-icon.png",
          url: "https://beaconstate-holesky.chainsafe.io",
        },
        {
          id: 2,
          name: "BeaconState.info",
          icon: "",
          url: "https://holesky.beaconstate.info",
        },
        {
          id: 3,
          name: "EthStaker",
          icon: "/img/icon/checkpoint-sync-icons/ethstaker-checkpoint-icon.png",
          url: "https://holesky.beaconstate.ethstaker.cc",
        },
        {
          id: 4,
          name: "EF DevOps",
          icon: "/img/icon/checkpoint-sync-icons/ef-devops-checkpoint-icon.png",
          url: "https://checkpoint-sync.holesky.ethpandaops.io",
        },
      ],
      hoodi: [], // TBA - Hoodi
    };
  },
  actions: {},
});
