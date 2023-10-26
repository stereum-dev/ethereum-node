import { createApp } from "vue"; // CHANGE
import App from "./App.vue";
import router from "./router/index.js";
import { createPinia } from "pinia";

import "./main.css";
import i18n from "./includes/i18n";

import BaseLayout from "./components/base/BaseLayout.vue";
import InstallationLayout from "../src/components/base/InstallationLayout.vue";
import TaskManager from "./components/UI/task-manager/TaskManager.vue";
import BackgroundPage from "./components/layers/BackgroundPage.vue";
import TheTrapezium from "./components/UI/the-node/TheTrapezium.vue";
import NodeBg from "./components/UI/the-node/NodeBg.vue";
import NodeHeader from "./components/layers/NodeHeader";
import ServicePlugin from "./components/UI/node-manage/ServicePlugin.vue";
import NodeService from "./components/UI/the-node/NodeService.vue";
import CommingSoon from "./components/layers/CommingSoon.vue";
import TheNodePanelBtn from "./components/UI/the-node/TheNodePanelBtn.vue";

const app = createApp(App);
const pinia = createPinia();
app.component("CommingSoon", CommingSoon);
app.component("TheNodePanelBtn", TheNodePanelBtn);
app.component("BackgroundPage", BackgroundPage);
app.component("TheTrapezium", TheTrapezium);
app.component("NodeBg", NodeBg);
app.component("NodeHeader", NodeHeader);
app.component("ServicePlugin", ServicePlugin);
app.component("NodeService", NodeService);
app.component("BaseLayout", BaseLayout);
app.component("InstallationLayout", InstallationLayout);
app.component("TaskManager", TaskManager);

app.use(router);
app.use(pinia);
app.use(i18n);
app.mount("#app");
