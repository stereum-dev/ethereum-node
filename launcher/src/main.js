import Vue from 'vue';
import BaseButton from './components/UI/BaseButton.vue';
import BackgroundPage from './components/layers/BackgroundPage.vue';
import App from "./App.vue";
import router from "./router";
import store from "./store";
// import Toasted from "vue-toasted";
import ControlService from '@/store/ControlService';
// import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";
// import "bootstrap/dist/css/bootstrap.css";
// import "bootstrap-vue/dist/bootstrap-vue.css";
// Vue.use(Toasted);
// Vue.use(BootstrapVue);
// Vue.use(BootstrapVueIcons);
// import "./main.css";
Vue.component('base-button',BaseButton);
Vue.component('background-page',BackgroundPage);
 new Vue({
router,
store,
 render: (h) => h(App),

 }).$mount("#app");

//Vue.config.productionTip = false;

// new Vue({
//   router,
//   store,
//   render: (h) => h(App),
// }).$mount("#app");

