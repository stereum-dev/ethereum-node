import nodeManageActions from "./actions.js";
import nodeManageGetters from "./getters.js";
import nodeManageMutations from "./mutations.js";

export default {
  state() {
    return {
      consensusItems: [],
      executionItems: [],
      validatorItems: [],
      selectedItemToRemove: {},
      modalItems: [],
      confirmChanges: [
        {
          id: 1,
          content: "INSTALL",
          contentIcon: require("../../../public/Img/icon/manage-node-icons/plus.png"),
        },
        {
          id: 2,
          content: "DELETE",
          contentIcon: require("../../../public/Img/icon/manage-node-icons/minus.png"),
        },
        {
          id: 3,
          content: "ACTIVATE",
          contentIcon: require("../../../public/Img/icon/manage-node-icons/green-power-icon.png"),
        },
        {
          id: 4,
          content: "DEACTIVATE",
          contentIcon: require("../../../public/Img/icon/manage-node-icons/red-power-icon.png"),
        },
        {
          id: 5,
          content: "LINK WITH",
          contentIcon: require("../../../public/Img/icon/manage-node-icons/link-icon.png"),
        },
        {
          id: 6,
          content: "DELINK FROM",
          contentIcon: require("../../../public/Img/icon/manage-node-icons/delink-icon.png"),
        },
      ],
      servicePlugins: [
        {
          id: 1,
          source: require("../../../public/Img/icon/manage-node-icons/plugin-item-icon.png"),
          active: false,
        },
        {
          id: 2,
          source: require("../../../public/Img/icon/manage-node-icons/plugin-item-icon.png"),
          active: false,
        },
        {
          id: 3,
          source: require("../../../public/Img/icon/manage-node-icons/plugin-item-icon.png"),
          active: false,
        },
        {
          id: 4,
          source: require("../../../public/Img/icon/manage-node-icons/plugin-item-icon.png"),
          active: false,
        },
        {
          id: 5,
          source: require("../../../public/Img/icon/manage-node-icons/plugin-item-icon.png"),
          active: false,
        },
      ],
      sidebarPlugins: [
        {
          id: 1,
          source: require("../../../public/Img/icon/manage-node-icons/filter-confirm.png"),
          drag: true,
          category: "execution",
          active: false,
        },
        {
          id: 2,
          source: require("../../../public/Img/icon/manage-node-icons/plugin-item-icon.png"),
          drag: true,
          category: "consensus",
          active: false,
        },
        {
          id: 3,
          source: require("../../../public/Img/icon/manage-node-icons/plugin-item-icon.png"),
          drag: true,
          category: "service",
          active: false,
        },
        {
          id: 4,
          source: require("../../../public/Img/icon/manage-node-icons/plugin-item-icon.png"),
          drag: true,
          category: "validator",
          active: false,
        },
        {
          id: 5,
          source: require("../../../public/Img/icon/manage-node-icons/plugin-item-icon.png"),
          drag: true,
          category: "validator",
          active: false,
        },
        {
          id: 6,
          source: require("../../../public/Img/icon/manage-node-icons/plugin-item-icon.png"),
          drag: true,
          category: "service",
          active: false,
        },
        {
          id: 7,
          source: require("../../../public/Img/icon/manage-node-icons/plugin-item-icon.png"),
          drag: true,
          category: "consensus",
          active: false,
        },
        {
          id: 8,
          source: require("../../../public/Img/icon/manage-node-icons/plugin-item-icon.png"),
          drag: true,
          category: "execution",
          active: false,
        },
        {
          id: 9,
          source: require("../../../public/Img/icon/manage-node-icons/plugin-item-icon.png"),
          drag: true,
          category: "service",
          active: false,
        },
        {
          id: 10,
          source: require("../../../public/Img/icon/manage-node-icons/plugin-item-icon.png"),
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
    };
  },
  mutations: nodeManageMutations,
  actions: nodeManageActions,
  getters: nodeManageGetters,
};
