import { defineStore } from "pinia";

export const useStakingStore = defineStore("theStaking", {
  state: () => {
    return {
      validatorBalances:  [],
      keys: [],
      forceRefresh: false,
      storedValidatorKeys: [],
    };
  },
  actions: {},
});
