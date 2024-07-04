import { defineStore } from "pinia";

export const useSetups = defineStore("setups", {
  state: () => ({
    serverSetups: [],
    allSetups: [],
    editSetups: [],
    stakingSetups: [],

    //Setup Node Page
    isConfigViewActive: false,
    isRenameSetupActive: false,
    selectedSetup: {},

    //Setup Edit Page
    setupToRename: null,
    isEditConfigViewActive: false,
    selectedSetupInfos: null,

    //Create Setup
    selectedSetupNetwork: null,
    isCreateSetupModalActive: false,

    //Remove Setup
    isRemoveSetupActive: false,
    selectedSetupToRemove: [],

    //Import Setup YAML
    isImportAnimeActive: false,
    setupDataToImport: [],

    //Setup Others
    serverServices: ["PrometheusService", "GrafanaService", "PrometheusNodeExporterService", "NotificationService"],

    colorMappings: {
      default: { text: "text-gray-100", background: "bg-[#336666]" },
      blue: { text: "text-gray-100", background: "bg-blue-900" }, //#172554
      red: { text: "text-gray-800", background: "bg-red-300" }, //#fca5a5
      yellow: { text: "text-gray-800", background: "bg-[#F7C566]" },
      orange: { text: "text-gray-800", background: "bg-[#fb923c]" },
      green: { text: "text-gray-100", background: "bg-lime-900" }, //#365314
      beige: { text: "text-gray-800", background: "bg-[#D1BB9E]" },
      purple: { text: "text-gray-100", background: "bg-violet-900" }, //#4c1d95
      brown: { text: "text-gray-100", background: "bg-[#503C3C]" },
      gray: { text: "text-white", background: "bg-zinc-700" }, //#3f3f46
    },
  }),
  getters: {
    //Setup layouts
    getColor: (state) => (colorName, type) => {
      const mapping = state.colorMappings[colorName] || {};
      return mapping[type] || (type === "text" ? "text-white" : "white");
    },

    //Setup Dropwdown
    getBGColor: (state) => (color) => {
      return state.colorMappings[color]?.background || "bg-[#33393E]";
    },
    getTextColor: (state) => (color) => {
      return state.colorMappings[color]?.text || "text-gray-300";
    },
  },
  actions: {
    updateSelectedSetup() {
      const updatedSetup = this.editSetups.find((setup) => setup?.isActive === true);
      if (updatedSetup) {
        this.selectedSetup = updatedSetup;
      }
    },
  },
});
