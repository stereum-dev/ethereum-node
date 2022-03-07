<template>
  <div>
    <div class="header">
      <node-header></node-header>
    </div>
    <div class="staking-parent">
      <div class="staking-green-bg">
        <div class="staking-black-bg">
          <div class="keys-table-box">
            <div class="keys-table">
              <div class="table-header">
                <span id="name">NAME</span>
                <span id="service">SERVICE</span>
                <span id="active">ACTIVE SINCE</span>
                <span id="state">STATE</span>
                <span id="balance">BALANCE</span>
                <span id="option">OPTTIONS</span>
              </div>
              <div class="table-content">
                <div class="table-row">
                  <span class="circle"></span>
                  <span class="category">PUBLIC KEY</span>
                  <span class="username">Max Behzadi</span>
                  <img
                    class="service-icon"
                    src="../../public/Img/icon/the-staking/blox-service.png"
                    alt="icon"
                  />
                  <span class="since">12d 11h 20m</span>
                  <img
                    class="state-icon"
                    src="../../public/Img/icon/the-staking/state-icon.png"
                    alt="icon"
                  />
                  <span class="balance">24.000001</span>
                  <div class="option-box">
                    <img
                      class="exit-icon"
                      src="../../public/Img/icon/the-staking/option-exit.png"
                      alt="icon"
                    />
                    <img
                      class="grafiti-icon"
                      src="../../public/Img/icon/the-staking/option-graffiti.png"
                      alt="icon"
                    />
                    <img
                      class="remove-icon"
                      src="../../public/Img/icon/the-staking/option-remove.png"
                      alt="icon"
                    />
                    <img
                      class="copy-icon"
                      src="../../public/Img/icon/the-staking/option-copy.png"
                      alt="icon"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="middle-icon">
            <img
              class="folder"
              src="../../public/Img/icon/the-staking/newfolder-icon.png"
              alt="icon"
            />
            <img
              class="filter"
              src="../../public/Img/icon/the-staking/staking-filter.png"
              alt="icon"
            />
            <div class="insert-key">
              <span>CLICK OR DRAG TO INSERT KEY</span>
              <img
                class="black-key"
                src="../../public/Img/icon/the-staking/black-key.png"
                alt="icon"
              />
            </div>
          </div>
          <div class="general-box">
            <div class="general-bg">
              <div class="general-options-box">
                <div class="options-box-title">
                  <span>OPTIONS</span>
                </div>
                <div class="ssv-box">
                  <span class="general-title">GENERAL</span>
                  <div class="blox">
                    <span class="check"></span>
                    <span class="blox-text">Blox - ssv</span>
                  </div>
                  <div class="obol">
                    <span class="check"></span>
                    <span class="obol-text">Obol - ssv</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.header {
  height: 50px;
  position: fixed;
  top: 0;
  z-index: 10;
}
.staking-parent {
  position: fixed;
  left: 0;
  top: 7.5%;
  width: 100vw;
  height: 93vh;
}
.staking-green-bg {
  width: 100%;
  height: 100vh;
  background-color: #324b3e;
  display: flex;
  justify-content: center;
  align-items: center;
}
.staking-black-bg {
  position: absolute;
  top: 2px;
  width: 98%;
  height: 97%;
  background-color: #000000;
  border: 4px solid rgb(121, 121, 121);
  border-radius: 0 40px 40px 40px;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: 45% 55%;
}
.keys-table-box {
  grid-column: 1/13;
  grid-row: 1/2;
  justify-self: end;
  width: 90%;
  height: 85%;
  margin: 10px 10px 0 0;
  border: 4px solid #bfbfbf;
  border-radius: 35px 35px 10px 35px;
}
.keys-table {
  width: 100%;
  height: 100%;
}
.table-header {
  height: 30px;
  border-bottom: 7px solid #bfbfbf;
  display: grid;
  grid-template-columns: 3% 17% 13% 8% 13% 6% 10% 30%;
}
.table-header span {
  color: #fff;
  font-size: 13px;
  font-weight: 900;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}
