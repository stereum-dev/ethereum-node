import { defineStore } from "pinia";

export const useNodeStore = defineStore("theNode", {
  state: () => {
    return {
      infoAlarm: true,
      serviceLogs: [],
      consensusItems: [],
      executionItems: [],
      validatorItems: [],
      servicePlugins: [],
      sidebarPlugins: [
        {
          id: 1,
          source: require("../../public/img/icon/manage-node-icons/filter-confirm.png"),
          drag: true,
          category: "execution",
          active: false,
        },
        {
          id: 2,
          source: require("../../public/img/icon/manage-node-icons/plugin-item-icon.png"),
          drag: true,
          category: "consensus",
          active: false,
        },
        {
          id: 3,
          source: require("../../public/img/icon/manage-node-icons/plugin-item-icon.png"),
          drag: true,
          category: "service",
          active: false,
        },
        {
          id: 4,
          source: require("../../public/img/icon/manage-node-icons/plugin-item-icon.png"),
          drag: true,
          category: "validator",
          active: false,
        },
        {
          id: 5,
          source: require("../../public/img/icon/manage-node-icons/plugin-item-icon.png"),
          drag: true,
          category: "validator",
          active: false,
        },
        {
          id: 6,
          source: require("../../public/img/icon/manage-node-icons/plugin-item-icon.png"),
          drag: true,
          category: "service",
          active: false,
        },
        {
          id: 7,
          source: require("../../public/img/icon/manage-node-icons/plugin-item-icon.png"),
          drag: true,
          category: "consensus",
          active: false,
        },
        {
          id: 8,
          source: require("../../public/img/icon/manage-node-icons/plugin-item-icon.png"),
          drag: true,
          category: "execution",
          active: false,
        },
        {
          id: 9,
          source: require("../../public/img/icon/manage-node-icons/plugin-item-icon.png"),
          drag: true,
          category: "service",
          active: false,
        },
        {
          id: 10,
          source: require("../../public/img/icon/manage-node-icons/plugin-item-icon.png"),
          drag: true,
          category: "consensus",
          active: false,
        },
      ],
      newUpdates: [
        {
          id: 1,
          name: "[NAME]",
          version: "[VERSION]",
        },
        {
          id: 2,
          name: "[NAME]",
          version: "[VERSION]",
        },
        {
          id: 3,
          name: "[NAME]",
          version: "[VERSION]",
        },
        {
          id: 4,
          name: "[NAME]",
          version: "[VERSION]",
        },
        {
          id: 5,
          name: "[NAME]",
          version: "[VERSION]",
        },
      ],
      statusContents: [
        {
          id: 1,
          status: "red",
        },
        {
          id: 2,
          status: "yellow",
        },
        {
          id: 3,
          status: "red",
        },
        {
          id: 4,
          status: "yellow",
        },
        {
          id: 3,
          status: "red",
        },
        {
          id: 4,
          status: "yellow",
        },
      ],

      ssvNetworkUrl: {
        operatorUrl: "https://www.google.com/",
        grafanaDashboardUrl: "https://www.google.com",
      },
    };
  },
  getters: {},
  actions: {},
});
