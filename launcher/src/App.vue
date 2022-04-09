<template>
  <div id="app">
    <!-- <div id="nav"><router-link to="/">Setup</router-link> |</div> -->
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
<style scoped>
#app {
  font-family: "noto sans";
}
</style>
