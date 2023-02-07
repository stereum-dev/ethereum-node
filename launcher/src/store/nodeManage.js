import { defineStore } from "pinia";
export const useNodeManage = defineStore("nodeManage", {
  state: () => {
    return {
      relaysList: [
        {
          icon: "/img/icon/click-installation/flashbot-icon.png",
          name: "FLASHBOTS",
          mainnet:
            "https://0xac6e77dfe25ecd6110b8e780608cce0dab71fdd5ebea22a16c0205200f2f8e2e3ad3b71d3499c54ad14d6c21b41a37ae@boost-relay.flashbots.net",
          testnet:
            "https://0xafa4c6985aa049fb79dd37010438cfebeb0f2bd42b115b89dd678dab0670c1de38da0c4e9138c9290a398ecd9a0b3110@boost-relay-goerli.flashbots.net",
          id: 1,
          isSelected: false,
          isRemoved: false,
          freeCensorship: false,
        },
        {
          icon: "/img/icon/click-installation/bloxRoute-icon.png",
          name: "BloXroute MAX PROFIT",
          mainnet:
            "https://0x8b5d2e73e2a3a55c6c87b8b6eb92e0149a125c852751db1422fa951e42a09b82c142c3ea98d0d9930b056a3bc9896b8f@bloxroute.max-profit.blxrbdn.com",
          testnet:
            "https://0x821f2a65afb70e7f2e820a925a9b4c80a159620582c1766b1b09729fec178b11ea22abb3a51f07b288be815a1a2ff516@bloxroute.max-profit.builder.goerli.blxrbdn.com",
          id: 2,
          isSelected: false,
          isRemoved: false,
          freeCensorship: true,
        },
        {
          icon: "/img/icon/click-installation/bloxRoute-icon.png",
          name: "BloXroute ETHICAL",
          mainnet:
            "https://0xad0a8bb54565c2211cee576363f3a347089d2f07cf72679d16911d740262694cadb62d7fd7483f27afd714ca0f1b9118@bloxroute.ethical.blxrbdn.com",
          id: 3,
          isSelected: false,
          isRemoved: false,
          freeCensorship: false,
        },
        {
          icon: "/img/icon/click-installation/bloxRoute-icon.png",
          name: "BloXroute REGULATED",
          mainnet:
            "https://0xb0b07cd0abef743db4260b0ed50619cf6ad4d82064cb4fbec9d3ec530f7c5e6793d9f286c4e082c0244ffb9f2658fe88@bloxroute.regulated.blxrbdn.com",
          id: 4,
          isSelected: false,
          isRemoved: false,
          freeCensorship: false,
        },
        {
          icon: "/img/icon/click-installation/blocknative.png",
          name: "BLOCKNATIVE",
          mainnet:
            "https://0x9000009807ed12c1f08bf4e81c6da3ba8e3fc3d953898ce0102433094e5f22f21102ec057841fcb81978ed1ea0fa8246@builder-relay-mainnet.blocknative.com",
          testnet:
            "https://0x8f7b17a74569b7a57e9bdafd2e159380759f5dc3ccbd4bf600414147e8c4e1dc6ebada83c0139ac15850eb6c975e82d0@builder-relay-goerli.blocknative.com",
          id: 5,
          isSelected: false,
          isRemoved: false,
          freeCensorship: false,
        },
        {
          icon: "/img/icon/click-installation/MANIFOLD.png",
          name: "MANIFOLD",
          mainnet:
            "https://0x98650451ba02064f7b000f5768cf0cf4d4e492317d82871bdc87ef841a0743f69f0f1eea11168503240ac35d101c9135@mainnet-relay.securerpc.com",
          testnet:
            "https://0x8a72a5ec3e2909fff931c8b42c9e0e6c6e660ac48a98016777fc63a73316b3ffb5c622495106277f8dbcc17a06e92ca3@goerli-relay.securerpc.com",
          id: 6,
          isSelected: false,
          isRemoved: false,
          freeCensorship: true,
        },
        {
          icon: "/img/icon/click-installation/UltraSoundRelay.png",
          name: "Ultra sound money",
          mainnet:
            "https://0xa1559ace749633b997cb3fdacffb890aeebdb0f5a3b6aaa7eeeaf1a38af0a8fe88b9e4b1f61f236d2e64d95733327a62@relay.ultrasound.money",
          testnet:
            "https://0xb1559beef7b5ba3127485bbbb090362d9f497ba64e177ee2c8e7db74746306efad687f2cf8574e38d70067d40ef136dc@relay-stag.ultrasound.money",
          id: 7,
          isSelected: false,
          isRemoved: false,
          freeCensorship: true,
        },
        {
          icon: "/img/icon/click-installation/AESTUS.png",
          name: "Aestus",
          mainnet:
            "https://0xa15b52576bcbf1072f4a011c0f99f9fb6c66f3e1ff321f11f461d15e31b1cb359caa092c71bbded0bae5b5ea401aab7e@aestus.live",
          testnet:
            "https://0xab78bf8c781c58078c3beb5710c57940874dd96aef2835e7742c866b4c7c0406754376c2c8285a36c630346aa5c5f833@goerli.aestus.live",
          id: 8,
          isSelected: false,
          isRemoved: false,
          freeCensorship: true,
        },
        {
          icon: "/img/icon/click-installation/Gnosis Agnostic.png",
          name: "Agnostic",
          mainnet:
            "https://0xa7ab7a996c8584251c8f925da3170bdfd6ebc75d50f5ddc4050a6fdc77f2a3b5fce2cc750d0865e05d7228af97d69561@agnostic-relay.net",
          testnet:
            "https://0xa6bcad37b5d647152a93c2807d8a56055f1e0d7480eb6505d46edc21593e400f0f13738bf2e892f85946234629a3036a@goerli.agnostic-relay.net",
          id: 9,
          isSelected: false,
          isRemoved: false,
          freeCensorship: true,
        },
        {
          icon: "/img/icon/click-installation/eden.png",
          name: "Eden",
          mainnet:
            "https://0xb3ee7afcf27f1f1259ac1787876318c6584ee353097a50ed84f51a1f21a323b3736f271a895c7ce918c038e4265918be@relay.edennetwork.io/",
          testnet:
            "https://0xb1d229d9c21298a87846c7022ebeef277dfc321fe674fa45312e20b5b6c400bfde9383f801848d7837ed5fc449083a12@relay-goerli.edennetwork.io/",
          id: 10,
          isSelected: false,
          isRemoved: false,
          freeCensorship: false,
        },
        {
          icon: "/img/icon/click-installation/Relayoor.png",
          name: "Relayooor's",
          mainnet:
            "https://0x84e78cb2ad883861c9eeeb7d1b22a8e02332637448f84144e245d20dff1eb97d7abdde96d4e7f80934e5554e11915c56@relayooor.wtf",
          id: 11,
          isSelected: false,
          isRemoved: false,
          freeCensorship: true,
        },
      ],
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
          contentIcon: require("../../public/img/icon/manage-node-icons/ADD_PLUGIN.png"),
        },
        {
          id: 2,
          content: "DELETE",
          contentIcon: require("../../public/img/icon/manage-node-icons/REMOVE_PLUGIN.png"),
        },
        {
          id: 3,
          content: "MODIFY",
          contentIcon: require("../../public/img/icon/manage-node-icons/manage-item-icon.png"),
        },
        {
          id: 5,
          content: "SWITCH CLIENT",
          contentIcon: require("../../public/img/icon/manage-node-icons/switch-client.png"),
        },
        {
          id: 6,
          content: "CHANGE NETWORK",
          contentIcon: require("../../public/img/icon/manage-node-icons/change-network.png"),
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
          name: "Ethereum Testnetwork",
          network: "testnet",
          icon: "/img/icon/click-installation/testnet-icon.png",
        },
        {
          id: 3,
          name: "Gnosis",
          network: "gnosis",
          icon: "/img/icon/click-installation/gnosis_mainnet_icon.png",
        },
      ],
      currentNetwork: {},
      configNetwork: {},
    };
  },
  getters: {},
  actions: {},
});
