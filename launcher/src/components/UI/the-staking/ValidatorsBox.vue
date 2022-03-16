<template>
  <div class="validators-box">
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
    <div class="validator-title">
      <span class="title">ALL</span>
    </div>
  </div>
</template>

<style scoped>
.validators-box {
  width: 100%;
  height: 95%;
  grid-column: 10/13;
  grid-row: 2/3;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.validators-box .validator-title {
  width: 95%;
  height: 20px;
  background-color: #bfbfbf;
  border-radius: 20px 20px 20px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.validator-title .title {
  width: 80%;
  height: 17px;
  font-size: 14px;
  font-weight: 900;
  color: rgb(36, 36, 36);
}

.validators-box .validator-table {
  width: 90%;
  height: 70%;
  background-color: #bfbfbf;
  margin: 2px auto 0 auto;
  padding: 3px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
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
