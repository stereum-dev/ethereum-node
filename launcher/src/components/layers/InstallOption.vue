<template>
    <div class="container">
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cum illo
        laudantium qui facilis doloremque dolorem impedit totam nihil ullam
        omnis maxime ipsa blanditiis odio quidem at alias, quos distinctio
        dolor!
      </p>
      <hr>
      <div class="row">
        <div class="boxes"></div>
        <div class="boxes"></div>
        <div class="boxes"></div>
        <div class="boxes"></div>
      </div>
      <div class="row">
        <div class="boxes"></div>
        <div class="boxes"></div>
        <div class="boxes"></div>
        <div class="boxes"></div>
      </div>
      <hr>
    </div>
</template>

<style scoped>
.container {
  border: 1px solid red;
  width:60%;
  height: 50vh;
  margin: auto;
  background: yellow;
  border-radius: 40px;
}
.row{
    background: blue;
    width: 100%;
    height: 30%;
    border: 2px solid green;
    box-sizing: border-box;
    margin: 3% 0;
}
.boxes{
    width: 22%;
    height: 100%;
    background: magenta;
    box-sizing: border-box;
    display: inline-block;
    vertical-align: middle;
    margin: 0 1.3%;
}
.container hr {
    width: 80%;
    color: #494949;
    height: 2px;
    background: grey;
  }
</style>