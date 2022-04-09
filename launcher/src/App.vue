<template>
  <div id="app-parent">
    <router-view />
  </div>
</template>
<script>
export default {
  watch: {
    items: {
      deep: true,
    },
  },
};
</script>
<style>
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  width: 100vw;
  height: 100vh;
  position: relative;
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
