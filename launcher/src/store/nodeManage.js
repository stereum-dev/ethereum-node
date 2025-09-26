import { defineStore } from "pinia";
export const useNodeManage = defineStore("nodeManage", {
  state: () => {
    return {
      //Installed services on edit page
      newConfiguration: [],
      // End of Installed services on edit page

      //  Beginning Custom Service
      customConfig: {
        image: "",
        entrypoint: "",
        command: "",
        paths: [],
        ports: [],
      },

      //End Custom Service

      // Beginning of Drawer Box
      isDrawerOpen: false,
      isDrawerMenuActive: false,
      isSetupsDrawerActive: false,
      isServicesDrawerActive: false,

      // End of Drawer Box

      //Import Setup Yaml File
      isImportSetupYamlActive: false,

      externalConsensusSelectedService: "",
      reloadEditBody: false,
      isLineHidden: false,
      lines: [],
      hideConnectingLines: false,
      addConfigButton: false,
      architecture: "",
      selectedServiceToResync: {},
      availableBlocks: [],
      checkedRelays: [],
      usedBlocks: [],
      relaysList: [
        {
          icon: "/img/icon/one-click-icons/mevboost-icons/flashbots.png",
          name: "FLASHBOTS",
          mainnet:
            "https://0xac6e77dfe25ecd6110b8e780608cce0dab71fdd5ebea22a16c0205200f2f8e2e3ad3b71d3499c54ad14d6c21b41a37ae@boost-relay.flashbots.net",
          sepolia:
            "https://0x845bd072b7cd566f02faeb0a4033ce9399e42839ced64e8b2adcfc859ed1e8e1a5a293336a49feac6d9a5edb779be53a@boost-relay-sepolia.flashbots.net",
          hoodi:
            "https://0xafa4c6985aa049fb79dd37010438cfebeb0f2bd42b115b89dd678dab0670c1de38da0c4e9138c9290a398ecd9a0b3110@boost-relay-hoodi.flashbots.net",
          id: 1,
          isSelected: false,
          isRemoved: false,
          freeCensorship: false,
        },
        {
          icon: "/img/icon/one-click-icons/mevboost-icons/bloxroute.png",
          name: "BloXroute MAX PROFIT",
          mainnet:
            "https://0x8b5d2e73e2a3a55c6c87b8b6eb92e0149a125c852751db1422fa951e42a09b82c142c3ea98d0d9930b056a3bc9896b8f@bloxroute.max-profit.blxrbdn.com",
          id: 2,
          isSelected: false,
          isRemoved: false,
          freeCensorship: true,
        },
        {
          icon: "/img/icon/one-click-icons/mevboost-icons/bloxroute.png",
          name: "BloXroute REGULATED",
          mainnet:
            "https://0xb0b07cd0abef743db4260b0ed50619cf6ad4d82064cb4fbec9d3ec530f7c5e6793d9f286c4e082c0244ffb9f2658fe88@bloxroute.regulated.blxrbdn.com",
          id: 4,
          isSelected: false,
          isRemoved: false,
          freeCensorship: false,
        },
        {
          icon: "/img/icon/one-click-icons/mevboost-icons/manifold.png",
          name: "Manifold",
          mainnet:
            "https://0x98650451ba02064f7b000f5768cf0cf4d4e492317d82871bdc87ef841a0743f69f0f1eea11168503240ac35d101c9135@mainnet-relay.securerpc.com",
          id: 6,
          isSelected: false,
          isRemoved: false,
          freeCensorship: true,
        },
        {
          icon: "/img/icon/one-click-icons/mevboost-icons/ultra-sound-relay.png",
          name: "Ultra sound money",
          mainnet:
            "https://0xa1559ace749633b997cb3fdacffb890aeebdb0f5a3b6aaa7eeeaf1a38af0a8fe88b9e4b1f61f236d2e64d95733327a62@relay.ultrasound.money",
          holesky:
            "https://0xb1559beef7b5ba3127485bbbb090362d9f497ba64e177ee2c8e7db74746306efad687f2cf8574e38d70067d40ef136dc@relay-stag.ultrasound.money",
          hoodi:
            "https://0xb1559beef7b5ba3127485bbbb090362d9f497ba64e177ee2c8e7db74746306efad687f2cf8574e38d70067d40ef136dc@relay-hoodi.ultrasound.money",
          id: 7,
          isSelected: false,
          isRemoved: false,
          freeCensorship: true,
        },
        {
          icon: "/img/icon/one-click-icons/mevboost-icons/aestus.png",
          name: "Aestus",
          mainnet: "https://0xa15b52576bcbf1072f4a011c0f99f9fb6c66f3e1ff321f11f461d15e31b1cb359caa092c71bbded0bae5b5ea401aab7e@aestus.live",
          hoodi:
            "https://0x98f0ef62f00780cf8eb06701a7d22725b9437d4768bb19b363e882ae87129945ec206ec2dc16933f31d983f8225772b6@hoodi.aestus.live",
          id: 8,
          isSelected: false,
          isRemoved: false,
          freeCensorship: true,
        },
        {
          icon: "/img/icon/one-click-icons/mevboost-icons/agnostic.png",
          name: "Agnostic",
          mainnet:
            "https://0xa7ab7a996c8584251c8f925da3170bdfd6ebc75d50f5ddc4050a6fdc77f2a3b5fce2cc750d0865e05d7228af97d69561@agnostic-relay.net",
          id: 9,
          isSelected: false,
          isRemoved: false,
          freeCensorship: true,
        },
        {
          icon: "/img/icon/one-click-icons/mevboost-icons/flashbots.png",
          name: "Titan Relay",
          mainnet:
            "https://0x8c4ed5e24fe5c6ae21018437bde147693f68cda427cd1122cf20819c30eda7ed74f72dece09bb313f2a1855595ab677d@global.titanrelay.xyz",
          holesky:
            "https://0xaa58208899c6105603b74396734a6263cc7d947f444f396a90f7b7d3e65d102aec7e5e5291b27e08d02c50a050825c2f@holesky.titanrelay.xyz",
          hoodi:
            "https://0xaa58208899c6105603b74396734a6263cc7d947f444f396a90f7b7d3e65d102aec7e5e5291b27e08d02c50a050825c2f@hoodi.titanrelay.xyz",
          id: 10,
          isSelected: false,
          isRemoved: false,
          freeCensorship: true,
        },
        {
          icon: "/img/icon/one-click-icons/mevboost-icons/flashbots.png",
          name: "Titan Relay Filtered",
          mainnet:
            "https://0x8c4ed5e24fe5c6ae21018437bde147693f68cda427cd1122cf20819c30eda7ed74f72dece09bb313f2a1855595ab677d@regional.titanrelay.xyz",
          id: 11,
          isSelected: false,
          isRemoved: false,
          freeCensorship: false,
        },
        {
          icon: "/img/icon/one-click-icons/mevboost-icons/ultra-sound-relay.png",
          name: "Ultra Sound Money - Filtering",
          mainnet:
            "https://0xa1559ace749633b997cb3fdacffb890aeebdb0f5a3b6aaa7eeeaf1a38af0a8fe88b9e4b1f61f236d2e64d95733327a62@relay-filtered.ultrasound.money",
          hoodi:
            "https://0xb1559beef7b5ba3127485bbbb090362d9f497ba64e177ee2c8e7db74746306efad687f2cf8574e38d70067d40ef136dc@relay-filtered-hoodi.ultrasound.money",
          id: 12,
          isSelected: false,
          isRemoved: false,
          freeCensorship: false,
        },
      ],

      selectedItemToRemove: [],
      actionContents: [
        {
          id: 1,
          content: "INSTALL",
          contentIcon: require("../../public/img/icon/edit-node-icons/add-service.png"),
        },
        {
          id: 2,
          content: "DELETE",
          contentIcon: require("../../public/img/icon/edit-node-icons/remove-service.png"),
        },
        {
          id: 3,
          content: "MODIFY",
          contentIcon: require("../../public/img/icon/edit-node-icons/modify-service.png"),
        },
        {
          id: 5,
          content: "SWITCH CLIENT",
          contentIcon: require("../../public/img/icon/edit-node-icons/switch-client.png"),
        },
        {
          id: 6,
          content: "CHANGE NETWORK",
          contentIcon: require("../../public/img/icon/edit-node-icons/change-network.png"),
        },
      ],
      confirmChanges: [],
      disableConfirmButton: false,
      displayNetworkList: false,
      networkList: [
        {
          id: 1,
          name: "Ethereum Mainnet",
          network: "mainnet",
          icon: "/img/icon/network-icons/ethereum-mainnet.png",
          currencyIcon: "/img/icon/control-page-icons/mainnet-currency-symbol.png",
          dataEndpoint: "https://mainnet.beaconcha.in/api/v1",
          support: ["staking", "mev boost", "stereum on arm", "ssv.network", "obol", "archive", "lidoobol", "lidossv", "lidocsm"],
        },

        {
          id: 2,
          name: "Sepolia Testnet",
          network: "sepolia",
          icon: "/img/icon/network-icons/ethereum-testnet-icon.png",
          currencyIcon: "/img/icon/control-page-icons/network-currency-icons/network-currency-icons-goerli-testnet.png",
          dataEndpoint: "https://sepolia.beaconcha.in/api/v1",
          support: ["staking", "mev boost", "stereum on arm", "archive"],
        },
        {
          id: 3,
          name: "Gnosis Mainnet",
          network: "gnosis",
          icon: "/img/icon/network-icons/gnosis-mainnet.png",
          currencyIcon: "/img/icon/control-page-icons/network-currency-icons/network-currency-icons-gnosis-mainnet.png",
          dataEndpoint: "https://beacon.gnosischain.com/api/v1",
          support: ["staking", "stereum on arm", "archive"],
        },
        {
          id: 4,
          name: "Holesky Testnet",
          network: "holesky",
          icon: "/img/icon/network-icons/ethereum-testnet-icon.png",
          currencyIcon: "/img/icon/control-page-icons/network-currency-icons/network-currency-icons-goerli-testnet.png",
          dataEndpoint: "https://holesky.beaconcha.in/api/v1",
          support: ["staking", "ssv.network", "stereum on arm", "mev boost", "archive", "obol", "lidoobol", "lidossv", "lidocsm"],
        },
        {
          id: 5,

          name: "OP Sepolia",
          network: "op-sepolia",
          icon: "/img/icon/network-icons/op-sepolia.png",
          currencyIcon: "/img/icon/control-page-icons/network-currency-icons/network-currency-icons-goerli-testnet.png",
          dataEndpoint: "https://sepolia.beaconcha.in/api/v1",
          support: ["op full node", "op and eth full node"],
        },
        {
          id: 6,
          name: "OP Mainnet",
          network: "op-mainnet",
          icon: "/img/icon/network-icons/op-mainnet.png",
          currencyIcon: "/img/icon/control-page-icons/network-currency-icons/network-currency-icons-goerli-testnet.png",
          dataEndpoint: "https://sepolia.beaconcha.in/api/v1",
          support: ["op full node", "op and eth full node", "op node archive", "op and eth node archive"],
        },
        {
          id: 7,
          name: "Hoodi Testnet",
          network: "hoodi",
          icon: "/img/icon/network-icons/ethereum-testnet-icon.png",
          currencyIcon: "/img/icon/control-page-icons/network-currency-icons/network-currency-icons-goerli-testnet.png",
          dataEndpoint: "https://hoodi.beaconcha.in/api/v1",
          support: ["staking", "ssv.network", "stereum on arm", "mev boost", "archive", "obol", "lidoobol", "lidossv", "lidocsm"],
        },
      ],
      currentNetwork: {},
      selectedNetwork: null,
      configNetwork: {},
      catDefult: "select a category",
    };
  },
  getters: {},
  actions: {
    addRelay(relay) {
      this.checkedRelays.push(relay);
    },
    removeRelay(relay) {
      this.checkedRelays.splice(this.checkedRelays.indexOf(relay), 1);
    },
  },
});
