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
              :btnValue="item.btnValue"
              :isColor="item.isColor"
              :itemType="item.itemType"
              :savedFlag="langIco"
              :savedLang="langName"
              @lang-action="langActiveBox"
            ></setting-items>
          </div>
        </div>
        <div class="update-panel">
          <div class="update-panel_title"><span>UPDATE</span></div>
          <hr />
          <div class="items-box_update">
            <setting-items
              v-for="item in updateItems"
              :key="item.id"
              :title="item.title"
              :btnValue="item.btnValue"
              :isColor="item.isColor"
              :itemType="item.itemType"
              :isLang="item.isLang"
            ></setting-items>
          </div>
        </div>
      </div>
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
export default {
  components: { TaskManager, SettingItems, LanguagePanel },
  data() {
    return {
      SIco: "/img/icon/setting-page/setting_icon.png",
      pageName: "",
      pageIcon: "",
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
          title: "Leanguage Selection",
          itemType: "general",
        },
        {
          id: 2,
          title: "Credits",
          btnValue: "OPEN",
          isColor: "open",
          itemType: "general",
        },
      ],
      updateItems: [
        {
          id: 1,
          title: "Stereum Version",
          isColor: "alpha",
          itemType: "update",
          btnValue: "ALPHA",
        },
        {
          id: 2,
          title: "Stereum Node Version",
          isColor: "alpha",
          itemType: "update",
          btnValue: "ALPHA",
        },
        {
          id: 3,
          title: "Stereum - Testing Lane",
          isColor: "off",
          itemType: "update",
          btnValue: "OFF",
        },
        {
          id: 4,
          title: "Stereum Update Configuration",
          isColor: "manual",
          itemType: "update",
          btnValue: "MANUAL",
        },
        {
          id: 5,
          title: "Plug-in / Service Update Configuration",
          isColor: "manual",
          itemType: "update",
          btnValue: "Manual",
        },
      ],
    };
  },
  updated() {
    this.checkSettings();
  },
  created() {
    this.checkSettings();
    this.selectror();
  },

  methods: {
    confirm() {
      // confirm method have to write here
      alert("Done!");
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
  },
};
</script>

<style scoped>
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
</style>
