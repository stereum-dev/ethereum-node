import { defineStore } from "pinia";

export const useControlStore = defineStore("theControl", {
  state: () => {
    return {
      currentConsensusIcon: "",
      currentExecutionIcon: "",
      synchronizationError: false,
      synchronizationErrorControl: false,
      pageNumber: 1,
      consensusName: "",
      request: [],
      deleteKey: false,
      generateModalShow: false,
      currentSlotData: null,
      currentEpochData: null,
      currentResult: {},
      noDataFlag: false,
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
      wsstatus: null,
      beaconstatus: null,
      portstatus: [],
      storagestatus: [],
      balancestatus: null,
      consensusClientsData: [
        {
          name: "lighthouse",
          img: "/img/icon/service-icons/consensus/LightHouse.png",
        },
        {
          name: "lodestar",
          img: "/img/icon/service-icons/consensus/Lodestar.png",
        },
        {
          name: "nimbus",
          img: "/img/icon/service-icons/consensus/Nimbus.png",
        },
        {
          name: "prysm",
          img: "/img/icon/service-icons/consensus/Prysm.png",
        },
        {
          name: "teku",
          img: "/img/icon/service-icons/consensus/Teku.png",
        },
      ],
      executionClientsData: [
        {
          name: "erigon",
          img: "/img/icon/service-icons/execution/Erigon.png",
        },
        {
          name: "geth",
          img: "/img/icon/service-icons/execution/Geth.png",
        },
        {
          name: "reth",
          img: "/img/icon/service-icons/execution/Reth.png",
        },
        {
          name: "besu",
          img: "/img/icon/service-icons/execution/hyperLedger-besu.png",
        },
        {
          name: "nethermind",
          img: "/img/icon/service-icons/execution/Nethermind.png",
        },
        {
          name: "openethereum",
          img: "/img/icon/service-icons/execution/OpenEthereum.png",
        },
      ],
    };
  },
  actions: {},
});
