import { defineStore } from "pinia";

export const useControlStore = defineStore("theControl", {
  state: () => {
    return {
      ServerName: "Server",
      ipAddress: "127.0.0.1",
      totalRam: null,
      usedRam: null,
      availDisk: null,
      usedDisk: null,
      usedPerc: null,
      cpu: null,
      rx: null,
      tx: null,
    };
  },
  actions: {

  },
});
