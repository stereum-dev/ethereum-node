<template>
  <div class="lang-panel_parent">
    <flag-button
      v-for="link in sortedFlags"
      :key="link.flag"
      :is-active="link.enable"
      @setting="setLang(link.langName, link.langSelect, link.label)"
    >
      <div class="langIco"><img :src="link.langImg" /></div>
      <div class="langName">
        <span>{{ link.langName }}</span>
      </div>
    </flag-button>
  </div>
</template>
<script>
import ControlService from "@/store/ControlService";
import { mapWritableState } from "pinia";
import { useFlagDialog } from "../../../store/flagDialog";
import FlagButton from "./FlagButton.vue";

export default {
  components: { FlagButton },
  emits: ["back"],
  data() {
    return {
      isLanguageSelected: false,
      selectedLanguage: {
        lang: "",
        flag: "",
        label: "",
      },
    };
  },
  computed: {
    ...mapWritableState(useFlagDialog, {
      linkFlags: "linkFlags",
    }),
    sortedFlags() {
      const copyOfLinkFlags = [...this.linkFlags];

      return copyOfLinkFlags.sort((a, b) => {
        let fa = a.langName.toLowerCase(),
          fb = b.langName.toLowerCase();
        if (fa < fb) {
          return -1;
        }
        if (fa > fb) {
          return 1;
        }
        return 0;
      });
    },
  },
  methods: {
    setLang(lang, langSelect, langLabel) {
      this.selectedLanguage.lang = lang;
      this.selectedLanguage.flag = langSelect;
      this.$i18n.locale = langLabel;
      this.isLanguageSelected = true;
      this.updateSettings(lang, langSelect, langLabel);
      this.$emit("back");

      this.$forceUpdate();
      location.reload();
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
.lang-panel_parent {
  display: grid;
  grid-template-rows: repeat(6, 1fr);
  grid-template-columns: repeat(4, 1fr);
  width: 100%;
  height: 95%;
}
.langIco {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 18%;
  height: 100%;
}
.langIco img {
  width: 70%;
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
}
.langName:hover,
.langName:active {
  font-weight: 700;
}
</style>
