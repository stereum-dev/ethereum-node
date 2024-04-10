import { defineStore } from "pinia";

export const useConfigs = defineStore("multiConfigs", {
  state: () => {
    return {
      //Configs
      configs: [],
      selectedConfig: null,
    };
  },

  actions: {},
});
