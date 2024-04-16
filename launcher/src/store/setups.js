import { defineStore } from "pinia";

export const useSetups = defineStore("setups", {
  state: () => {
    return {
      /* Start Setup Configs */
      allSetups: [],

      isServerViewActive: true,
      isSetupViewActive: false,
      isConfigViewActive: false,

      /* End Setup Configs */
      selectedSetup: null,
    };
  },

  actions: {},
});
