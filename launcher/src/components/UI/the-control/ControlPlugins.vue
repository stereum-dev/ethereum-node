<template>
  <div class="plugins-parent">
    <div class="shape"></div>

    <slot></slot>

  </div>
</template>
<style scoped>
.plugins-parent {
  width: 90%;
  height: 98%;
  background-color: #2b4035;
  border-radius: 0 45px 45px 45px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.shape {
  width: 80px;
  height: 43px;
  background-color: black;
  position: absolute;
  top: 0;
  left: 0;
  border-top-right-radius: 1% 0;
  border-bottom-right-radius: 107% 155%;
  border-bottom-left-radius: 74% 66%;
}
</style>
