import { defineStore } from "pinia";

export const useControlStore = defineStore("theControl", {
  state: () => {
    return {
      ServerName: "Server",
      ipAddress: "127.0.0.1",
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
    };
  },
  actions: {},
});
