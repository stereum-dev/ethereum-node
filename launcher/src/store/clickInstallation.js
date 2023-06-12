import { defineStore } from "pinia";

export const useClickInstall = defineStore("clickInstallation", {
  state: () => {
    return {
      relayURL: "",
      checkPointSync: "",
      currentSlide: 0,
      btnActive: false,
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
      selectedPreset: [],
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
          name: "rocketpool",
          defaultPath: "/opt/stereum",
          icon: "/img/icon/click-installation/rocketpool.png",
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
          icon: "/img/icon/click-installation/attestant.png",
          url: "https://mainnet-checkpoint-sync.attestant.io/",
        },
        {
          id: 2,
          name: "Lodestar",
          icon: "",
          url: "https://beaconstate-mainnet.chainsafe.io/",
        },
        {
          id: 3,
          name: "EthStaker",
          icon: "/img/icon/click-installation/ethstaker.png",
          url: "https://beaconstate.ethstaker.cc/",
        },
        {
          id: 4,
          name: "beaconcha.in",
          icon: "/img/icon/click-installation/beaconchain.png",
          url: "https://sync-mainnet.beaconcha.in/",
        },
        {
          id: 5,
          name: "Sigma Prime",
          icon: "",
          url: "https://mainnet.checkpoint.sigp.io/",
        },
        {
          id: 6,
          name: "PietjePuk",
          icon: "/img/icon/click-installation/pietjepuk.png",
          url: "https://checkpointz.pietjepuk.net/",
        },
        {
          id: 7,
          name: "invis.tools",
          icon: "/img/icon/click-installation/invis-tools.png",
          url: "https://sync.invis.tools/",
        },
        {
          id: 8,
          name: "stakely.io",
          icon: "/img/icon/click-installation/stakely-io.png",
          url: "https://mainnet-checkpoint-sync.stakely.io/",
        },

        // "https://beaconstate.info/",
      ],
      georli: [
        {
          id: 1,
          name: "Sigma Prime",
          icon: "",
          url: "https://prater.checkpoint.sigp.io/",
        },
        {
          id: 2,
          name: "invis.tools",
          icon: "/img/icon/click-installation/invis-tools.png",
          url: "https://goerli-sync.invis.tools/",
        },
        {
          id: 3,
          name: "Checkpoint",
          icon: "/img/icon/click-installation/checkpoint.png",
          url: "https://checkpoint-sync.goerli.ethpandaops.io/",
        },
        {
          id: 4,
          name: "beaconcha.in",
          icon: "/img/icon/click-installation/beaconchain.png",
          url: "https://sync-goerli.beaconcha.in/",
        },
        {
          id: 5,
          name: "stakely.io",
          icon: "/img/icon/click-installation/stakely-io.png",
          url: "https://prater-checkpoint-sync.stakely.io/",
        },
        {
          id: 6,
          name: "EthStaker",
          icon: "/img/icon/click-installation/ethstaker.png",
          url: "https://goerli.beaconstate.ethstaker.cc/",
        }, //
        {
          id: 7,
          name: "Lodestar",
          icon: "",
          url: "https://beaconstate-goerli.chainsafe.io/",
        },

        // "https://goerli.beaconstate.info/",
      ],
      sepolia: [
        {
          id: 1,
          name: "Lodestar",
          icon: "",
          url: "https://beaconstate-sepolia.chainsafe.io/",
        },
        {
          id: 2,
          name: "Checkpoint",
          icon: "/img/icon/click-installation/checkpoint.png",
          url: "https://checkpoint-sync.sepolia.ethpandaops.io/",
        },
        // "https://sepolia.beaconstate.info/",
      ],
      gnosis: [
        {
          id: 2,
          name: "Gnosis",
          icon: "",
          url: "https://checkpoint.gnosischain.com/",
        },
      ],
    };
  },
  actions: {},
});
