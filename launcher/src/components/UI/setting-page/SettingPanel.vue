<template>
  <div class="seting-panel_parent">
    <div class="seting-language_box" v-if="langActive">
      <language-panel @back="langActiveBox"></language-panel>
    </div>
    <div class="seting-panel_box" v-else>
      <div class="setting-panel_title">
        <div class="ttl-box">
          <div class="setting-panel_title_ico">
            <img
              src="../../../../public/img/icon/setting-page/setting_icon.png"
            />
          </div>
          <div class="setting-panel_title_ttl">
            <span>STEREUM SETTING</span>
          </div>
        </div>
        <div class="confirm-btn" @click="confirm">
          <span>CONFIRM & APPLY</span>
        </div>
      </div>
      <div class="division-line"></div>
      <div class="general-container">
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
  },

  methods: {
    confirm() {
      // confirm method have to write here
      alert("Done!");
    },
    langActiveBox() {
      this.langActive = !this.langActive;
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
  height: 95%;
  justify-content: center;
  align-items: center;
}
.setting-panel_title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 95%;
  height: 8%;
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
  width: 60%;
}
.setting-panel_title_ttl {
  width: 85%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 130%;
  font-weight: 300;
  color: #eee;
}
.general-container {
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
  margin: 1% 0 0 0;
}
.general-panel_title {
  height: 28%;
}
.update-panel_title {
  height: 14%;
}
hr {
  width: 95%;
  margin: 0.2% 0 0 0;
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
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.items-box_update {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
