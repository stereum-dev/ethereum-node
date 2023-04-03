<template>
  <background-page>
    <CustomPage />
  </background-page>
</template>
<script>
import BackgroundPage from "../components/layers/BackgroundPage.vue";
import CustomPage from "../components/UI/custom-installation/CustomPage.vue";
export default {
  components: {
    BackgroundPage,
    CustomPage,
  },
};
</script>
