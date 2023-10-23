<template>
  <div>
    <component :is="pageName" @page="page"></component>
  </div>
</template>
<script>
import TheFirst from "./TheFirst.vue";
import LoginPage from "./LoginPage.vue";
import WelcomePage from "./WelcomePage.vue";

export default {
  name: "BaseHome",
  components: { TheFirst, LoginPage, WelcomePage },
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
