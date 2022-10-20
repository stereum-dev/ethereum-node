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
  width: 1024px;
  height: 576px;
  max-width: 1025px;
  max-height: 577px;
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
