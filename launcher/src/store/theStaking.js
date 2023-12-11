import { defineStore } from "pinia";

export const useStakingStore = defineStore("theStaking", {
  state: () => {
    return {
      currentEpoch: 0,
      currentSlot: 0,
      secondsPerSlot: null,
      slotsPerEpoch: null,
      // ***** Staking List
      selectedServiceToFilter: null,
      filteredKeys: null,
      searchedKeys: [],
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
      filteredGroups: [],
      selectedGroup: null,
      selectedValidatorKeys: [],
      // ***** End Staking Groups *****

      // ***** Staking Remote Keys *****
      isRemoteListActive: false,
      previewRemoteKeys: [], // Remote Keys List to display
      selectedRemoteKeys: [], // Selected Remote Keys to Add
      remoteKeys: [], // Remote Keys List
      remoteUrl: "",

      // ***** End Staking Remote Keys *****

      // ***** Validator Keys *****
      isPubkeyVisible: false,
      removeKeys: [], // keys to remove
      selectedKeyToRemove: null,
      selectKeyToRename: null,
      selectKeyForFee: null,
      validatorDisplayName: "",
      eneterdFeeRecipientAddress: "",
      feeRecepientAddress: "",
      // ***** End Validator Keys *****
      selectedSingleKeyToWithdraw: null,
      withdrawAndExitResponse: null,
      withdrawIsChecked: false,

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
