<template>
  <section>
    <background-page>
      <installation-menu></installation-menu>
    </background-page>
  </section>
</template>
<script>
import BackgroundPage from "../components/layers/BackgroundPage.vue";
import InstallationMenu from "../components/layers/InstallitionMenu.vue";
import BaseButton from "../components/layers/BaseButton.vue";
export default {
  components: { BackgroundPage, InstallationMenu, BaseButton },
  name: "WelcomePage",
};
</script>
<style scoped></style>
