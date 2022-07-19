import { defineStore } from "pinia";
export const useNodeHeader = defineStore("nodeHeader", {
  state: () => {
    return {
      runningServices: [],
      refresh: true,
      checkedForUpdates: false,
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
