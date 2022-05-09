<template>
  <div class="validatorContainerParent">
    <div class="validatorContainerTitle"><span>VALIDATOR</span></div>
    <div class="validatorContainerBox"><slot></slot></div>
  </div>
</template>
<style scoped>
.validatorContainerParent {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}
.validatorContainerTitle {
  width: 98%;
  height: 20%;
  background: #33393e;
  border-radius: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
}
.validatorContainerTitle span {
  font-size: 50%;
  color: #eee;
  border: 1px solid rgb(27, 26, 26);
  width: 20%;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.validatorContainerBox {
  width: 100%;
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
