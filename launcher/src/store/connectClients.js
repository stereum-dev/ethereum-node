import { defineStore } from "pinia";

export const useConnectClients = defineStore("connectClients", {
  state: () => {
    return {
      isConnectedToMevboost: false,
      mevboostOptions: [],
      selectedToConnectToMevboost: null,
    };
  },
  actions: {},
});
