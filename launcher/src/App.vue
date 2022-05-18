<template>
  <div id="app-parent">
    <router-view> </router-view>
  </div>
</template>
<script>

export default {

}
</script>
<style>
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: rgb(31, 31, 31);
  resize: none;
}
#app {
  width: 100%;
  height: 100%;
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
