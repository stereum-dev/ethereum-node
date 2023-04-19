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
          <span>{{ $t("settingPanel.confirm") }}</span>
        </div>
      </div>
      <div class="division-line"></div>
      <transition name="fade-box" mode="out-in">
        <div v-if="langActive" class="seting-language_box">
          <language-panel @back="langActiveBox"></language-panel>
        </div>
        <div v-else class="base-container">
          <div class="general-panel">
            <div class="general-panel_title">
              <span>{{ $t("settingPanel.general") }}</span>
            </div>
            <hr />
            <div class="items-box_general">
              <setting-items
                v-for="item in generalItems"
                :key="item.id"
                :title="item.title"
                :is-color="item.isColor"
                :item-type="item.itemType"
                :saved-flag="langIco"
                :saved-lang="langName"
                :link="item.link"
                :is-language="item.isLanguage"
                :link-value="item.linkValue"
                @lang-action="langActiveBox"
              ></setting-items>
            </div>
          </div>
          <div class="update-panel_title">
            <span>NODE</span>
          </div>
          <hr />
          <div class="setting-items export-row">
            <div class="setting-items_title">
              <span>Export Config</span>
            </div>
            <div class="setting-items_btn export" @click="exportData">export ...</div>
          </div>
          <div class="update-panel">
            <div class="update-panel_title">
              <span>{{ $t("settingPanel.update") }}</span>
            </div>
            <hr />
            <div class="items-box_update">
              <setting-items
                id="version"
                :title="launcherItem"
                :btn-value="launcherVersion"
                is-color="alpha"
                item-type="update"
              ></setting-items>
              <setting-items
                id="version"
                :title="nodeVersion"
                :btn-value="stereumUpdate.current"
                is-color="alpha"
                item-type="update"
              ></setting-items>
              <div class="setting-items">
                <div class="setting-items_title">
                  <span>{{ $t("settingPanel.updateConfig") }}</span>
                </div>
                <div class="setting-items_btn">
                  <select id="stereum-update" v-model="stereumRef" name="stereum-update">
                    <option value="manual">
                      {{ $t("settingPanel.manual") }}
                    </option>
                    <option value="auto">{{ $t("settingPanel.auto") }}</option>
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
const JSZip = require("jszip");
const saveAs = require("file-saver");
const yaml = require("js-yaml");

