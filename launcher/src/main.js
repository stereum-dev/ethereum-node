import { createApp } from "vue"; // CHANGE

import App from "./App.vue";
import "animate.css";
import router from "./router/index.js";
import "./main.css";
import i18n from "./includes/i18n";
import { createPinia } from "pinia";
import BackgroundPage from "./components/layers/BackgroundPage.vue";
import TheTrapezium from "./components/UI/the-node/TheTrapezium.vue";
import NodeBg from "./components/UI/the-node/NodeBg.vue";
import NodeHeader from "./components/layers/NodeHeader";
import ServicePlugin from "./components/UI/node-manage/ServicePlugin.vue";
import NodeService from "./components/UI/the-node/NodeService.vue";
import CommingSoon from "./components/layers/CommingSoon.vue";
import TheNodePanelBtn from "./components/UI/the-node/TheNodePanelBtn.vue";
import InstallationBox from "./components/UI/plugin-installation/InstallationBox.vue";

const app = createApp(App);
app.component("CommingSoon", CommingSoon);
app.component("TheNodePanelBtn", TheNodePanelBtn);
app.component("BackgroundPage", BackgroundPage);
app.component("TheTrapezium", TheTrapezium);
app.component("NodeBg", NodeBg);
app.component("NodeHeader", NodeHeader);
app.component("ServicePlugin", ServicePlugin);
app.component("NodeService", NodeService);
app.component("InstallationBox", InstallationBox);

app.use(createPinia());
app.use(router);
app.use(i18n);
app.mount("#app");
