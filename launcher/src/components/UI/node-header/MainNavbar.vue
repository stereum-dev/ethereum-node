<template>
  <nav class="main-nav1">
    <pages-nav></pages-nav>
    <system-links></system-links>
    <icons-nav></icons-nav>
  </nav>
</template>
<script>
import PagesNav from "./PagesNav.vue";
import IconsNav from "./IconsNav.vue";
import SystemLinks from "./SystemLinks.vue";
export default {
  components: { PagesNav, IconsNav, SystemLinks },
};
</script>
<style scoped>
.main-nav1 {
  width:100%;
  height:100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
