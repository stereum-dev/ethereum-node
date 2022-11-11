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
      storagestatus: [],
    };
  },
  actions: {},
});
