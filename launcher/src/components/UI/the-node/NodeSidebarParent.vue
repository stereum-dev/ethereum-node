<template>
  <div class="sidebar-container">
    <sidebar-active></sidebar-active>
    <sidebar-video @show-modal="$emit('showModal')"></sidebar-video>
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
  width: 100%;
  height: 100%;
  background: #3a3d40;
  border: 5px solid #1c1d1c;
  border-top-right-radius: 30px;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-evenly;
  align-items: center;
  overflow: hidden;
  border-left: none;
}
</style>
