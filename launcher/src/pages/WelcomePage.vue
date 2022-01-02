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
export default {
  components: { BackgroundPage, InstallationMenu },
  name: "WelcomePage",
};
</script>
<style scoped></style>
