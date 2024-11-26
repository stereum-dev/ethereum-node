import { createApp } from "vue"; // CHANGE
import App from "./App.vue";
import router from "./router/index.js";
import { createPinia } from "pinia";
import VueApexCharts from "vue3-apexcharts";

import "./main.css";

import i18n from "./includes/i18n";
import BaseLayout from "./components/base/BaseLayout.vue";
import InstallationLayout from "../src/components/base/InstallationLayout.vue";
import TaskManager from "./components/UI/task-manager/TaskManager.vue";
import StakingCustomModal from "./components/UI/staking-page/components/modals/StakingCustomModal.vue";

const app = createApp(App);
const pinia = createPinia();

app.component("BaseLayout", BaseLayout);
app.component("InstallationLayout", InstallationLayout);
app.component("TaskManager", TaskManager);
app.component("StakingCustomModal", StakingCustomModal);

app.use(VueApexCharts);
app.use(router);
app.use(pinia);
app.use(i18n);

app.mount("#app");
