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

      //Menu Modals begin
      displayUpdatePanel: false,
      logoutModalIsActive: false,
      reconnectModalIsActive: false,
      supportModalIsActive: false,
      notificationModalIsActive: false,
      isStakeGuideActive: false,
      isTutorialActive: false,
      //Menu Modals end
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
          this.displayUpdatePanel = false;
          break;
        default:
          console.error(`No modal associated with the service name: ${serviceName}`);
      }
    },
    setMenuModal(name) {
      switch (name) {
        case "Available Update":
          this.displayUpdatePanel = true;
          break;
        case "Logout":
          this.logoutModalIsActive = true;
          break;
        case "Reconnect":
          this.reconnectModalIsActive = true;
          break;
        case "Help":
          this.supportModalIsActive = true;
          break;
        case "Notifications":
          this.notificationModalIsActive = true;
          break;
        case "StakeGuide":
          this.isStakeGuideActive = true;
          break;
        case "Tutorial":
          this.isTutorialActive = true;
          break;
        case null:
          this.displayUpdatePanel = false;
          this.logoutModalIsActive = false;
          this.reconnectModalIsActive = false;
          this.supportModalIsActive = false;
          this.notificationModalIsActive = false;
          this.isStakeGuideActive = false;
          this.isTutorialActive = false;
          break;
        default:
          console.error("No modal");
      }
    },
  },
});
