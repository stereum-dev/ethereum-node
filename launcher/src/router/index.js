import { createRouter, createWebHashHistory } from "vue-router";

import BaseHome from "../pages/BaseHome.vue";
import ClickInstall from "../pages/ClickInstall.vue";
import WelcomePage from "../pages/WelcomePage.vue";
import TheNode from "../pages/TheNode.vue";
import ControlPanel from "../pages/TheControl.vue";
import NodeManage from "../pages/NodeManage.vue";
import StakingPage from "../pages/StakingPage.vue";
import SettingPage from "../pages/SettingPage.vue";
import CreditPage from "../pages/CreditPage.vue";
import PluginName from "../components/UI/plugin-installation/PluginName.vue";
import VerifyInstallation from "../components/UI/plugin-installation/VerifyInstallation.vue";
import MevboostConfig from "../components/UI/plugin-installation/MevboostConfig.vue";
import CustomInstallationPage from "../pages/CustomInstallationPage.vue";
import UploadConfig from "../components/UI/plugin-installation/UploadConfig.vue";
import FastSync from "../components/UI/plugin-installation/FastSync.vue";
import InstallingAnimation from "../components/UI/plugin-installation/InstallingAnimation.vue";

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
    path: "/selectPlugin",
    name: "/selectPlugin",
    component: ClickInstall,
  },
  {
    path: "/node",
    name: "TheNode",
    component: TheNode,
  },
  {
    path: "/control",
    name: "ControlPanel",
    component: ControlPanel,
  },
  {
    path: "/manage",
    name: "NodeManage",
    component: NodeManage,
  },
  {
    path: "/staking",
    name: "StakingPage",
    component: StakingPage,
  },
  {
    path: "/install",
    name: "PluginName",
    component: PluginName,
  },
  {
    path: "/sync",
    name: "FastSync",
    component: FastSync,
  },
  {
    path: "/verify",
    name: "VerifyInstallation",
    component: VerifyInstallation,
  },
  {
    path: "/play",
    name: "InstallingAnimation",
    component: InstallingAnimation,
  },

  {
    path: "/mevboost",
    name: "MevboostConfig",
    component: MevboostConfig,
  },
  // {
  //   path: "/videos",
  //   name: "TheVideos",
  //   component: TheVideos,
  // },
  // {
  //   path: "/walkthrough",
  //   name: "Walkthrough",
  //   component: WalkThrough,
  // },
  // {
  //   path: "/guide",
  //   name: "Written Guide",
  //   component: WrittenGuide,
  // },
  {
    path: "/setting",
    name: "SettingPage",
    component: SettingPage,
  },
  {
    path: "/credit",
    name: "CreditPage",
    component: CreditPage,
  },
  {
    path: "/custom",
    name: "CustomInstallationPage",
    component: CustomInstallationPage,
  },
  {
    path: "/upload",
    name: "UploadConfig",
    component: UploadConfig,
  },
];

const router = createRouter({ history: createWebHashHistory(), routes });

export default router;
