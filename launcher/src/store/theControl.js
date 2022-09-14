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
      valPeer: null,
      code: null,
      syncstatus: [],
    };
  },
  actions: {},
});
