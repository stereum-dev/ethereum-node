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
  width: 95vw;
  height: 95vh;
  border-radius: 30px;
  margin: auto;
  box-sizing: border-box;
  border: 4px solid grey;
  padding: 0;

}
</style>
