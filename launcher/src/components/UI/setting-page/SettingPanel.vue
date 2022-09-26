<template>
  <div class="seting-panel_parent">
    <div class="seting-panel_box">
      <div class="setting-panel_title">
        <div class="ttl-box">
          <div class="setting-panel_title_ico">
            <img :src="pageIcon" />
          </div>
          <div class="setting-panel_title_ttl">
            <span>{{ pageName }}</span>
          </div>
        </div>
        <div class="confirm-btn" @click="confirm">
          <span>CONFIRM & APPLY</span>
        </div>
      </div>
      <div class="division-line"></div>
      <transition name="fade-box" mode="out-in">
        <div class="seting-language_box" v-if="langActive">
          <language-panel @back="langActiveBox"></language-panel>
        </div>
        <div class="base-container" v-else>
          <div class="general-panel">
            <div class="general-panel_title"><span>GENERAL</span></div>
            <hr />
            <div class="items-box_general">
              <setting-items
                v-for="item in generalItems"
                :key="item.id"
                :title="item.title"
                :isColor="item.isColor"
                :itemType="item.itemType"
                :savedFlag="langIco"
                :savedLang="langName"
                :link="item.link"
                :isLanguage="item.isLanguage"
                :linkValue="item.linkValue"
                @lang-action="langActiveBox"
              ></setting-items>
            </div>
          </div>
          <div class="update-panel">
            <div class="update-panel_title"><span>UPDATE</span></div>
            <hr />
            <div class="items-box_update">
              <setting-items
                title="Stereum Version"
                :btn-value="stereumUpdate.current"
                is-color="alpha"
                item-type="update"
                id="version"
              ></setting-items>

              <div class="setting-items">
                <div class="setting-items_title">
                  <span>Stereum - Testing Lane</span>
                </div>
                <div
                  class="setting-items_btn"
                  @click="switchOnOff"
                  :style="colorPicker"
                >
                  <span>{{ btnStatus }}</span>
                </div>
              </div>
              <div class="setting-items">
                <div class="setting-items_title">
                  <span>Stereum Update Configuration</span>
                </div>
                <div class="setting-items_btn">
                  <comming-soon></comming-soon>
                  <select
                    name="stereum-update"
                    id="stereum-update"
                    v-model="stereumRef"
                  >
                    <option value="manual">MANUAL</option>
                    <option value="auto">AUTO</option>
                  </select>
                </div>
              </div>
              <div class="setting-items">
                <div class="setting-items_title">
                  <span>Plug-in / Service Update Configuration</span>
                </div>
                <div class="setting-items_btn">
                  <comming-soon></comming-soon>
                  <select
                    name="stereum-update"
                    id="stereum-update"
                    v-model="pluginRef"
                  >
                    <option value="manual">MANUAL</option>
                    <option value="auto">AUTO</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <div class="footer"></div>
    <task-manager></task-manager>
  </div>
</template>
<script>
import LanguagePanel from "./LanguagePanel.vue";
import TaskManager from "../task-manager/TaskManager.vue";
import ControlService from "@/store/ControlService";
import SettingItems from "./SettingItems.vue";
import { mapWritableState } from "pinia";
import { useNodeHeader } from "@/store/nodeHeader";
export default {
  components: { TaskManager, SettingItems, LanguagePanel },
  data() {
    return {
      SIco: "/img/icon/setting-page/setting_icon.png",
      onOff: false,
      btnStatus: "",
      pageName: "",
      pageIcon: "",
      stereumRef: "manual",
      pluginRef: "manual",
      settingData: {
        name: "stereum setting",
        icon: "/img/icon/setting-page/setting_icon.png",
      },
      languageData: {
        name: "language - selection",
        icon: "/img/icon/setting-page/language_page.png",
      },
      langActive: false,
      langIco: "",
      langName: "",
      generalItems: [
        {
          id: 1,
          title: "Language Selection",
          itemType: "general",
          isLanguage: true,
        },
        {
          id: 2,
          title: "Credits",
          link: true,
          isColor: "green",
          itemType: "general",
          linkValue: "open",
        },
      ],
      updateItems: [
        {
          id: 1,
          title: "Stereum - Testing Lane",
          isColor: "off",
          itemType: "update",
        },
      ],
    };
  },
  mounted() {
    this.forceUpdateCheck = true;
  },
  updated() {
    this.checkSettings();
    this.stereumCurrentVersion();
  },
  created() {
    this.checkSettings();
    this.selectror();
    this.checkVersion();
    this.switchOnOff();
  },
  computed: {
    ...mapWritableState(useNodeHeader, {
      stereumUpdate: "stereumUpdate",
    }),
    colorPicker() {
      if (this.onOff === false) {
        return { backgroundColor: "#EB5353" };
      } else {
        return { backgroundColor: "#316464" };
      }
    },
  },

  methods: {
    switchOnOff() {
      this.onOff = !this.onOff;
      if (this.onOff === false) {
        this.btnStatus = "off";
      } else {
        this.btnStatus = "on";
      }
    },
    checkStereumUpdate() {
      if (this.stereumUpdate && this.stereumUpdate.current) {
        return true;
      }
      return false;
    },
    confirm() {
      // confirm method have to write here
      // alert("Done!");
    },
    selectror() {
      if (this.langActive === true) {
        this.pageName = this.languageData.name;
        this.pageIcon = this.languageData.icon;
      } else {
        this.pageName = this.settingData.name;
        this.pageIcon = this.settingData.icon;
      }
    },
    langActiveBox() {
      this.langActive = !this.langActive;
      this.selectror();
    },
    checkSettings: async function () {
      const savedConfig = await ControlService.readConfig();
      if (
        savedConfig !== undefined &&
        savedConfig.savedLanguage !== undefined
      ) {
        this.langIco = savedConfig.savedLanguage.flag;
        this.langName = savedConfig.savedLanguage.language;
      }
    },
    checkVersion: async function () {
      try {
        let stereumVersion = await ControlService.getCurrentStereumVersion();
        this.stereumVersion = stereumVersion;
      } catch (error) {
        console.log("Couldn't fetch versions...\nError:", err.message);
      }
    },
    stereumCurrentVersion() {
      this.updateItems.map((item) => {
        if (item.title === "Stereum Version" && this.checkStereumUpdate) {
          item.btnValue = this.stereumUpdate.current;
        } else {
          item.btnValue === "ALPHA";
        }
      });
    },
  },
};
</script>

