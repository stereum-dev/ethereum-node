import Vue, { createApp } from "vue"; // CHANGE
import App from "./App.vue";
import i18n from "./includes/i18n";

import router from "./router/index.js";
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

app.use(router);
app.use(i18n);
app.mount("#app");
//Vue.config.productionTip = false;

// new Vue({
//   router,
//   store,
//   render: (h) => h(App),
// }).$mount("#app");
