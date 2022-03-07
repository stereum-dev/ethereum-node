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
  border-radius: 0 45px 45px 45px;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(2, 1fr);
}
.keys-table-box {
  grid-column: 1/13;
  grid-row: 1/2;
  justify-self: end;
  width: 90%;
  height: 90%;
  margin: 20px 10px 0 0;
  border: 4px solid #a2a2a2;
  border-radius: 45px;
}
.keys-table {
  width: 100%;
  height: 100%;
}
.table-header {
  height: 30px;
  border-bottom: 7px solid #a2a2a2;
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
}
.table-row {
  width: 99%;
  height: 37px;
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
  border: 3px solid gray;
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
</style>
