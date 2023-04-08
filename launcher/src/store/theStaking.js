import { defineStore } from "pinia";

export const useStakingStore = defineStore("theStaking", {
  state: () => {
    return {
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
    };
  },
  actions: {},
});
