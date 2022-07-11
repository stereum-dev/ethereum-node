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
  height: 84%;
  right: 2.8%;
  box-sizing: border-box;
  position: absolute;

  top: 8.2%;
  margin: 0;
  resize: both;
}
</style>
