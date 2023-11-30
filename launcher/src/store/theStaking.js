import { defineStore } from "pinia";

export const useStakingStore = defineStore("theStaking", {
  state: () => {
    return {
      // ***** Staking List
      filteredKeys: [],
      activePanel: "insert",
      searchContent: "",
      isOverDropZone: false,
      inputWrongKey: false,
      isPreviewListActive: false,
      importEnteredPassword: null,
      importKeyMessage: "",
      checkActiveValidatorsResponse: [],
      previewKeys: [],
      //***** End Staking List

      // ***** Staking Modals *****
      activeModal: null,
      // ***** End Staking Modals *****

      // ***** Staking Groups *****
      mode: "create",
      groupName: null,
      currentGroup: null,
      isGroupListActive: false,
      isGroupingAllowed: false,
      validatorKeyGroups: [],
      selectedGroup: null,
      selectedValidatorKeys: [],
      // ***** End Staking Groups *****

      // ***** Validator Keys *****
      selectKeyToRename: null,
      validatorDisplayName: "",

      // ***** End Validator Keys *****

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
    setActiveModal(modalName) {
      this.activeModal = modalName;
    },
    setMode(mode) {
      this.mode = mode;
    },
    setValidatorName(newName) {
      this.validatorDisplayName = newName;
    },
  },
});
