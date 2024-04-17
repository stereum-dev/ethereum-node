import { defineStore } from "pinia";

export const useSetups = defineStore("setups", {
  state: () => ({
    allSetups: [],
    isServerViewActive: false,
    isConfigViewActive: false,
    isRenameSetupActive: false,
    selectedSetup: null,
    setupToRename: null,
    serverServices: ["PrometheusService", "GrafanaService", "PrometheusNodeExporterService", "NotificationService"],

    colorMappings: {
      default: { text: "text-gray-100", background: "bg-[#336666]" },
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
      return state.colorMappings[color]?.background;
    },
    getTextColor: (state) => (color) => {
      return state.colorMappings[color]?.text;
    },
  },
  actions: {},
});
