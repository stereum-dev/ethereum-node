<template>
  <div class="parent">
    <div class="logo-box">
      <img :src="stereumStatus ? '/img/icon/LOGO.png' : '/img/icon/statusOff.png'" class="main-header__brand" />
    </div>
    <header class="main-header">
      <main-navbar></main-navbar>
    </header>
  </div>
</template>
<script>
import MainNavbar from "../UI/node-header/MainNavbar.vue";
import { mapState } from "pinia";
import { useFooter } from "@/store/theFooter";

export default {
  components: { MainNavbar },
  computed: {
    ...mapState(useFooter, {
      // stereumStatus is the flag for status
      stereumStatus: "stereumStatus",
    }),
  },
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
