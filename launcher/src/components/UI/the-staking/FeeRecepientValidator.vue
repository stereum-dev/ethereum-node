<template>
  <div class="feeRow">
    <div class="iconBox">
      <img class="fee-icon" src="/img/icon/the-staking/fee-recepient.png" alt="icon" />
    </div>
    <div class="inputBox">
      <input v-model="enteredAddress" type="text" placeholder="0x00000000000000000000000000000000000000" />
    </div>
    <div class="confirmBox">
      <button class="closeBtn" @click="$emit('closeChange', closeAddress)">
        <img src="/img/icon/the-staking/close.png" alt="" />
      </button>
      <button class="confirmBtn" @click="$emit('confirmChange', enteredAddress)">
        <img src="/img/icon/the-staking/done.png" alt="" />
      </button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      enteredAddress: "",
    };
  },
};
</script>
<style scoped>
.feeRow {
  grid-column: 1/8;
  grid-row: 1;
  width: 100%;
  height: 100%;
  display: flex;
  background-color: #4d56cb;
  justify-content: center;
  align-items: center;
  border-radius: 50px;
  position: absolute;
  z-index: 1000;
}
.iconBox {
  width: 5%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.iconBox img {
  width: 50%;
  height: 65%;
}
.inputBox {
  width: 80%;
  height: 98%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.inputBox input {
  width: 100%;
  height: 95%;
  padding: 0;
  padding-left: 1%;
  background-color: #4d56cb;
  border: none;
  color: #eee;
  font-size: 80%;
  font-weight: 500;
}
.confirmBox {
  width: 15%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.confirmBtn {
  width: 60%;
  height: 100%;
  border-radius: 0 35px 35px 0;
  background-color: #3941b5;
  border: 1px solid #4d56cb;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}
.closeBtn {
  width: 40%;
  height: 100%;
  background-color: #3941b5;
  border: 1px solid #4d56cb;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.confirmBtn img {
  width: 45%;
}
.closeBtn img {
  width: 50%;
}

.closeBtn:hover,
.confirmBtn:hover {
  background-color: rgba(57, 65, 181, 0.6);
}
.closeBtn img:hover,
.confirmBtn img:hover {
  transform: scale(1.2);
  transition-duration: 0.4s;
}
.closeBtn img:active,
.confirmBtn img:active {
  transform: scale(1);
  transition-duration: 0.2s;
}
.closeBtn:active,
.confirmBtn:active {
  background-color: #3941b5;
}
</style>
