<template>
  <div>
    <component :is="pageName" @page="page"></component>
  </div>
</template>
<script>
import TheFirst from "./TheFirst.vue";
import SetupServer from "./SetupServer.vue";
import WelcomePage from "./WelcomePage.vue";
import ClickInstall from './ClickInstall.vue' 

export default {
  data() {
    return {
      pageName: "TheFirst",
    };
  },
  components: { TheFirst, SetupServer, WelcomePage,ClickInstall },
  name: "BaseHome",
  methods: {
    page(pageId) {
            alert(pageId)

      this.pageName = pageId;
    },
  },
};
</script>
<style></style>
