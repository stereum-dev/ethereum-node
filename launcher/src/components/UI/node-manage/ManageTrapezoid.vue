<template>
  <div class="trap-container">
    <div class="trap-box">
      <div class="trapezoid">
        <slot></slot>
      </div>
      <div class="plus-icon">
        <slot name="plusIcon"></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style scoped>
.trap-container {
  width: 98%;
  margin: 0 auto;
  height: 145px;
  background-color: #181818;
  display: flex;
  justify-content: center;
  align-items: center;
}
.trap-box {
  width: 95%;
  height: 84%;
  background-color: rgb(39, 39, 39);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.trapezoid {
  width: 95%;
  margin-top: 5px;
  border-bottom: 100px solid rgb(100, 100, 100);
  border-left: 50px solid transparent;
  border-right: 50px solid transparent;
  height: 0;
}

.plus-icon {
  position: absolute;
  top: 3%;
  right: 1%;
  width: 50px;
  height: 30px;
  border-radius: 50px;
}
</style>
