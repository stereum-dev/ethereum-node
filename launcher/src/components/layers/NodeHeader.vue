<template>
  <div class="parent">
    <SecurityButton />
    <ServerAccessManagement v-if="serverAccessManagement" />
    <header class="main-header">
      <main-navbar></main-navbar>
    </header>
  </div>
</template>
<script>
import ServerAccessManagement from "../UI/node-header/ServerAccessManagement.vue";
import MainNavbar from "../UI/node-header/MainNavbar.vue";
import SecurityButton from "../UI/node-header/SecurityButton.vue";
import { mapState } from "pinia";
import { useFooter } from "@/store/theFooter";
import { useNodeHeader } from "@/store/nodeHeader";

export default {
  components: { MainNavbar, SecurityButton, ServerAccessManagement },
  computed: {
    ...mapState(useFooter, {
      stereumStatus: "stereumStatus",
    }),
    ...mapState(useNodeHeader, {
      serverAccessManagement: "serverAccessManagement",
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
