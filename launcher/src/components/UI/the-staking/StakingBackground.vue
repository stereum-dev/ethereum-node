<template>
  <div>
    <div class="header">
      <node-header></node-header>
    </div>
    <div class="staking-parent">
      <div class="staking-green-bg">
        <div class="staking-black-bg">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.staking-parent {
  position: fixed;
  left: 0;
  top: 7.5%;
  width: 100vw;
  height: 93vh;
}
.staking-green-bg {
  width: 100%;
  height: 100vh;
  background-color: #324b3e;
  display: flex;
  justify-content: center;
  align-items: center;
}
.staking-black-bg {
  position: absolute;
  top: 2px;
  width: 98%;
  height: 97%;
  background-color: #000000;
  border: 4px solid rgb(121, 121, 121);
  border-radius: 0 40px 40px 40px;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: 45% 55%;
}
</style>
