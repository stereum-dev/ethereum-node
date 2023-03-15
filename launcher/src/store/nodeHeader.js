import { defineStore } from "pinia";
export const useNodeHeader = defineStore("nodeHeader", {
  state: () => {
    return {
      runningServices: [],
      refresh: true,
      stereumUpdate: {},
      forceUpdateCheck: false,
      isUpdateAvailable: false,
      updating: false,
      operators: [{ operatorName: "stereum" }, { operatorName: "Rocklogic GmbH" }],
    };
  },
  getters: {},
  actions: {},
});
