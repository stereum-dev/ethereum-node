import { createRouter, createWebHashHistory } from "vue-router";

import BaseHome from "../pages/BaseHome.vue";
import ClickInstall from "../pages/ClickInstall.vue";
import WelcomePage from "../pages/WelcomePage.vue";
import ControlPanel from "../pages/TheControl.vue";
import NodePage from "../pages/NodePage.vue";
import NodeEdit from "../pages/NodeEdit.vue";
import StakingPage from "../pages/StakingPage.vue";
import SettingPage from "../pages/SettingPage.vue";
import CreditPage from "../pages/CreditPage.vue";
import PluginName from "../components/UI/plugin-installation/PluginName.vue";
import VerifyInstallation from "../components/UI/plugin-installation/VerifyInstallation.vue";
import MevboostConfig from "../components/UI/plugin-installation/MevboostConfig.vue";
import CustomInstall from "../pages/CustomInstall.vue";
import UploadConfig from "../components/UI/plugin-installation/import-config/UploadConfig.vue";
import FastSync from "../components/UI/plugin-installation/FastSync.vue";
import InstallingAnimation from "../components/UI/plugin-installation/InstallingAnimation.vue";
import CustomAnim from "../components/UI/custom-installation/CustomAnim.vue";
import ImportingVerify from "../components/UI/plugin-installation/import-config/ImportingVerify.vue";
import ImportingList from "../components/UI/plugin-installation/import-config/ImportingList.vue";
import ImportingSyncing from "../components/UI/plugin-installation/import-config/ImportingSyncing.vue";
import ImportingAnimation from "../components/UI/plugin-installation/import-config/ImportingAnimation.vue";
import UpdateHandler from "../pages/UpdateHandler.vue";

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
    name: "NodePage",
    component: NodePage,
  },
  {
    path: "/control",
    name: "ControlPanel",
    component: ControlPanel,
  },

  {
    path: "/edit",
    name: "NodeEdit",
    component: NodeEdit,
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
    name: "CustomInstall",
    component: CustomInstall,
  },
  {
    path: "/customAnim",
    name: "CustomAnim",
    component: CustomAnim,
  },
  {
    path: "/uploadConfig",
    name: "UploadConfig",
    component: UploadConfig,
  },
  {
    path: "/importingList",
    name: "ImportingList",
    component: ImportingList,
  },
  {
    path: "/importingSyncing",
    name: "ImportingSyncing",
    component: ImportingSyncing,
  },
  {
    path: "/importingVerify",
    name: "ImportingVerify",
    component: ImportingVerify,
  },
  {
    path: "/importingAnimation",
    name: "ImportingAnimation",
    component: ImportingAnimation,
  },
  {
    path: "/update",
    name: "UpdateHandler",
    component: UpdateHandler,
  },
];

const router = createRouter({ history: createWebHashHistory(), routes });

export default router;
