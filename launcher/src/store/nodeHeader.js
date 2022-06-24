import { defineStore } from "pinia";
export const useNodeHeader = defineStore("nodeHeader", {
  state: () => {
    return {
      runningServices: [],
      operators: [
        { operatorName: "stereum" },
        { operatorName: "Rocklogic GmbH" },
      ],
    };
  },
  getters: {},
  actions: {},
});