.table-header #name {
  grid-column: 3;
}
.table-header #service {
  grid-column: 4;
}
.table-header #active {
  grid-column: 5;
}
.table-header #state {
  grid-column: 6;
}
.table-header #balance {
  grid-column: 7;
}
.table-header #option {
  grid-column: 8;
}
.table-content {
  height: 80%;
  overflow-x: hidden;
  overflow-y: auto;
}
.table-row {
  width: 99%;
  height: 30px;
  margin: 5px auto 0 auto;
  display: grid;
  justify-content: center;
  align-items: center;
  grid-template-columns: 3% 17% 13% 8% 13% 6% 10% 30%;
  background-color: rgb(89, 89, 89);
  border-radius: 30px;
  padding: 1px;
  position: relative;
}
.table-row span {
  color: #fff;
  font-size: 15px;
  font-weight: 900;
}
.table-row .circle {
  grid-column: 1;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: #fff;
  margin: 0 auto;
  align-self: center;
}
.table-row .category {
  width: 100%;
  grid-column: 2;
  font-size: 18px;
}
.table-row .username {
  width: 100%;
  grid-column: 3;
  font-size: 12px;
}
.table-row .service-icon {
  width: 28px;
  grid-column: 4;
  justify-self: center;
}
.table-row .since {
  grid-column: 5;
  font-size: 13px;
}
.table-row .state-icon {
  width: 20px;
  grid-column: 6;
  justify-self: center;
}
.table-row .balance {
  grid-column: 7;
}
.option-box {
  grid-column: 8;
  width: 90%;
  height: 80%;
  border: 3px solid #bfbfbf;
  background-color: #000000;
  border-radius: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 0;
}
.option-box img {
  width: 24px;
  margin-left: 10px;
}
.option-box .copy-icon {
  margin-left: 50px;
}
.middle-icon {
  width: 60%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 37%;
  left: 10%;
}
.middle-icon img {
  width: 30px;
  height: 30px;
}
.middle-icon .folder {
  margin-right: 10px;
}
.middle-icon .filter {
  margin-right: 20px;
}
.middle-icon .insert-key {
  width: 70%;
  height: 32px;
  background-color: #bfbfbf;
  border-radius: 40px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.middle-icon .insert-key span {
  color: #fff;
  font-size: 20px;
  font-weight: 900;
}
.middle-icon .insert-key img {
  width: 28px;
  height: 28px;
}
.general-box {
  grid-column: 2/10;
  grid-row: 2;
  height: 92%;
  border-radius: 30px;
  background-color: #383838;
  display: flex;
  justify-content: center;
  align-items: center;
}
.general-bg {
  width: 95%;
  height: 90%;
  background-color: #676767;
  border-radius: 30px;
}
.general-options-box {
  width: 15%;
  height: 44.1%;
  background-color: #4c4848;
  border: 4px solid #bfbfbf;
  border-radius: 20px;
  position: fixed;
  bottom: 5.3%;
  left: 9%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.options-box-title {
  width: 170px;
  height: 30px;
  background-color: #4c4848;
  border: 3px solid #bfbfbf;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  position: absolute;
  top: 10px;
  left: -11px;
}
.ssv-box {
  width: 100%;
  height: 70%;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
.ssv-box .general-title {
  width: 70%;
  height: 23px;
  margin: 0 auto;
  border: 2px solid #767676;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 900;
  color: #bfbfbf;
  display: flex;
  justify-content: center;
  align-items: center;
}
.ssv-box .blox,
.ssv-box .obol {
  width: 70%;
  height: 25px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.ssv-box .blox-text,
.ssv-box .obol-text {
  width: 70%;
  height: 20px;
  border: 2px solid #767676;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  color: #bfbfbf;
}
.check {
  width: 15px;
  height: 15px;
  border: 2px solid #767676;
  background-color: #4c4848;
  border-radius: 20px;
}
.validators-box {
  grid-column: 10/13;
  grid-row: 2;
}
.validators-box .validator-title {
  width: 232px;
  height: 32px;
  background-color: #bfbfbf;
  border-radius: 30px;
  position: fixed;
  top: 42.5%;
  right: 20px;
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
  height: 37%;
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
