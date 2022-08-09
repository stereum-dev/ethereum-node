import { defineStore } from "pinia";
export const useNodeHeader = defineStore("nodeHeader", {
  state: () => {
    return {
      runningServices: [],
      refresh: true,
      forceUpdateCheck: false,
      isUpdateAvailable: false,
      operators: [
        { operatorName: "stereum" },
        { operatorName: "Rocklogic GmbH" },
      ],
    };
  },
  getters: {},
  actions: {},
});
