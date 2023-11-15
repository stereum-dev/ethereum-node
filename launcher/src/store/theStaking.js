import { defineStore } from "pinia";

export const useStakingStore = defineStore("theStaking", {
  state: () => {
    return {
      // ***** Staking List
      groupName: null,
      activePanel: "insert",
      searchContent: "",
      isInsertPanelActive: true,
      isValidatorPanelActive: false,
      isPasswordPanelActive: false,
      isSearchPanelActive: false,
      isGrafitiPanelActive: false,
      isGroupingPanelActive: false,
      //***** End Staking List

      exitMultiValidatorKeys: false,
      doppelgangerStatus: true,
      selectedIcon: "",
      importValidatorKeyActive: true,
      passwordInputActive: false,
      stats: {},
      selectedValidatorService: {},
      totalBalance: 0,
      keys: [],
      keyImages: [],
      forceRefresh: false,
      storedValidatorKeys: [],
      insertKeyBoxActive: true,
      enterPasswordBox: false,
      importRemoteKeysActive: false,
      exitChainForMultiValidatorsActive: false,
      removeForMultiValidatorsActive: false,
      grafitiForMultiValidatorsActive: false,
      display: true,
      isDragOver: false,
      keyFiles: [],
      dragStep: false,
      clickService: false,
      modalGuide: false,
      passPointer: false,
      keyCounter: 0,
    };
  },
  actions: {
    setActivePanel(panelName) {
      this.activePanel = panelName;
    },
  },
});
