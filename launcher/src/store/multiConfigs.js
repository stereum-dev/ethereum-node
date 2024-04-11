import { defineStore } from "pinia";

export const useConfigs = defineStore("multiConfigs", {
  state: () => {
    return {
      //Configs
      allConfigs: [],
      selectedConfig: null,
    };
  },

  actions: {},
});
