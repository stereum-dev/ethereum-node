<template>
  <div>
    <component :is="pageName" @page="page"></component>
  </div>
</template>
<script>
import TheFirst from "./TheFirst.vue";
import SetupServer from "./SetupServer.vue";
import WelcomePage from "./WelcomePage.vue";

export default {
  data() {
    return {
      pageName: "TheFirst",
    };
  },
  components: { TheFirst, SetupServer, WelcomePage },
  name: "BaseHome",
  methods: {
    page(pageId) {
      this.pageName = pageId;
    },
  },
};
</script>
<style></style>
