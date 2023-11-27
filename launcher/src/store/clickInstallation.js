import { defineStore } from "pinia";

export const useClickInstall = defineStore("clickInstallation", {
  state: () => {
    return {
      isConfigButtonEnbabled: false,
      installMonitoring: false,
      relayURL: "",
      checkPointSync: "",
      currentSlide: 0,
      btnActive: false,
      selectedItem: "- SELECT A SOURCE -",
      selectedLinks: null,
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
          img2: "/img/icon/click-installation/click-installer.png",
          path: "/selectPlugin",
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
      presets: [
        {
          id: 0,
          name: "staking",
          defaultPath: "/opt/stereum",
          icon: "/img/icon/click-installation/staking-icon.png",
          serviceAvailable: true,
          includedPlugins: [],
        },
        {
          id: 1,
          name: "mev boost",
          defaultPath: "/opt/stereum",
          icon: "/img/icon/presets-icons/mev-staking.png",
          showDropDown: false,
          includedPlugins: [],
        },
        {
          id: 2,
          name: "ssv.network",
          defaultPath: "/opt/stereum",
          icon: "/img/icon/click-installation/ssv-network.png",
          includedPlugins: [],
        },
        {
          id: 3,
          name: "obol",
          defaultPath: "/opt/stereum",
          icon: "/img/icon/click-installation/OBOL_SSV.png",
          includedPlugins: [],
        },
        {
          id: 4,
          name: "stereum on arm",
          defaultPath: "/opt/stereum",
          icon: "/img/icon/click-installation/STEREUM_on_ARM.png",
          includedPlugins: [],
        },

        {
          id: 5,
          name: "archive",
          defaultPath: "/opt/stereum",
          icon: "/img/icon/click-installation/archive.png",
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
          icon: "/img/icon/service-icons/attestant.png",
          url: "https://mainnet-checkpoint-sync.attestant.io/",
        },
        {
          id: 2,
          name: "Lodestar",
          icon: "/img/icon/service-icons/lodestar.png",
          url: "https://beaconstate-mainnet.chainsafe.io/",
        },
        {
          id: 3,
          name: "EthStaker",
          icon: "/img/icon/service-icons/ethstaker.png",
          url: "https://beaconstate.ethstaker.cc/",
        },
        {
          id: 4,
          name: "beaconcha.in",
          icon: "/img/icon/service-icons/beaconchain.png",
          url: "https://sync-mainnet.beaconcha.in/",
        },
        {
          id: 5,
          name: "Sigma Prime",
          icon: "/img/icon/service-icons/sigmaprime.png",
          url: "https://mainnet.checkpoint.sigp.io/",
        },
        {
          id: 6,
          name: "PietjePuk",
          icon: "/img/icon/service-icons/pietjepuk.png",
          url: "https://checkpointz.pietjepuk.net/",
        },
        {
          id: 7,
          name: "invis.tools",
          icon: "/img/icon/service-icons/invis-tools.png",
          url: "https://sync.invis.tools/",
        },
        {
          id: 8,
          name: "stakely.io",
          icon: "/img/icon/service-icons/stakely-io.png",
          url: "https://mainnet-checkpoint-sync.stakely.io/",
        },
        {
          id: 9,
          name: "BeaconState.info",
          icon: "",
          url: "https://beaconstate.info/",
        },
      ],
      georli: [
        {
          id: 1,
          name: "Sigma Prime",
          icon: "/img/icon/service-icons/sigmaprime.png",
          url: "https://prater.checkpoint.sigp.io/",
        },
        {
          id: 2,
          name: "invis.tools",
          icon: "/img/icon/service-icons/invis-tools.png",
          url: "https://goerli-sync.invis.tools/",
        },
        {
          id: 3,
          name: "Checkpoint",
          icon: "/img/icon/service-icons/checkpoint.png",
          url: "https://checkpoint-sync.goerli.ethpandaops.io/",
        },
        {
          id: 4,
          name: "beaconcha.in",
          icon: "/img/icon/service-icons/beaconchain.png",
          url: "https://sync-goerli.beaconcha.in/",
        },
        {
          id: 5,
          name: "stakely.io",
          icon: "/img/icon/service-icons/stakely-io.png",
          url: "https://prater-checkpoint-sync.stakely.io/",
        },
        {
          id: 6,
          name: "EthStaker",
          icon: "/img/icon/service-icons/ethstaker.png",
          url: "https://goerli.beaconstate.ethstaker.cc/",
        },
        {
          id: 7,
          name: "Lodestar",
          icon: "/img/icon/service-icons/lodestar.png",
          url: "https://beaconstate-goerli.chainsafe.io/",
        },
        {
          id: 8,
          name: "BeaconState.info",
          icon: "",
          url: "https://goerli.beaconstate.info/",
        },
      ],
      sepolia: [
        {
          id: 1,
          name: "Lodestar",
          icon: "/img/icon/service-icons/lodestar.png",
          url: "https://beaconstate-sepolia.chainsafe.io/",
        },
        {
          id: 2,
          name: "Checkpoint",
          icon: "/img/icon/service-icons/checkpoint.png",
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
          icon: "/img/icon/click-installation/gnosis_mainnet_icon.png",
          url: "https://checkpoint.gnosischain.com/",
        },
      ],
      holesky: [
        {
          id: 1,
          name: "Lodestar",
          icon: "/img/icon/service-icons/lodestar.png",
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
          icon: "/img/icon/service-icons/ethstaker.png",
          url: "https://holesky.beaconstate.ethstaker.cc",
        },
        {
          id: 4,
          name: "EF DevOps",
          icon: "/img/icon/service-icons/ef-devops.png",
          url: "https://checkpoint-sync.holesky.ethpandaops.io",
        },
        {
          id: 4,
          name: "Flashbots",
          icon: "/img/icon/click-installation/flashbot-icon.png",
          url: "https://boost-relay-holesky.flashbots.net/",
        },
      ],
    };
  },
  actions: {},
});
