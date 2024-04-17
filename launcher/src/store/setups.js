import { defineStore } from "pinia";

export const useSetups = defineStore("setups", {
  state: () => ({
    /* Start Setup Configs */
    allSetups: [],
    isServerViewActive: false,
    isConfigViewActive: false,
    isRenameSetupActive: false,
    /* End Setup Configs */
    selectedSetup: null,
    setupToRename: null,
    serverServices: ["PrometheusService", "GrafanaService", "PrometheusNodeExporterService", "NotificationService"],

    colorMappings: {
      default: { text: "text-gray-100", background: "bg-[#336666]" },
      blue: { text: "text-[#074173]", background: "bg-[#1d4ed8]" },
      red: { text: "text-[#C51605]", background: "bg-[#C51605]" },
      yellow: { text: "text-[#F7C566]", background: "bg-[#F7C566]" },
      orange: { text: "text-[#FF9800]", background: "bg-[#FF9800]" },
      green: { text: "text-[#436850]", background: "bg-[#436850]" },
      beige: { text: "text-[#D1BB9E]", background: "bg-[#D1BB9E]" },
      purple: { text: "text-[#8E7AB5]", background: "bg-[#8E7AB5]" },
      brown: { text: "text-[#503C3C]", background: "bg-[#503C3C]" },
      gray: { text: "text-[#5E5E5E]", background: "bg-[#5E5E5E]" },
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
      return state.colorMappings[color]?.background || "white";
    },
    getTextColor: (state) => (color) => {
      return state.colorMappings[color]?.text || "text-white";
    },
  },
  actions: {},
});
