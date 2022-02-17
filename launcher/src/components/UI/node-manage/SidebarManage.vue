<template>
  <div>
    <div @click="showSidebar = !showSidebar" class="toggle-btn">
      <img
        v-if="showSidebar"
        class="hidden-icon"
        width="88"
        src="../../../../public/Img/icon/manage-node-icons/sidebar-hidden-icon.png"
        alt=""
      />
      <img
        v-else
        class="show-icon"
        width="88"
        src="../../../../public/Img/icon/manage-node-icons/sidebar-show-icon.png"
        alt=""
      />
    </div>
    <div :class="{ 'run-sidebar': showSidebar }" class="manage-sidebar"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      showSidebar: false,
    };
  },
  methods: {},
};
</script>
<style scoped>
.toggle-btn {
  position: fixed;
  right: -42px;
  top: 50%;
}
.manage-sidebar {
  position: fixed;
  right: -200px;
  width: 200px;
  height: 100%;
  background-color: gray;
}
.run-sidebar {
  right: 0;
}
.hidden-icon {
  position: fixed;
  right: 158px;
  z-index: 99;
}
</style>
