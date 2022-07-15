import { defineStore } from "pinia";
export const useNodeHeader = defineStore("nodeHeader", {
  state: () => {
    return {
      runningServices: [],
      refresh: true,
      operators: [
        { operatorName: "stereum" },
        { operatorName: "Rocklogic GmbH" },
      ],
    };
  },
  getters: {},
  actions: {},
});
