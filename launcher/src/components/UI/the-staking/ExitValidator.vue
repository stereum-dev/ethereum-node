<template>
  <div class="exitRow">
    <div class="iconBox">
      <img class="exit-icon" src="../../../../public/img/icon/the-staking/redexit-icon.png" alt="icon" />
    </div>
    <div class="inputBox">
      <input type="password" :placeholder="$t('exitMultipleValidator.passMessage')" />
    </div>
    <div class="confirmBox">
      <button class="confirmBtn" @click="$emit('confirmPassword')">
        {{ $t("exitMultipleValidator.confirm") }}
      </button>
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style scoped>
.exitRow {
  grid-column: 1/8;
  grid-row: 1;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 5% 85% 10%;
  grid-template-rows: 1fr;
  background-color: #b81717;
  border-radius: 50px;
  position: absolute;
  z-index: 100;
}
.iconBox {
  grid-column: 1/2;
  grid-row: 1;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.iconBox img {
  width: 20px;
  height: 20px;
  border-radius: 3px;
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
  width: 80%;
  height: 95%;
  padding: 0;
  padding-left: 10px;
  background-color: #5d0000;
  border: 1px solid #958797;
  border-radius: 35px;
  color: #ababab;
  font-size: 0.8rem;
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
  font-weight: 700;
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
