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
  name: "BaseHome",
  components: { TheFirst, SetupServer, WelcomePage },
  data() {
    return {
      pageName: "TheFirst",
    };
  },
  methods: {
    page(pageId) {
      this.pageName = pageId;
    },
  },
};
</script>
<style></style>
