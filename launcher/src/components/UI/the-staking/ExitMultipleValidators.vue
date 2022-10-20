<template>
  <div class="exitBox">
    <div class="exitRow">
      <div class="iconBox">
        <img
          class="exit-icon"
          src="../../../../public/img/icon/the-staking/exit2.png"
          alt="icon"
        />
      </div>
      <div class="inputBox">
        <input
          type="text"
          :placeholder="$t('exitMultipleValidator.passMessage')"
        />
      </div>
      <div class="confirmBox">
        <button class="confirmBtn" @click="$emit('confirmBtn')">
          {{ $t("exitMultipleValidator.confirm") }}
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style scoped>
.exitBox {
  grid-column: 3/11;
  grid-row: 2/3;
  width: 100%;
  height: 40px;
  margin-top: 21px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.exitRow {
  width: 100%;
  height: 80%;
  display: grid;
  grid-template-columns: 5% 80% 15%;
  grid-template-rows: 1fr;
  background-color: #b81717;
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
  width: 20px;
  height: 20px;
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
  background-color: #5d0000;
  border: 5px solid #b81717;
  border-right: none;
  border-radius: 5px;
  color: #b0a2a2;
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
