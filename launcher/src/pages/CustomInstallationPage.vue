<template>
  <background-page>
    <custom-installation></custom-installation>
  </background-page>
</template>
<script>
import BackgroundPage from "../components/layers/BackgroundPage.vue";
import CustomInstallation from "../components/UI/custom-installation/CustomInstallationLayer.vue";
export default {
  components: {
    BackgroundPage,
    CustomInstallation,
  },
};
</script>
