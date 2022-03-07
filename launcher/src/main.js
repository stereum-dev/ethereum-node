import Vue, { createApp } from "vue"; // CHANGE

import { createStore } from "vuex";

import App from "./App.vue";

//state vuex
const store = createStore({
  state() {
    return {
      dialogIsVisible: false,
      linkFlags: [
        {
          langImg: "Img/Flag/ENGLISH.png",
          langSelect: "Img/Flag/En.png",
          langName: "english",
        },
        {
          langImg: "Img/Flag/GERMAN.png",
          langSelect: "Img/Flag/Gr.png",
          langName: "german",
        },
        {
          langImg: "Img/Flag/FRENCH.png",
          langSelect: "Img/Flag/Fr.png",
          langName: "french",
        },
        {
          langImg: "Img/Flag/SPANISH.png",
          langSelect: "Img/Flag/Sp.png",
          langName: "spanish",
        },
      ],
      installation: [
        {
          title: "1CLICK INSTALLATION",
          img: "/img/icon/one click installer.png",
          path: "/clickinstall",
        },
        {
          title: "CUSTOM INSTALLATION",
          img: "/img/icon/custom installer.png",
          path: "/manage",
        },
        {
          title: "IMPORT CONFIGURATION",
          img: "/img/icon/IMPORT CONFIGURATIONS.png",
          path: "/",
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
          name: "Use SSV network",
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
          name: "NONE FUNCTIONAL",
          status: "deactive",
        },
        {
          id: 2,
          name: "ACTIVE",
          status: "active",
        },
        {
          id: 3,
          name: "SYNC/PROBLEM REC.",
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
          name: "SYNC/PROBLEM REC.",
          status: "notOk",
        },
        {
          id: 8,
          name: "NONE FUNCTIONAL",
          status: "deactive",
        },
        {
          id: 9,
          name: "ACTIVE",
          status: "active",
        },
        {
          id: 10,
          name: "SYNC/PROBLEM REC.",
          status: "notOk",
        },
        {
          id: 9,
          name: "ACTIVE",
          status: "active",
        },
        {
          id: 10,
          name: "SYNC/PROBLEM REC.",
          status: "notOk",
        },
        {
          id: 10,
          name: "SYNC/PROBLEM REC.",
          status: "notOk",
        },
        {
          id: 10,
          name: "SYNC/PROBLEM REC.",
          status: "notOk",
        },
        {
          id: 9,
          name: "ACTIVE",
          status: "active",
        },
        {
          id: 10,
          name: "SYNC/PROBLEM REC.",
          status: "notOk",
        },
        {
          id: 10,
          name: "SYNC/PROBLEM REC.",
          status: "notOk",
        },
      ],
      R1clkInstls: [
        { clkId: "staking", img: "/img/icon/STAKING.png" },
        { clkId: "testnet", img: "/img/icon/TESTNET.png" },
        { clkId: "ssv", img: "/img/icon/BLOX_SSV.png" },
        { clkId: "blox", img: "/img/icon/OBOL_SSV.png" },
        { clkId: "blox", img: "/img/icon/ROCKETPOOL_1.png" },
      ],
    };
  },
  mutations: {
    showDialog(state) {
      state.dialogIsVisible = true;
    },
    hideDialog(state) {
      state.dialogIsVisible = false;
    },
  },
  actions: {
    showDialog(context) {
      context.commit("showDialog");
    },
    hideDialog(context) {
      context.commit("hideDialog");
    },
  },
  getters: {
    linkFlags_get(state) {
      return state.linkFlags;
    },
    installation_get(state) {
      return state.installation;
    },
    R1clkInstls_get(state) {
      return state.R1clkInstls;
    },
    nodeSbActive_get(state) {
      return state.configData_nodeSidebarActive;
    },
    nodeSbVideo_get(state) {
      return state.configData_nodeSidebarVideo;
    },
    dialogIsVisible_get(state) {
      return state.dialogIsVisible;
    },
  },
});
//end of state

import router from "./router/index.js";

import i18n from "./includes/i18n";
import BaseButton from "./components/UI/BaseButton.vue";
import BackgroundPage from "./components/layers/BackgroundPage.vue";
import TheTrapezium from "./components/UI/TheTrapezium.vue";
import NodeBg from "./components/UI/NodeBg.vue";
import NodeHeader from "./components/layers/NodeHeader";
import ServicePlugin from "./components/UI/node-manage/ServicePlugin.vue";

//import store from "./store/index.js";
//import ControlService from "@/store/ControlService";
Vue.configureCompat({ WATCH_ARRAY: false });

const app = createApp(App);
//app.use(store);

app.component("base-button", BaseButton);
app.component("background-page", BackgroundPage);
app.component("the-trapezium", TheTrapezium);
app.component("node-bg", NodeBg);
app.component("node-header", NodeHeader);
app.component("service-plugin", ServicePlugin);

app.use(store);
app.use(router);
app.use(i18n);
app.mount("#app");
//Vue.config.productionTip = false;

// new Vue({
//   router,
//   store,
//   render: (h) => h(App),
// }).$mount("#app");
