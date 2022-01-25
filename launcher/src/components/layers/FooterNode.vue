<template>
  <div class="parent">
    <div class="footerPlace">
      <div class="footerNode">
        <label>SYSTEM ALERT ,</label>
        <label>UPDATES ,</label>
        <label>ETC.</label>
      </div>
    </div>
  </div>
</template>

<style scoped>
.footerNode {
  position: absolute;
  bottom: 3.9%;
  left: 2.8%;  
  width: 94.5%;
  padding:.2rem .5rem;
  background: coral;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin:0 auto;
  border-radius: 0 0 45px 45px;
  border: 3px solid grey;
  box-sizing: border-box;
}
.footerNode label {
  font-weight: bold;
  color: #eee;
}
</style>
