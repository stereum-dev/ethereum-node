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
  grid-column: 1;
  width: 100%;
  height: 45px;
  margin-top: 5px;
  background-color: #2a2e31;
  opacity: 0.9;
  border-radius: 10px;
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
