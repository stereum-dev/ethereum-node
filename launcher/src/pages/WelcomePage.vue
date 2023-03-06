<template>
  <background-page>
    <installation-menu></installation-menu>
  </background-page>
</template>
<script>
import BackgroundPage from "../components/layers/BackgroundPage.vue";
import InstallationMenu from "../components/UI/the-welcome/InstallitionMenu.vue";
export default {
  components: { BackgroundPage, InstallationMenu },
};
</script>
<style scoped></style>
