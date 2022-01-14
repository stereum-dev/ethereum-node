//import Vue from "vue";
import { createRouter, createWebHistory } from "vue-router";
//import Setup from "../views/Setup.vue";
//import TheFirst from '../components/layers/TheFirst.vue'
import BaseHome from "../pages/BaseHome.vue";

const routes = [
  // {
  //   path: "/",
  //   name: "Setup",
  //   component: Setup,
  // },
  {
    path: "/",
    name: "BaseHome",
    component: BaseHome,
  },
];

// const router = new VueRouter({
//   mode: "hash",
//   base: process.env.BASE_URL,
//   routes,
// });
const router = createRouter({ history: createWebHistory(), routes });

export default router;
