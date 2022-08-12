import { defineStore } from "pinia";
export const useNodeStore = defineStore("theNode", {
  state: () => {
    return {
      consensusItems: [],
      executionItems: [],
      validatorItems: [],
      servicePlugins: [],
      selectedItemToRemove: [],
      confirmChanges: [
        {
          id: 1,
          content: "INSTALL",
          contentIcon: require("../../public/img/icon/manage-node-icons/plus.png"),
        },
        {
          id: 2,
          content: "DELETE",
          contentIcon: require("../../public/img/icon/manage-node-icons/minus.png"),
        },
        {
          id: 3,
          content: "ACTIVATE",
          contentIcon: require("../../public/img/icon/manage-node-icons/green-power-icon.png"),
        },
        {
          id: 4,
          content: "DEACTIVATE",
          contentIcon: require("../../public/img/icon/manage-node-icons/red-power-icon.png"),
        },
        {
          id: 5,
          content: "LINK WITH",
          contentIcon: require("../../public/img/icon/manage-node-icons/link-icon.png"),
        },
        {
          id: 6,
          content: "DELINK FROM",
          contentIcon: require("../../public/img/icon/manage-node-icons/delink-icon.png"),
        },
      ],
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
      configData: [
        {
          id: 1,
          name: "Configuration",
          network: "testNet",
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
      configData_nodeSidebarVideo: [
        {
          id: 1,
          name: "First Steps!",
        },
        {
          id: 2,
          name: "Stake with 32 ETH",
        },
        {
          id: 3,
          name: "Use ssv.network",
        },
        {
          id: 4,
          name: "Alerts on Mobile App",
        },
        {
          id: 5,
          name: "Switch Clients",
        },
        {
          id: 6,
          name: "Switch Machine",
        },
      ],
      configData_nodeSidebarActive: [
        {
          id: 1,
          name: "NONE FUNC.",
          status: "deactive",
        },
        {
          id: 2,
          name: "ACTIVE",
          status: "active",
        },
        {
          id: 3,
          name: "SYNC/PROBLEM",
          status: "notOk",
        },
        {
          id: 4,
          name: "INACTIVE",
          status: "off",
        },
        {
          id: 5,
          name: "ACTIVE",
          status: "active",
        },
        {
          id: 6,
          name: "INACTIVE",
          status: "off",
        },
        {
          id: 7,
          name: "SYNC/PROBLEM",
          status: "notOk",
        },
        {
          id: 8,
          name: "NONE FUNC.",
          status: "deactive",
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
