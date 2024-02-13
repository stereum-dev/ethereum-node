import { defineStore } from "pinia";
export const useNodeHeader = defineStore("nodeHeader", {
  state: () => {
    return {
      //Service Modals begin
      isServiceAvailable: true,
      showGrafanaWindow: false,
      showSsvWindow: false,
      showPrometheusWindow: false,
      showMevboostWindow: false,
      showObolCharonWindow: false,
      //Service Modals end

      //Update Panel begin
      displayUpdatePanel: false,
      //Update Panel end
      importBoxModel: "",
      passwordBoxModel: "",
      selectedValidatorFromNodeAlert: {},
      openModalFromNodeAlert: false,
      depositFile: false,
      enrIsGenerating: true,
      generatedENR: "",
      generatorPlugin: false,
      obolDashboard: false,
      continueForExistENR: false,
      notificationModalIsActive: false,
      serverAccessManagement: false,
      distrubutedValidatorGenerator: false,
      deactivateBtnToWaitForLogs: false,

      runningServices: [],
      refresh: true,
      stereumUpdate: {},
      searchingForUpdates: false,
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
      stakeCongrats: false,
      rpcState: false,
      dataState: false,
      wsState: false,
    };
  },
  getters: {},
  actions: {
    setServiceModal(serviceName) {
      switch (serviceName) {
        case "GrafanaService":
          this.showGrafanaWindow = true;
          break;
        case "SSVNetworkService":
          this.showSsvWindow = true;
          break;
        case "PrometheusService":
          this.showPrometheusWindow = true;
          break;
        case "FlashbotsMevBoostService":
          this.showMevboostWindow = true;
          break;
        case "CharonService":
          this.showObolCharonWindow = true;
          break;
        case null:
          this.showGrafanaWindow = false;
          this.showSsvWindow = false;
          this.showPrometheusWindow = false;
          this.showMevboostWindow = false;
          this.showObolCharonWindow = false;
          break;
        default:
          console.error(`No modal associated with the service name: ${serviceName}`);
      }
    },
    openUpdatePanel() {
      this.displayUpdatePanel = !this.displayUpdatePanel;
    },
  },
});
