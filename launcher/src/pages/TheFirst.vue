<template>
  <div class="parent">
    <div id="container">
      <div class="baselogo-box" @click="activePage">
        <base-logo :link="link"> </base-logo>
      </div>

      <!-- <lang-dialog @click="$emit('open')" v-if="dialogIsVisible"></lang-dialog> -->
      <div class="text-box">
        <span v-if="hiddenDialogActive">choose your language</span>
        <span v-else>Click to continue</span>
      </div>
      <lang-dialog @close="hideDialog" :open="dialogIsVisible">
        <div id="flag" v-for="link in linkFlags" :key="link.langImg">
          <div
            class="content-box"
            @click="setLang(link.langName, link.langSelect)"
          >
            <img :src="link.langImg" id="flagId" />
            <span>{{ link.langName }}</span>
          </div>
        </div>
      </lang-dialog>

      <div class="selected-flag" v-if="isLanguageSelected">
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
import { mapActions } from "vuex";
import BaseLogo from "../components/layers/BaseLogo.vue";
import LangButton from "../components/UI/LangButton.vue";
import LangDialog from "../components/UI/LangDialog.vue";
import ControlService from "@/store/ControlService";
// import SetupServer from "./SetupServer.vue";
export default {
  name: "TheFirst",
  components: { BaseLogo, LangButton, LangDialog },

  emit: ["open", "page"],
  created() {
    this.checkSettings();
  },
  data() {
    return {
      link: "stereum-logo-blinking.gif",
      isLanguageSelected: false,
      hiddenDialogActive: true,
      selectedLanguage: {
        lang: "",
        flag: "",
      },
    };
  },
  mounted() {
    this.showDialog();
  },
  computed: {
    linkFlags() {
      return this.$store.getters.linkFlags_get;
    },
    dialogIsVisible() {
      return this.$store.getters.dialogIsVisible_get;
    },
  },
  methods: {
    ...mapActions(["showDialog", "hideDialog"]),
    setLang(lang, langSelect) {
      this.selectedLanguage.lang = lang;
      this.selectedLanguage.flag = langSelect;
      this.isLanguageSelected = true;
      this.hideDialog();
      this.hiddenDialogActive = false;
      this.link = "stereum-logo-extern.png";
      this.updateSettings(lang, langSelect);
    },
    activePage() {
      if (
        this.selectedLanguage.flag == "" ||
        this.selectedLanguage.lang == ""
      ) {
        // return
      } else {
        this.$emit("page", "SetupServer");
      }
    },
    checkSettings: async function () {
      const savedConfig = await ControlService.readConfig();
      if (
        savedConfig !== undefined &&
        savedConfig.savedLanguage !== undefined
      ) {
        this.setLang(
          savedConfig.savedLanguage.language,
          savedConfig.savedLanguage.flag
        );
        this.activePage();
      }
    },
    updateSettings: async function (lang, langSelect) {
      const prevConf = await ControlService.readConfig();
      const conf = {
        ...prevConf,
        savedLanguage: { language: lang, flag: langSelect },
      };
      await ControlService.writeConfig(conf);
    },
  },
};
</script>

<style scoped>
#container {
  border-radius: 10px;
  height: 100%;
  width: 100%;
  margin: auto;
  position: relative;
  top: 0;
  left: 0;
  box-sizing: border-box;
  background-color: #336666;
  border: 3px solid #989898;
}
.baselogo-box {
  width: 100%;
  height: 100%;
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
  height: 50%;
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
}
</style>