<style scoped>
.setting-items {
  width: 95%;
  display: flex;
  color: #eee;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #343434;
  background: rgb(42, 42, 42);
  box-sizing: border-box;
  box-shadow: 1px 1px 10px 1px #171717;
  text-decoration: none;
  margin: 0.5% 0;
  border-radius: 20px;
  height: 16%;
}
.setting-items_title {
  width: 60%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 100%;
  font-weight: 600;
}
.setting-items_title span {
  margin: 0 5%;
}
.setting-items_btn {
  position: relative;
  width: 25%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  font-weight: 500;
  border: 1.5px solid #30353a;
  cursor: pointer;
  margin: 0 2%;
  height: 90%;
  color: #000;
  font-size: 100%;
  box-shadow: 0 0 1px 0.5px rgb(23, 23, 23);
  box-sizing: border-box;
  text-transform: uppercase;
  color: #c1c1c1;
}
.setting-items_btn :hover,
.setting-items_btn :focus {
  font-weight: 700;
  outline: none;
}
.setting-items_btn select {
  width: 100%;
  height: 100%;
  line-height: 100%;
  text-align-last: center;
  color: #171717;
}
#version {
  pointer-events: none;
}
.seting-panel_parent {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 99.95%;
  height: 91%;
  background-color: #232323;
  border: 4px solid #979797;
  border-radius: 10px 35px 10px 10px;
  z-index: 0;
  box-sizing: border-box;
}
.seting-panel_box {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 95%;
  justify-content: flex-start;
  align-items: center;
}
.seting-language_box {
  display: flex;
  width: 100%;
  height: 90%;
  justify-content: center;
  align-items: center;
}
.setting-panel_title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 95%;
  height: 9%;
}
.ttl-box {
  display: flex;
  width: 40%;
  height: 100%;
  justify-content: flex-start;
  align-items: center;
  margin: 0 5%;
}
.setting-panel_title_ico {
  width: 15%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.setting-panel_title_ico img {
  width: 50%;
}
.setting-panel_title_ttl {
  width: 85%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 130%;
  color: #eee;
  text-transform: uppercase;
  font-weight: 500;
}
.base-container {
  width: 100%;
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.confirm-btn {
  width: 18%;
  height: 65%;
  background: #48e148;
  border: 1px solid #707070;
  box-shadow: 1px 1px 10px 1px rgb(23, 23, 23);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 100%;
  font-weight: 600;
  color: #fff;
  border-radius: 20px;
  cursor: pointer;
  margin: 5% 0;
}
.confirm-btn:hover,
.confirm-btn:focus {
  border: 1px solid white;
  font-weight: 800;
}
.division-line {
  width: 95%;
  height: 1%;
  background: #eee;
}
.general-panel {
  width: 100%;
  height: 30%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.update-panel {
  width: 100%;
  height: 70%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow-y: auto;
}
.general-panel_title,
.update-panel_title {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 95%;
  font-size: 130%;
  font-weight: 600;
  color: #eee;
  margin: 0 0 0 0;
}
.general-panel_title {
  height: 30%;
}
.update-panel_title {
  height: 15%;
}
hr {
  width: 95%;
  margin: 0 0 1% 0;
}
.footer {
  background-color: rgb(52, 52, 52);
  border-radius: 0 0 7px 7px;
  width: 100%;
  height: 5%;
  display: flex;
}
.items-box_general {
  width: 100%;
  height: 70%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.items-box_update {
  width: 100%;
  height: 85%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
}
.fade-box-enter-from,
.fade-box-leave-to {
  opacity: 0;
}

.fade-box-enter-active {
  transition: opacity 0.3s ease-out;
}
.fade-box-leave-active {
  transition: opacity 0.3s ease-in;
}

.fade-box-enter-to,
.fade-box-leave-from {
  opacity: 1;
}
</style>
