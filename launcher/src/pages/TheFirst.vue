<template>
  <div class="parent">
    <div id="container">
      <section @click="activePage">
        <base-logo mode="logo" :link="link"> </base-logo>
      </section>

      <!-- <lang-dialog @click="$emit('open')" v-if="dialogIsVisible"></lang-dialog> -->
      <lang-dialog @close="hideDialog" :open="dialogIsVisible" class="lDialog">
        <ul id="flag">
          <li
            v-for="link in linkFlags"
            :key="link.langImg"
            @click="setLang(link.langName, link.langSelect)"
          >
            <img :src="link.langImg" id="flagId" />
          </li>
        </ul>
      </lang-dialog>

      <section @click="showDialog">
        <lang-button :flag="flag" class="lang"></lang-button>
      </section>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import BaseLogo from "../components/layers/BaseLogo.vue";
import LangButton from "../components/UI/LangButton.vue";
import LangDialog from "../components/UI/LangDialog.vue";
import ControlService from "@/store/ControlService";
//import SetupServer from "./SetupServer.vue";
export default {
  name: "TheFirst",
  components: { BaseLogo, LangButton, LangDialog },

  emit: ["open", "page"],
  created(){
    this.checkSettings();
  },
  data() {
    return {
      link: "stereum_logo_blinking.gif",
      flag: "SelectLang.png",
      language: "",
    };
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
      this.language = lang;
      this.flag = langSelect;
      this.hideDialog();
      this.link = "stereum-logo-extern.png";
      this.updateSettings(lang, langSelect);
    },
    activePage() {
      if (this.language === "") {
        ///
      } else {
        this.$emit("page", "SetupServer");
      }
    },
    checkSettings : async function(){
      const savedConfig = await ControlService.readConfig()
      if(savedConfig !== undefined && savedConfig.savedLanguage !== undefined){
        this.setLang(savedConfig.savedLanguage.language, savedConfig.savedLanguage.flag);
        this.activePage();
      }
    },
    updateSettings : async function(lang, langSelect){
      let prevConf = await ControlService.readConfig()
      const conf = {...prevConf, savedLanguage: {language: lang, flag: langSelect}};
      await ControlService.writeConfig(conf);
    },
  },
};
</script>

<style scoped>
#container {
  border-radius: 40px;
  height: 95%;
  width: 95%;
  margin: auto;
  position: relative;
  top: 2%;
  left: 0;
  box-sizing: border-box;
  background-color: #336666;
}
.lang {
  position: absolute;
  top: 5%;
  right: 5%;
}
.parent {
  background-color: #000;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  position: fixed;
  z-index: -1;
  padding: 0;
  box-sizing: border-box;
}

#flag {
  display: inline-flex;
  margin: 0;
  padding: 0;
  text-align: left;
  float: left;
}

#flag li {
  list-style: none;
  display: inline-block;
  padding: 10px;
  cursor: pointer;
}

#flagId {
  width: 120px;
  resize: both;
}
</style>
