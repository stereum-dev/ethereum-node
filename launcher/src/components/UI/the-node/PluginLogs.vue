<template>
  <div class="plugin-logs">
    <div>Plugin Logs</div>
    <span @click="$emit('closeLog')">close</span>
  </div>
</template>
<style scoped>
.plugin-logs {
  width: 100%;
  height: 100%;
  background-color: #32564f;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
}
</style>
