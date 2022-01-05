<template>
  <section >
    <background-page>
      <installation-menu @page="active"></installation-menu>
    </background-page>
  </section>
</template>
<script>
import BackgroundPage from "../components/layers/BackgroundPage.vue";
import InstallationMenu from "../components/layers/InstallitionMenu.vue";
export default {
  components: { BackgroundPage, InstallationMenu },
  name: "WelcomePage",
  
  methods:{
    active(){
      this.$emit('page','click-install')
    }
  }
};
</script>
<style scoped></style>
