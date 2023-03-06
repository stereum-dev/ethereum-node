<template>
  <div class="parent">
    <div id="container">
      <div v-if="!dialogIsVisible" class="baselogo-box" @click="activePage">
        <base-logo :link="link"> </base-logo>
      </div>

      <!-- <lang-dialog @click="$emit('open')" v-if="dialogIsVisible"></lang-dialog> -->
      <div class="text-box">
        <span v-if="hiddenDialogActive">choose your language</span>
        <span v-else>Click to continue</span>
      </div>
      <lang-dialog :open="dialogIsVisible" @close="hideDialog">
        <flag-button
          v-for="linkF in linkFlags"
          id="flag-btn"
          :key="linkF.langImg"
          :is-active="linkF.enable"
          @setting="setLang(linkF.langName, linkF.langSelect, linkF.label)"
        >
          <div class="langIco"><img :src="linkF.langImg" /></div>
          <div class="langName">
            <span>{{ link.langName }}</span>
          </div>
        </flag-button>
      </lang-dialog>

      <div v-if="isLanguageSelected" class="selected-flag" @click="showDialog">
        <div class="flag-box">
          <img :src="selectedLanguage.flag" class="selected-icon" />
        </div>
        <div class="lang-name">
          <span>{{ selectedLanguage.lang }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { mapActions } from "vuex";
import { mapWritableState, mapActions } from "pinia";
import { useFlagDialog } from "../store/flagDialog";
import BaseLogo from "../components/layers/BaseLogo.vue";
import LangDialog from "../components/UI/LangDialog.vue";
import ControlService from "@/store/ControlService";
import FlagButton from "../components/UI/setting-page/FlagButton.vue";
// import SetupServer from "./SetupServer.vue";
export default {
  name: "TheFirst",
  components: { BaseLogo, LangDialog, FlagButton },

  emit: ["open", "page"],
  data() {
    return {
      link: "",
      isLanguageSelected: false,
      hiddenDialogActive: true,
      selectedLanguage: {
        lang: "",
        flag: "",
        label: "",
      },
    };
  },
  created() {
    this.checkSettings();
  },
  mounted() {
    this.showDialog();
  },
  computed: {
    ...mapWritableState(useFlagDialog, {
      linkFlags: "linkFlags",
      dialogIsVisible: "dialogIsVisible",
    }),
  },
  methods: {
    ...mapActions(useFlagDialog, {
      showDialog: "showDialog",
      hideDialog: "hideDialog",
    }),
    setLang(lang, langSelect, label) {
      this.selectedLanguage.lang = lang;
      this.selectedLanguage.flag = langSelect;
      this.isLanguageSelected = true;
      this.hideDialog();
      this.hiddenDialogActive = false;
      this.$i18n.locale = label;
      this.link = "/img/icon/language-animations/languageSelection1.gif";
      this.updateSettings(lang, langSelect, label);
      setTimeout(() => {
        this.link = "/img/icon/language-animations/languageSelection2.gif";
      }, 1000);
    },
    activePage() {
      if (this.selectedLanguage.flag == "" || this.selectedLanguage.lang == "") {
        // return
      } else {
        this.link = "/img/icon/language-animations/languageSelection3.gif";
        setTimeout(() => {
          this.$emit("page", "SetupServer");
        }, 650);
      }
    },
    checkSettings: async function () {
      const savedConfig = await ControlService.readConfig();
      if (savedConfig !== undefined && savedConfig.savedLanguage !== undefined) {
        this.setLang(
          savedConfig.savedLanguage.language,
          savedConfig.savedLanguage.flag,
          savedConfig.savedLanguage.label
        );
        this.$emit("page", "SetupServer");
      }
    },
    updateSettings: async function (lang, langSelect, langLabel) {
      const prevConf = await ControlService.readConfig();
      const conf = {
        ...prevConf,
        savedLanguage: { language: lang, flag: langSelect, label: langLabel },
      };
      await ControlService.writeConfig(conf);
    },
  },
};
</script>

<style scoped>
#flag-btn {
  height: 75%;
  background: #1d3d3ad7;
}
.langIco {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20%;
  height: 100%;
}
.langIco img {
  width: 80%;
}
.langName {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70%;
  height: 100%;
  text-transform: uppercase;
  color: #eee;
  font-weight: 500;
  font-size: 100%;
}
.langName:hover,
.langName:active {
  font-weight: 700;
}
#container {
  border-radius: 10px;
  height: 100%;
  width: 100%;
  margin: auto;
  position: relative;
  top: 0;
  left: 0;
  box-sizing: border-box;
  background-color: #000;
  border: 3px solid #989898;
  display: flex;
  justify-content: center;
  align-items: center;
}
.baselogo-box {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.text-box {
  width: 50%;
  height: 30px;
  position: absolute;
  top: 27%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}
.text-box span {
  font-size: 1rem;
  font-weight: 700;
  color: #b5cdcd;
  text-transform: uppercase;
}
.selected-flag {
  width: 15%;
  height: 30%;
  position: absolute;
  top: 3%;
  right: 2%;
}
.flag-box {
  width: 58%;
  height: 52%;
  background-color: #383838;
  border: 5px solid #7e7777;
  border-radius: 100%;
  box-shadow: 0 1px 8px 2px rgb(21, 21, 21);
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
.lang-name {
  min-width: 90px;
  width: fit-content;
  height: 20%;
  background-color: #383838;
  border: 5px solid #7e7777;
  border-radius: 35px;
  margin: 5px auto;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1px 10px;
}
.lang-name span {
  font-size: 1rem;
  font-weight: 500;
  color: rgb(233, 233, 233);
  text-align: center;
  text-transform: uppercase;
}

.selected-flag span {
  font-size: 1rem;
  font-weight: 600;
  color: rgb(204, 204, 204);
  text-transform: uppercase;
}
.selected-flag img {
  width: 100%;
  height: 100%;
}
.parent {
  background-color: #000;
  width: 100%;
  height: 100%;
  border-radius: 40px;
  left: 0;
  top: 0;
  position: fixed;
  z-index: -1;
  padding: 0;
  box-sizing: border-box;
}

#flag {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

#flag .content-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  padding: 10px;
  margin: 0 auto;
  cursor: pointer;
}
.content-box span {
  font-size: 1rem;
  font-weight: 600;
  color: rgb(200, 200, 200);
  text-transform: uppercase;
}
#flagId {
  width: 50px;
  height: 50px;
  border-radius: 100%;
  box-shadow: 0 1px 3px 1px rgb(14, 37, 34);
}
.content-box:hover #flagId {
  transform: scale(1.1);
  transition-duration: 100ms;
}
.content-box:hover span {
  color: #27706e;
  transition-duration: 150ms;
}
</style>
