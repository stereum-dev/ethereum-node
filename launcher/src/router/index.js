import { createRouter, createWebHashHistory } from "vue-router";

// import BaseHome from "../pages/BaseHome.vue";
import LanguagePage from "../pages/LanguagePage.vue";
import LoginPage from "@/pages/LoginPage.vue";
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
import TerminalPage from "../pages/TerminalPage.vue";
import SettingPage from "../pages/SettingPage.vue";
import CreditPage from "../pages/CreditPage.vue";
import CustomPage from "@/pages/CustomPage.vue";
import ConfigPage from "@/pages/ConfigPage.vue";
import UploadConfig from "../components/UI/import-config/components/UploadConfig.vue";
import ImportingSyncing from "../components/UI/import-config/components/ImportingSyncing.vue";
import ImportingList from "../components/UI/import-config/components/ImportingList.vue";
import ImportingVerify from "../components/UI/import-config/components/ImportingVerify.vue";
import ImportingAnimation from "../components/UI/import-config/components/ImportingAnimation.vue";
import CustomAnim from "../components/UI/custom-installation/components/CustomAnim.vue";
import CustomPath from "../components/UI/custom-installation/components/CustomPath.vue";
import UpdateHandler from "../pages/UpdateHandler.vue";

const routes = [
  {
    path: "/",
    name: "LanguagePage",
    component: LanguagePage,
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
    path: "/custom",
    name: "CustomPage",
    component: CustomPage,
    children: [
      {
        path: "path",
        name: "CustomPath",
        component: CustomPath,
      },
      {
        path: "play",
        name: "CustomAnim",
        component: CustomAnim,
      },
    ],
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
    path: "/config",
    name: "ConfigPage",
    component: ConfigPage,
    children: [
      {
        path: "upload",
        name: "UploadConfig",
        component: UploadConfig,
      },
      {
        path: "sync",
        name: "ImportingSyncing",
        component: ImportingSyncing,
      },
      {
        path: "list",
        name: "ImportingList",
        component: ImportingList,
      },
      {
        path: "verify",
        name: "ImportingVerify",
        component: ImportingVerify,
      },
      {
        path: "play",
        name: "ImportingAnimation",
        component: ImportingAnimation,
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
  {
    path: "/shell",
    name: "TerminalPage",
    component: TerminalPage,
  },

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
    path: "/update",
    name: "UpdateHandler",
    component: UpdateHandler,
  },
];

const router = createRouter({ history: createWebHashHistory(), routes });

export default router;
