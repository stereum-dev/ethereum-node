import Vue, { createApp } from "vue"; // CHANGE
import App from "./App.vue";

import router from "./router/index.js";
import BaseButton from "./components/UI/BaseButton.vue";
import BackgroundPage from "./components/layers/BackgroundPage.vue";
import TheTrapezium from './components/UI/TheTrapezium.vue';
import NodeBg from './components/UI/NodeBg.vue';
import NodeHeader from './components/layers/NodeHeader'
//import store from "./store/index.js";
//import ControlService from "@/store/ControlService";
Vue.configureCompat({ WATCH_ARRAY: false });

const app = createApp(App);
//app.use(store);

app.component("base-button", BaseButton);
app.component("background-page", BackgroundPage);
app.component("the-trapezium",TheTrapezium);
app.component("node-bg",NodeBg);
app.component("node-header",NodeHeader);

app.use(router);

app.mount("#app");
//Vue.config.productionTip = false;

// new Vue({
//   router,
//   store,
//   render: (h) => h(App),
// }).$mount("#app");
