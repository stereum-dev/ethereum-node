import { defineStore } from "pinia";

export const useControlStore = defineStore("theControl", {
  state: () => {
    return {
      ServerName: null,
      ipAddress: null,
      totalRam: null,
      usedRam: null,
      totalDisk: null,
      availDisk: null,
      usedPerc: null,
      cpu: null,
      rx: null,
      tx: null,
      readValue: null,
      writeValue: null,
      code: null,
      syncstatus: [],
      p2pstatus: [],
      rpcstatus: null,
      beaconstatus: null,
      portstatus: [],
      storagestatus: [],
      consensusClientsData: [
        {
          name: "lighthouse",
          img: "/img/icon/plugin-icons/consensus/LightHouse.png",
        },
        {
          name: "lodestar",
          img: "/img/icon/plugin-icons/consensus/Lodestar.png",
        },
        {
          name: "nimbus",
          img: "/img/icon/plugin-icons/consensus/Nimbus.png",
        },
        {
          name: "prysm",
          img: "/img/icon/plugin-icons/consensus/Prysm.png",
        },
        {
          name: "teku",
          img: "/img/icon/plugin-icons/consensus/Teku.png",
        },
      ],
      executionClientsData: [
        {
          name: "erigon",
          img: "/img/icon/plugin-icons/execution/Erigon.png",
        },
        {
          name: "geth",
          img: "/img/icon/plugin-icons/execution/Geth.png",
        },
        {
          name: "besu",
          img: "/img/icon/plugin-icons/execution/hyperLedger-besu.png",
        },
        {
          name: "nethermind",
          img: "/img/icon/plugin-icons/execution/Nethermind.png",
        },
        {
          name: "openethereum",
          img: "/img/icon/plugin-icons/execution/OpenEthereum.png",
        },
      ],
    };
  },
  actions: {},
});
