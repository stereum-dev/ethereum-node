import { defineStore } from "pinia";

export const useConfigs = defineStore("multiConfigs", {
  state: () => {
    return {
      //Configs
      allSetups: [],
      selectedSetup: null,
    };
  },

  actions: {},
});
