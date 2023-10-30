import { createRouter, createWebHashHistory } from "vue-router";

import BaseHome from "../pages/BaseHome.vue";
import LoginPage from "../pages/LoginPage.vue";
import OneclickPage from "@/pages/OneclickPage.vue";
import SelectPreset from "../../src/components/UI/one-click/sections/SelectPreset.vue";
import ConfigPlugins from "../../src/components/UI/one-click/sections/ConfigPlugins.vue";
import MevboostRelays from "../../src/components/UI/one-click/sections/MevboostRelays.vue";
import SelectSync from "../../src/components/UI/one-click/sections/SelectSync.vue";
import VerifyCheck from "../../src/components/UI/one-click/sections/VerifyCheck.vue";
import AnimationSection from "../../src/components/UI/one-click/sections/AnimationSection.vue";
import WelcomePage from "../pages/WelcomePage.vue";
import ControlPanel from "../pages/TheControl.vue";
import NodePage from "../pages/NodePage.vue";
import NodeEdit from "../pages/NodeEdit.vue";
import StakingPage from "../pages/StakingPage.vue";
import SettingPage from "../pages/SettingPage.vue";
import CreditPage from "../pages/CreditPage.vue";
import CustomInstall from "../pages/CustomInstall.vue";
import UploadConfig from "../components/UI/plugin-installation/import-config/UploadConfig.vue";

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
    path: "/login",
    name: "LoginPage",
    component: LoginPage,
  },

  {
    path: "/welcome",
    name: "WelcomePage",
    component: WelcomePage,
  },
  {
    path: "/oneClick",
    name: "OneclickPage",
    component: OneclickPage,
    children: [
      {
        path: "preset",
        name: "SelectPreset",
        component: SelectPreset,
      },
      {
        path: "config",
        name: "ConfigPlugins",
        component: ConfigPlugins,
      },
      {
        path: "mevboost",
        name: "MevboostRelays",
        component: MevboostRelays,
      },
      {
        path: "sync",
        name: "SelectSync",
        component: SelectSync,
      },
      {
        path: "verify",
        name: "VerifyCheck",
        component: VerifyCheck,
      },
      {
        path: "play",
        name: "AnimationSection",
        component: AnimationSection,
      },
    ],
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

  // {
  //   path: "/mevboost",
  //   name: "MevboostRelays",
  //   component: MevboostRelays,
  // },

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
