<template>
  <div class="trap-container">
    <div class="trap-box">
      <div class="trap-title">
        <slot name="title"></slot>
      </div>
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
export default {
  
};
</script>
<style scoped>
.trap-container {
  width: 98%;
  height: 90%;
  background-color: #181818;
  display: flex;
  justify-content: center;
  align-items: center;
}
.trap-box {
  width: 95%;
  height: 70%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #4f4f4f;
  position: relative;
}
.trap-title {
  position: absolute;
  top: -10%;
  left: 2%;
  width: auto;
  height: 20px;
  border-radius: 20px;
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
.item-box {
  display: grid;
  grid-template-columns: repeat(4, 25%);
  align-self: center;
  overflow-x: hidden;
  overflow-y: auto;
  position: absolute;
  top: 19%;
  left: 21%;
  row-gap: 10px;
  height: 63px;
  width: 230px;
  padding: 5px 3px 0 3px;
  background-color: rgb(35, 35, 35);
  border-radius: 10px;
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
