<template>
  <div class="parent">
    <div class="sidebarnode"><slot></slot></div>
  </div>
</template>

<style>
.sidebarnode {
  background: red;
  border-left: 3px solid #808080;
  width: 12%;
  height: 88%;
  right: 2.5%;
  box-sizing: border-box;
  position: absolute;
  border-radius: 0 0 40px 0;
  top: 8.5%;
  margin: 0;
  resize: both;
}
</style>
