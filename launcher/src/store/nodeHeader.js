import { defineStore } from "pinia";
export const useNodeHeader = defineStore("nodeHeader", {
  state: () => {
    return {
      runningServices: [],
      refresh: true,
      stereumUpdate: {},
      forceUpdateCheck: false,
      isUpdateAvailable: false,
      updating: false,
      searchingForOsUpdates: false,
      searchingForOsUpdatesManual: false,
      isOsUpdateAvailable: false,
      osUpdating: false,
      osVersionLatest: "-",
      operators: [{ operatorName: "stereum" }, { operatorName: "Rocklogic GmbH" }],
      tutorial: false,
      stakeGuide: false,
      rpcOne: true,
      rpcTwo: false,
      stakeFirstStep: true,
      stakeSecondStep: false,
      stakeThirdStep: false,
      slidePointer: false,
      activeRPC: false,
      nextStepFlag: 0,
      goForStake: false,
      stakeBtn: false,
      insertVal: false,
    };
  },
  getters: {},
  actions: {},
});
