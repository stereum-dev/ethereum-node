import "mutationobserver-shim";
import Vue, { createApp } from "vue"; // CHANGE

import store from "./store/index.js";
import App from "./App.vue";
import router from "./router/index.js";
import BootstrapVue3 from 'bootstrap-vue-3'
import "./components/UI/the-control/chart.js";
import "./main.css";
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'

import i18n from "./includes/i18n";
import BaseButton from "./components/UI/BaseButton.vue";
import BackgroundPage from "./components/layers/BackgroundPage.vue";
import TheTrapezium from "./components/UI/TheTrapezium.vue";
import NodeBg from "./components/UI/NodeBg.vue";
import ChartBg from "./components/UI/ChartBg.vue";
import NodeHeader from "./components/layers/NodeHeader";
import ServicePlugin from "./components/UI/node-manage/ServicePlugin.vue";


Vue.configureCompat({ WATCH_ARRAY: false });

const app = createApp(App);

app.component("base-button", BaseButton);
app.component("background-page", BackgroundPage);
app.component("the-trapezium", TheTrapezium);
app.component("node-bg", NodeBg);
app.component("chart-bg", ChartBg);
app.component("node-header", NodeHeader);
app.component("service-plugin", ServicePlugin);

app.use(BootstrapVue3)
app.use(store);
app.use(router);
app.use(i18n);
app.mount("#app");
