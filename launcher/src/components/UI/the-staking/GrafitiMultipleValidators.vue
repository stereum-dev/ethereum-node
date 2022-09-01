<template>
  <div class="grafitiBox">
    <div class="grafitiRow">
      <div class="iconBox">
        <img
          class="grafiti-icon"
          src="../../../../public/img/icon/the-staking/option-graffiti.png"
          alt="icon"
        />
      </div>
      <div class="inputBox">
        <input
          type="text"
          placeholder="Enter up 32 characters to add to the chain when you create a block!"
        />
      </div>
      <div class="confirmBox">
        <button class="confirmBtn" @click="$emit('confirmBtn')">
          Confrim
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {

};
</script>
<style scoped>
.grafitiBox {
  grid-column: 3/11;
  grid-row: 2/3;
  width: 100%;
  height: 40px;
  margin-top: 21px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.grafitiRow {
  width: 100%;
  height: 80%;
  display: grid;
  grid-template-columns: 5% 80% 15%;
  grid-template-rows: 1fr;
  background-color: #723979;
  border-radius: 35px;
  z-index: 100;
}
.iconBox {
  grid-column: 1/2;
  grid-row: 1;
  width: 100%;
  height: 100%;
  margin-left: 7px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.iconBox img {
  width: 25px;
  height: 30px;
  margin: 0 auto;
}
.inputBox {
  grid-column: 2/3;
  grid-row: 1;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.inputBox input {
  width: 100%;
  height: 95%;
  padding: 0;
  padding-left: 5px;
  margin-left: 5px;
  background-color: #3d0444;
  border: 5px solid #723979;
  border-right: none;
  border-radius: 5px;
  color: #958797;
  font-size: 0.7rem;
  font-weight: 500;
}
.confirmBox {
  grid-column: 3/4;
  grid-row: 1;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.confirmBtn {
  width: 100%;
  height: 100%;
  border-radius: 0 35px 35px 0;
  background-color: #292929;
  color: #b5b5b5;
  font-size: 0.7rem;
  font-weight: 600;
  cursor: pointer;
  text-transform: uppercase;
}
.confirmBtn:focus {
  outline: none;
}
.confirmBtn:hover {
  background-color: #3b3b3b;
}
.confirmBtn:active {
  background-color: #292929;
  font-size: 0.67rem;
}
</style>
