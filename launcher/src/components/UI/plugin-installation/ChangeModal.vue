<template>
  <div class="exchange-box">
    <div class="exchange-plugins">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style scoped>
.exchange-box {
  width: 100%;
  height: 43px;
  border-radius: 10px 10px 0 0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
}
.exchange-plugins {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  overflow-y: hidden;
  overflow-x: auto;
}
</style>
