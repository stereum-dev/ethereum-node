import { defineStore } from "pinia";

export const useStakingStore = defineStore("theStaking", {
  state: () => {
    return {
      stats: {},
      selectedValidatorService: {},
      totalBalance: 0,
      keys: [],
      forceRefresh: false,
      storedValidatorKeys: [],
      insertKeyBoxActive: true,
      enterPasswordBox: false,
      exitChainForMultiValidatorsActive: false,
      removeForMultiValidatorsActive: false,
      grafitiForMultiValidatorsActive: false,
      display: true,
      isDragOver: false,
      keyFiles: [],
      selectedService: {},
      dragStep: false,
      clickService: false,
      modalGuide: false,
      passPointer: false,
      keyCounter: 0,
    };
  },
  actions: {},
});
