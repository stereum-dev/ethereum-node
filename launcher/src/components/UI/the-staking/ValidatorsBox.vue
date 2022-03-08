<template>
  <div class="validators-box">
    <div class="validator-title">
      <span class="title">ALL VALIDATORS</span>
    </div>
    <div class="time-reward-box">
      <div class="time-reward"></div>
      <div class="proposed"></div>
    </div>
    <div class="validator-table">
      <div class="validator-table-title">
        <span>DATE</span>
        <span>VALIATOR</span>
        <span>ATTEST.RATE</span>
        <span>REWARD</span>
      </div>
      <div class="validator-table-content">
        <div class="validator-table-row">
          <span>DATE</span>
          <span>VALIATOR</span>
          <span>ATTEST.RATE</span>
          <span>REWARD</span>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.validators-box {
  grid-column: 10/13;
  grid-row: 2;
  height: 100%;
}
.validators-box .validator-title {
  width: 230px;
  height: 32px;
  background-color: #bfbfbf;
  border-radius: 20px 20px 20px 20px;
  position: fixed;
  top: 41%;
  right: 21px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.validator-title .title {
  width: 80%;
  height: 26px;
  font-size: 20px;
  font-weight: 900;
  color: #fff;
}
.validators-box .time-reward-box {
  width: 90%;
  height: 50%;
  background-color: #bfbfbf;
  margin: 0 auto;
  border-radius: 20px;
  padding: 3px;
}
.time-reward-box .time-reward {
  width: 100%;
  height: 35%;
  background-color: #464a44;
  margin: 0 auto;
  border-radius: 15px;
}
.time-reward-box .proposed {
  width: 100%;
  height: 63%;
  background-color: #464a44;
  margin: 3px auto 0 auto;
  border-radius: 20px;
}
.validators-box .validator-table {
  width: 90%;
  height: 41%;
  background-color: #bfbfbf;
  margin: 2px auto 0 auto;
  padding: 3px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.validator-table .validator-table-title {
  width: 100%;
  height: 10%;
  color: #333;
  font-size: 8px;
  font-weight: 900;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.validator-table .validator-table-content {
  width: 95%;
  height: 85%;
  background-color: #000000;
  margin-bottom: 5px;
  overflow-x: hidden;
  overflow-y: auto;
}
.validator-table-content .validator-table-row {
  width: 100%;
  height: 16px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 2px;
}
.validator-table-content .validator-table-row span {
  color: #fff;
  font-size: 9px;
  font-weight: 800;
}
.validator-table-content .validator-table-row span:last-child {
  color: tomato;
}
</style>
