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
export default {}
</script>
<style scoped>
.trap-container {
  width: 98%;
  margin: 0 auto;
  min-height: 135px;
  background-color: #181818;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: -1;
}
.trap-box {
  width: 95%;
  height: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #3b3b3b;
  position: relative;
}
.trapezoid {
  height: 0;
  width: 90%;
  margin: 10px;
  padding-top: 5px;
  border-bottom: 5rem solid #828282;
  border-left: 5rem solid transparent;
  border-right: 5rem solid transparent;
  z-index: 1;
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
