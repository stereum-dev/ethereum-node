<template>
  <div class="sidebar-container">
    <sidebar-active></sidebar-active>
    <sidebar-video></sidebar-video>
  </div>
</template>
<script>
import SidebarActive from './NodeSidebarActive.vue'
import SidebarVideo from './NodeSidebarVideo.vue'

export default {
  components: { SidebarActive, SidebarVideo }
}
</script>
<style scoped>
.sidebar-container {
  width: 100%;
  height: 100.2%;
  background: #2c4030;
  border: 5px solid #17241e;
  border-top-right-radius: 30px;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-evenly;
  align-items: center;
  overflow: hidden;
}
</style>
