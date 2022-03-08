<template>
  <div class="validators-box">
    <div class="validator-title">
      <span class="title">ALL VALIDATORS</span>
    </div>
    <div class="time-reward-box">
      <div class="time-reward">
        <div class="time-reward-title">
          <span>ALL TIME REWARD</span>
        </div>
        <div class="time-reward-value">
          <span></span>
        </div>
      </div>
      <div class="proposed">
        <div class="left-side">
          <div class="proposed-title">
            <span>PROPOSED</span>
          </div>
          <div class="cube">
            <img
              src="../../../../public/Img/icon/the-staking/cube-icon.png"
              alt="icon"
            />
            <div class="cube-value">
              <span></span>
            </div>
          </div>
          <div class="rate-title">
            <span>ATTESTATION RATE</span>
          </div>
          <div class="attention-rate">
            <span>%</span>
            <div class="attention-rate-value"></div>
          </div>
        </div>
        <div class="right-side">
          <div class="attentions">
            <span class="attentions-text">ATTENTIONS</span>
            <span class="attentions-value"></span>
          </div>
          <div class="missed">
            <span class="missed-text">MISSED</span>
            <span class="missed-value"></span>
          </div>
          <div class="agregations">
            <span class="agregations-text">AGGREGATIONS</span>
            <span class="agregations-value"></span>
          </div>
          <div class="slashed">
            <span class="slashed-text">SLASHED</span>
            <span class="slashed-value"></span>
          </div>
        </div>
      </div>
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
  top: 41.3%;
  right: 22px;
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
  border-radius: 10px;
  padding: 3px;
}
.time-reward-box .time-reward {
  width: 100%;
  height: 35%;
  background-color: #464a44;
  margin: 0 auto;
  border-radius: 10px;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.time-reward .time-reward-title {
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  margin-left: 10px;
}
.time-reward .time-reward-value {
  width: 92%;
  height: 22px;
  margin: 0 auto 3px auto;
  background-color: #181818;
  border-radius: 25px;
  box-shadow: inset 0 0 5px 1px #060606;
}
.time-reward-box .proposed {
  width: 100%;
  height: 63%;
  background-color: #464a44;
  margin: 3px auto 0 auto;
  border-radius: 10px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}
.proposed .left-side {
  width: 95%;
  grid-column: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  color: #fff;
  margin-top: 5px;
}
.left-side .proposed-title,
.left-side .rate-title {
  font-size: 10px;
  font-weight: bold;
  text-align: left;
  margin-left: 10px;
}
.left-side .cube {
  width: 80%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.left-side img {
  width: 15px;
  height: 17px;
}
.attention-rate {
  width: 80%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.cube .cube-value,
.attention-rate .attention-rate-value {
  width: 40px;
  height: 17px;
  background-color: #242424;
  border-radius: 20px;
}

.proposed .right-side {
  width: 90%;
  grid-column: 2;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: space-evenly;
  margin-top: 2px;
}
.attentions,
.missed,
.agregations,
.slashed {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.attentions-text,
.missed-text,
.agregations-text,
.slashed-text {
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
}
.attentions-value,
.missed-value,
.agregations-value,
.slashed-value {
  width: 28px;
  height: 16px;
  background-color: rgb(35, 35, 35);
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
