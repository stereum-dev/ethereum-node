import Vue, { createApp } from "vue"; // CHANGE

import { createStore } from "vuex";

import App from "./App.vue";

//dtate vuex
const store = createStore({
  state() {
    return {
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
      configData: [
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
      R1clkInstls: [
        { clkId: "staking", img: "/img/icon/STAKING.png" },
        { clkId: "testnet", img: "/img/icon/TESTNET.png" },
        { clkId: "ssv", img: "/img/icon/BLOX_SSV.png" },
        { clkId: "blox", img: "/img/icon/OBOL_SSV.png" },
        { clkId: "blox", img: "/img/icon/ROCKETPOOL_1.png" },
      ],
    };
  },
});

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
