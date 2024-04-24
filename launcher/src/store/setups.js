import { defineStore } from "pinia";

export const useSetups = defineStore("setups", {
  state: () => ({
    allSetups: [],
    editSetups: [],

    //Setup Node Page
    isServerViewActive: false,
    isConfigViewActive: false,
    isRenameSetupActive: false,
    selectedSetup: null,

    //Setup Edit Page
    setupToRename: null,
    isEditConfigViewActive: false,

    //Setup Others
    serverServices: ["PrometheusService", "GrafanaService", "PrometheusNodeExporterService", "NotificationService"],

    colorMappings: {
      // default: { text: "text-gray-100", background: "bg-[#336666]" },
      default: { text: "text-gray-800", background: "bg-[#FF9800]" },
      blue: { text: "text-gray-100", background: "bg-blue-900" },
      red: { text: "text-gray-800", background: "bg-red-300" },
      yellow: { text: "text-gray-800", background: "bg-[#F7C566]" },
      orange: { text: "text-gray-800", background: "bg-[#FF9800]" },
      green: { text: "text-gray-100", background: "bg-lime-900" },
      beige: { text: "text-gray-800", background: "bg-[#D1BB9E]" },
      purple: { text: "text-gray-100", background: "bg-violet-900" },
      brown: { text: "text-gray-100", background: "bg-[#503C3C]" },
      gray: { text: "text-white", background: "bg-zinc-700" },
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
      return state.colorMappings[color]?.background || "bg-[#336666]";
    },
    getTextColor: (state) => (color) => {
      return state.colorMappings[color]?.text || "text-gray-100";
    },
  },
  actions: {
    selectEditServerView() {
      this.editSetups.forEach((s) => (s.isActive = false));
      this.selectedSetup = null;
      this.isEditConfigViewActive = false;
    },

    selectEditConfigView(setup) {
      this.editSetups.forEach((s) => (s.isActive = false));
      setup.isActive = true;
      this.selectedSetup = setup;
      this.isEditConfigViewActive = true;
    },

    selectNodeServerView() {
      this.allSetups.forEach((s) => (s.isActive = false));
      this.isConfigViewActive = false;
      this.selectedSetup = null;
    },

    selectNodeConfigView(setup) {
      this.allSetups.forEach((s) => (s.isActive = false));
      setup.isActive = true;
      this.selectedSetup = setup;
      this.isConfigViewActive = true;
    },
  },
});
