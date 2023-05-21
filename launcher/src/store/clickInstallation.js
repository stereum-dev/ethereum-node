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
          name: "obol ssv",
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
      configNetwork: {},
      mainnet: [
        "https://mainnet-checkpoint-sync.attestant.io/",
        "https://beaconstate-mainnet.chainsafe.io/",
        "https://beaconstate.ethstaker.cc/",
        "https://sync-mainnet.beaconcha.in/",
        "https://mainnet.checkpoint.sigp.io/",
        "https://beaconstate.info/",
        "https://checkpointz.pietjepuk.net/",
        "https://sync.invis.tools/",
        "https://mainnet-checkpoint-sync.stakely.io/",
      ],
      georli: [
        "https://prater.checkpoint.sigp.io/",
        "https://goerli-sync.invis.tools/",
        "https://checkpoint-sync.goerli.ethpandaops.io/",
        "https://goerli.beaconstate.info/",
        "https://sync-goerli.beaconcha.in/",
        "https://prater-checkpoint-sync.stakely.io/",
        "https://goerli.beaconstate.ethstaker.cc/",
        "https://beaconstate-goerli.chainsafe.io/",
      ],
      gnosis: ["https://checkpoint.gnosischain.com/"],
      sepolia: [
        "https://sepolia.beaconstate.info/",
        "https://beaconstate-sepolia.chainsafe.io/",
        "https://checkpoint-sync.sepolia.ethpandaops.io/",
      ],
    };
  },
  actions: {},
});
