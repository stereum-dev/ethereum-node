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
  min-height: 135px;
  background-color: #181818;
  display: flex;
  justify-content: center;
  align-items: center;
}
.trap-box {
  width: 95%;
  /* height: 70%; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #4f4f4f;
  position: relative;
}
.trapezoid {
  height: 0;
  width: 80%;
  margin: 10px;
  padding-top: 5px;
  border-bottom: 5rem solid #828282;
  border-left: 5rem solid transparent;
  border-right: 5rem solid transparent;
}

.trap-item {
  width: 90%;
  height: 90%;
  background-color: rgb(15, 15, 15);
  border: 1px solid #fff;
  position: relative;
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
