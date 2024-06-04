<template>
  <div class="plugins-parent rounded-md">
    <!-- <div class="shape"></div> -->

    <slot></slot>
  </div>
</template>
<style scoped>
.plugins-parent {
  width: 100%;
  height: 100%;
  background-color: #264744;
  box-shadow: 0 1px 3px 1px rgb(20, 44, 34);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.shape {
  width: 36.5%;
  height: 9%;
  background-color: rgb(36, 36, 36);
  position: absolute;
  top: 0;
  left: 0;
  border-top-right-radius: 1% 0;
  border-bottom-right-radius: 107% 155%;
  border-bottom-left-radius: 74% 66%;
}
</style>
