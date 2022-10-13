<template>
  <div id="app-parent">
    <router-view> </router-view>
  </div>
</template>
<script>
export default {};
</script>
<style>
#app {
  min-width: 1024px;
  min-height: 576px;
  max-width: 1025px;
  max-height: 577px;
  width: 100%;
  height: 100%;
  resize: none;
  position: absolute;
  top: 0;
  left: 0;
}
#app-parent {
  font-family: "noto sans";
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
}
</style>
