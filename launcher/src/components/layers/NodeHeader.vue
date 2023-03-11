<template>
  <div class="parent">
    <div class="logo-box">
      <img src="/img/icon/LOGO.png" class="main-header__brand" />
    </div>
    <header class="main-header">
      <main-navbar></main-navbar>
    </header>
  </div>
</template>
<script>
import MainNavbar from "../UI/node-header/MainNavbar.vue";

export default {
  components: { MainNavbar },
};
</script>
<style scoped>
.main-header {
  width: 100vw;
  height: 50px;
  background-color: #264744;
  display: flex;
  justify-content: space-between;
  align-content: center;
}
.logo-box {
  position: fixed;
  top: 0;
  left: 0;
  width: 8%;
  height: 15%;
  z-index: 50;
}
.main-header__brand {
  width: 100%;
  z-index: 51;
}
</style>
