<template>
  <div id="parent">
    <div class="green"></div>
    <div class="black"></div>
  </div>
</template>

<style scoped>
#parent {
  position: relative;
}
.green {
  width: 100vw;
  height: 100vh;
  background: #336666;
}
.black {
  background: #000;
  width: 95vw;
  height: 95vh;
  border-radius: 40px;
  position: absolute;
  top: 3%;
  left: 3%;
}
</style>
