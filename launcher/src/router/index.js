import { createRouter, createWebHistory } from "vue-router";

import BaseHome from "../pages/BaseHome.vue";
import ClickInstall from "../pages/ClickInstall.vue";
import WelcomePage from "../pages/WelcomePage.vue";
import TheNode from "../pages/TheNode.vue";
import ControlPanel from '../pages/ControlPanel.vue';

const routes = [
  {
    path: "/",
    name: "BaseHome",
    component: BaseHome,
  },
  {
    path: "/welcome",
    name: "WelcomePage",
    component: WelcomePage,
  },
  {
    path: "/clickinstall",
    name: "ClickInstall",
    component: ClickInstall,
  },
  {
    path: "/node",
    name: "TheNode",
    component: TheNode,
  },
  {
    path:"/control",
    name:"ControlPanel",
    component:ControlPanel
  }
];

const router = createRouter({ history: createWebHistory(), routes });

export default router;
