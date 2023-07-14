<template>
  <div class="exitRow">
    <div class="iconBox">
      <img class="exit-icon" src="/img/icon/the-staking/redexit-icon.png" alt="icon" />
    </div>
    <div class="inputBox">
      <input v-model="enteredPassword" type="password" :placeholder="$t('exitMultipleValidator.passMessage')" />
    </div>
    <div class="confirmBox">
      <button class="back_button" @click="$emit('backBtn', backBtn)">
        <img src="/img/icon/the-staking/close.png" alt="back icon" />
      </button>
      <button
        class="confirmBtn"
        :class="{ deactive: enteredPassword === '' ? true : false }"
        @click="$emit('confirmPassword', enteredPassword)"
      >
        <img src="/img/icon/the-staking/done.png" alt="" />
      </button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      enteredPassword: "",
    };
  },
};
</script>
<style scoped>
.back_button {
  width: 40%;
  height: 100%;
  background-color: #860505;
  border: 1px solid #b81717;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}
.back_button:hover {
  background-color: rgba(134, 5, 5, 0.6);
}

.back_button img:hover,
.confirmBtn img:hover {
  transform: scale(1.2);
  transition-duration: 0.4s;
}
.back_button img:active,
.confirmBtn img:active {
  transform: scale(1);
  transition-duration: 0.2s;
}
.back_button img {
  width: 50%;
}
.deactive {
  opacity: 0.5;
  pointer-events: none;
}
.exitRow {
  grid-column: 1/8;
  grid-row: 1;
  width: 100%;
  height: 100%;
  display: flex;
  background-color: #b81717;
  border-radius: 50px;
  position: absolute;
  z-index: 100;
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
  background-color: #b81717;
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
  background-color: #860505;
  border: 1px solid #b81717;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}
.confirmBtn img {
  width: 45%;
}
.confirmBtn:focus {
  outline: none;
}
.confirmBtn:hover {
  background-color: rgba(134, 5, 5, 0.6);
}
.confirmBtn:active {
  background-color: #292929;
  font-size: 47%;
}
</style>