import LanguagePanel from "./LanguagePanel.vue";
import TaskManager from "../task-manager/TaskManager.vue";
import ControlService from "@/store/ControlService";
import SettingItems from "./SettingItems.vue";
import { mapWritableState, mapState } from "pinia";
import { useNodeHeader } from "@/store/nodeHeader";
import { useServices } from "@/store/services";
import { toRaw } from "vue";
export default {
  components: { TaskManager, SettingItems, LanguagePanel },
  data() {
    return {
      stereumConfig: [
        // {
        //   filename: "file1.yaml",
        //   content: {
        //     name: "John Doe",
        //     age: 35,
        //     email: "johndoe@example.com",
        //   },
        // },
        // {
        //   filename: "file2.yaml",
        //   content: {
        //     name: "Jane Smith",
        //     age: 27,
        //     email: "janesmith@example.com",
        //   },
        // },
        // {
        //   filename: "NimbusBeaconService.yaml",
        //   content:
        //     "{service: NimbusBeaconService\nid: 11ad3d49-8811-9f…decff970\n  consensusClients: []\n  mevboost: []\n\n}",
        // },
      ],
      stereumServiceRef: "manual",
      SIco: "/img/icon/setting-page/setting_icon.png",
      onOff: true,
      btnStatus: "",
      pageName: "",
      pageIcon: "",
      stereumRef: "manual",
      pluginRef: "manual",
      settingData: {
        icon: "/img/icon/setting-page/setting_icon.png",
      },
      languageData: {
        icon: "/img/icon/setting-page/language_page.png",
      },
      langActive: false,
      langIco: "",
      langName: "",
      langLabel: "",
      settings: undefined,
      generalItems: [
        {
          id: 1,
          title: this.$t("settingPanel.langName"),
          itemType: "general",
          isLanguage: true,
        },
        {
          id: 2,
          title: this.$t("settingPanel.credits"),
          link: true,
          isColor: "green",
          itemType: "general",
          linkValue: this.$t("settingPanel.open"),
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

  computed: {
    ...mapState(useServices, {
      launcherVersion: "launcherVersion",
    }),
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
    stereumTitlePage() {
      return this.$t("settingPanel.stereumName");
    },
    langTitlePage() {
      return this.$t("settingPanel.langName");
    },
    launcherItem() {
      return this.$t("settingPanel.launcherVersion");
    },
    commingSoon() {
      return this.$t("comingsoon.comingsoon");
    },
    nodeVersion() {
      return this.$t("settingPanel.nodeVersion");
    },
    on() {
      return this.$t("settingPanel.on");
    },
    off() {
      return this.$t("settingPanel.off");
    },
  },
  mounted() {
    this.getSettings();
    this.forceUpdateCheck = true;
  },
  updated() {
    this.checkSettings();
    this.stereumCurrentVersion();
  },
  created() {
    this.checkSettings();
    this.selector();
    this.checkVersion();
    this.switchOnOff();
    this.exportConfig();
  },
  methods: {
    exportData() {
      const zip = new JSZip();

      this.stereumConfig.forEach((item) => {
        const yamlData = yaml.dump(item.content, { fold: true });
        zip.file(item.filename, yamlData);
      });

      zip.generateAsync({ type: "blob" }).then(function (blob) {
        saveAs(blob, "stereum_config.zip");
      });
    },

    async exportConfig() {
      this.stereumConfig = await ControlService.exportConfig();
      console.log(this.stereumConfig[0]);
    },
    async getSettings() {
      this.settings = await ControlService.getStereumSettings();
      if (this.settings.stereum?.settings.updates.unattended.install) {
        this.stereumRef = "auto";
      } else {
        this.stereumRef = "manual";
      }
    },
    switchOnOff() {
      this.onOff = !this.onOff;
      if (this.onOff === false) {
        this.btnStatus = this.off;
      } else {
        this.btnStatus = this.on;
      }
    },
    checkStereumUpdate() {
      if (this.stereumUpdate && this.stereumUpdate.current) {
        return true;
      }
      return false;
    },
    async confirm() {
      this.settings.stereum.settings.updates.unattended.install = this.stereumRef === "auto";
      await ControlService.setStereumSettings(toRaw(this.settings));
    },
    selector() {
      if (this.langActive === true) {
        this.pageName = this.langTitlePage;
        this.pageIcon = this.languageData.icon;
      } else {
        this.pageName = this.stereumTitlePage;
        this.pageIcon = this.settingData.icon;
      }
    },
    langActiveBox() {
      this.langActive = !this.langActive;
      this.selector();
    },
    checkSettings: async function () {
      const savedConfig = await ControlService.readConfig();
      if (savedConfig !== undefined && savedConfig.savedLanguage !== undefined) {
        this.langIco = savedConfig.savedLanguage.flag;
        this.langName = savedConfig.savedLanguage.language;
        this.$i18n.locale = savedConfig.savedLanguage.label;
      }
    },
    checkVersion: async function () {
      try {
        let stereumVersion = await ControlService.getCurrentStereumVersion();
        this.stereumVersion = stereumVersion;
      } catch (err) {
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
.export {
  background: #316464;
  color: "#c1c1c1";
}
.export:hover {
  font-weight: 700;
  border: 1.5px solid #eee;
}
.export:active {
  transform: scale(0.9);
}
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
  height: 2.5rem;
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
  cursor: pointer;
  margin: 0 2%;
  height: 85%;
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
  width: 95%;
  height: 90%;
  line-height: 90%;
  text-align-last: center;
  border-radius: 10px;
  color: #232323;
}
.setting-items_btn select:hover,
.setting-items_btn select:active,
.setting-items_btn select:focus {
  outline: none;
  border: none;
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
  width: max-content;
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
  padding: 0 0.7%;
  border-radius: 20px;
  cursor: pointer;
  margin: 5% 0;
}
.confirm-btn:hover {
  border: 1px solid white;
  font-weight: 800;
}
.confirm-btn:active {
  background: #004cff;
  transform: scale(0.9);
  border: none;
  box-shadow: none;
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
  margin-top: 0.7%;
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
  overflow-y: auto;
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
