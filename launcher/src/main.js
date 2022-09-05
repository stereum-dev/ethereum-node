import "mutationobserver-shim";
import Vue, { createApp } from "vue"; // CHANGE

import App from "./App.vue";
import router from "./router/index.js";
import "./components/UI/the-control/chart.js";
import "./main.css";
import i18n from "./includes/i18n";
import { createPinia } from "pinia";
import BaseButton from "./components/UI/BaseButton.vue";
import BackgroundPage from "./components/layers/BackgroundPage.vue";
import TheTrapezium from "./components/UI/the-node/TheTrapezium.vue";
import NodeBg from "./components/UI/the-node/NodeBg.vue";
import ChartBg from "./components/UI/ChartBg.vue";
import NodeHeader from "./components/layers/NodeHeader";
import ServicePlugin from "./components/UI/node-manage/ServicePlugin.vue";
import NodeService from "./components/UI/the-node/NodeService.vue";

Vue.configureCompat({ WATCH_ARRAY: false });

const app = createApp(App);

app.component("base-button", BaseButton);
app.component("background-page", BackgroundPage);
app.component("the-trapezium", TheTrapezium);
app.component("node-bg", NodeBg);
app.component("chart-bg", ChartBg);
app.component("node-header", NodeHeader);
app.component("service-plugin", ServicePlugin);
app.component("node-service", NodeService);

app.use(createPinia());
app.use(router);
app.use(i18n);
app.mount("#app");
