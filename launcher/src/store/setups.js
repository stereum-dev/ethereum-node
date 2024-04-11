import { defineStore } from "pinia";

export const useSetups = defineStore("setups", {
  state: () => {
    return {
      //Configs
      allSetups: [],
      isServerViewActive: false,
      selectedSetup: null,
    };
  },

  actions: {},
});
