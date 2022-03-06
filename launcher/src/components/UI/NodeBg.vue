<template>
  <div id="parent">
    <div class="green"></div>
    <div class="black">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.green {
  width: 100%;
  height: 100%;
  background: #336666;
  position: fixed;
  z-index: -1;
  top: 0;
  right: 0;
}
.black {
  background: #000;
  margin: 0 0 0 -3px;
  width: 99vw;
  height: 97vh;
  border-radius: 30px;
  box-sizing: border-box;
}
</style>
