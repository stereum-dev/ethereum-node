<template>
  <div class="sidebar-container">
    <sidebar-active></sidebar-active>
    <sidebar-video></sidebar-video>
  </div>
</template>
<script>
import SidebarActive from "./NodeSidebarActive.vue";
import SidebarVideo from "./NodeSidebarVideo.vue";

export default {
  components: { SidebarActive, SidebarVideo },
};
</script>
<style scoped>
.sidebar-container {
  width: 93.5%;
  height: 98.5%;
  background: #2c4030;
  border: 5px solid #17241e;
  border-top-right-radius: 30px;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;
  overflow: hidden;
}
</style>
