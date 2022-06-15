<template>
  <div class="exchange-box">
    <div class="exchange-plugins">
      <slot></slot>
    </div>
  </div>
</template>
<style scoped>
.exchange-box {
  width: 24.9%;
  height: 35%;
  border-radius: 18px;
  background-color: rgb(215, 215, 215);
  position: fixed;
  top: 37%;
  right: 24%;
}
.exchange-plugins {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(4, 1fr);
  overflow: hidden;
}
</style>
