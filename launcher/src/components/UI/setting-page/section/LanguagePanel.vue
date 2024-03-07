<template>
  <div class="lang-panel_parent">
    <flag-button v-for="link in sortedFlags" :key="link.name" @setting="setLang(link.name, link.flag, link.label)">
      <div class="langIco"><img :src="link.flag" /></div>
      <div class="langName">
        <span>{{ link.name }}</span>
      </div>
    </flag-button>
  </div>
</template>

<script>
import FlagButton from "../components/FlagButton.vue";
import { mapWritableState } from "pinia";
import ControlService from "@/store/ControlService";
import { useLangStore } from "@/store/languages";

export default {
  components: { FlagButton },
  emits: ["back"],
  data() {
    return {
      isLanguageSelected: false,
      selectedLanguage: {
        name: "",
        flag: "",
        label: "",
        isSelected: false,
        settings: undefined,
      },
    };
  },
  computed: {
    ...mapWritableState(useLangStore, {
      langOptions: "langOptions",
    }),
    sortedFlags() {
      const sortedFlags = [...this.langOptions];
      sortedFlags.sort((a, b) => {
        let fa = a.name.toLowerCase(),
          fb = b.name.toLowerCase();
        if (fa < fb) {
          return -1;
        }
        if (fa > fb) {
          return 1;
        }
        return 0;
      });
      return sortedFlags;
    },
  },
  methods: {
    async setLang(name, flag, label) {
      this.selectedLanguage.name = name;
      this.selectedLanguage.flag = flag;
      this.selectedLanguage.isSelected = true;
      this.$i18n.locale = label;
      this.isLanguageSelected = true;
      this.updateSettings(name, flag, label);
      this.$emit("back");
      // location.reload();
      // this.$forceUpdate();
    },
    updateSettings: async function (name, langSelect, langLabel) {
      const prevConf = await ControlService.readConfig();
      console.log(prevConf);
      const conf = {
        ...prevConf,
        savedLanguage: { name: name, flag: langSelect, label: langLabel },
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
