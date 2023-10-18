<template>
  <background-page>
    <OneclickInstall />
  </background-page>
</template>
<script>
import BackgroundPage from "../components/layers/BackgroundPage.vue";
import OneclickInstall from "@/components/UI/plugin-installation/OneclickInstall.vue";

export default {
  components: { BackgroundPage, OneclickInstall },
};
</script>
<style scoped></style>
