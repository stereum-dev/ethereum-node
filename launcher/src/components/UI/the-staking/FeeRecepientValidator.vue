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
  grid-template-columns: 5% 85% 10%;
  grid-template-rows: 1fr;
  background-color: #4d56cb;
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
  width: 20px;
  height: 20px;
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
  font-size: 0.8rem;
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
  opacity: 70%;
}
.closeBtn img {
  width: 50%;
}

.closeBtn:hover,
.confirmBtn:hover {
  background-color: rgba(57, 65, 181, 0.6);
}
.closeBtn:active,
.confirmBtn:active {
  background-color: #3941b5;
}
</style>
