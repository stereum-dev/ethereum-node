<template>
  <div class="langSettingParent" @click="openDial()">
    <div class="icoLang">
      <img :src="selectedLanguage.flag" alt="" />
    </div>
    <div class="langTtl">
      <span>{{ selectedLanguage.lang }}</span>
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
  </div>
</template>
<script>
import { mapWritableState, mapActions } from "pinia";
import { useFlagDialog } from "../../../store/flagDialog";
import LangDialog from "../LangDialog.vue";
import ControlService from "@/store/ControlService";
export default {
  components: { LangDialog },
  emit: ["open", "page"],
  data() {
    return {
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
    ...mapWritableState(useFlagDialog, {
      linkFlags: "linkFlags",
      dialogIsVisible: "dialogIsVisible",
    }),
  },
  methods: {
    openDial() {
      this.dialogIsVisible = !this.dialogIsVisible;
    },

    ...mapActions(useFlagDialog, {
      showDialog: "showDialog",
      hideDialog: "hideDialog",
    }),
    setLang(lang, langSelect) {
      this.selectedLanguage.lang = lang;
      this.selectedLanguage.flag = langSelect;
      this.isLanguageSelected = true;
      this.hideDialog = !this.hideDialog;
      this.hiddenDialogActive = false;
      this.updateSettings(lang, langSelect);
      console.log(lang);
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
.langSettingParent {
  width: 25%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-radius: 5px;
  font-weight: 500;
  border: 1.5px solid #30353a;
  cursor: pointer;
  margin: 0 2%;
  height: 95%;
  color: #000;
  background-color: #eee;
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
.icoLang {
  width: 15%;
  height: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.icoLang img {
  width: 50%;
}
.langTtl {
  width: 85%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
