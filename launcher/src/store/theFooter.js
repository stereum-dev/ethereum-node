import { defineStore } from "pinia";

export const useFooter = defineStore("theFooter", {
  state: () => {
    return {
      cursorLocation: "",
      stereumStatus: true,
      isConsensusRunning: false,
      dialog: false,
      epochType: "",
      epoch: null,
      slot: null,
      status: "",
      title: "",
      first: "",
      second: "",
      installedServicesController: "",
      missingServices: false,
      prometheusIsOff: false,
      nodataMessage: "",
      volState: false,
    };
  },
  getters: {},
  actions: {},
});
