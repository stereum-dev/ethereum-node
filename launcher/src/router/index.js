import { createRouter, createWebHistory } from "vue-router";

import BaseHome from "../pages/BaseHome.vue";
import ClickInstall from '../pages/ClickInstall.vue'

const routes = [
  {
    path: "/",
    name: "BaseHome",
    component: BaseHome,
  },
  {
    path:"/clickinstall",
    name:"ClickInstall",
    component:ClickInstall
  }
];


const router = createRouter({ history: createWebHistory(), routes });

export default router;
