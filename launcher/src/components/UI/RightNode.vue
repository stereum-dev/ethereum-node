<template>
  <div>
    <div id="rside"><slot></slot></div>
  </div>
</template>

<style>
#container {
  background: red;
  border-left: 3px solid #808080;
  width: 15%;
  height: 88%;
  right: -1%;
  box-sizing: border-box;

  border-radius: 0 0 40px 0;
  top: 10%;
  margin: 0;

}
</style>
