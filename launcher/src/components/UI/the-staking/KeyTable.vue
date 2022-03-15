<template>
  <div class="keys-parent">
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
              src="../../../../public/Img/icon/the-staking/blox-service.png"
              alt="icon"
            />
            <span class="since">12d 11h 20m</span>
            <img
              class="state-icon"
              src="../../../../public/Img/icon/the-staking/state-icon.png"
              alt="icon"
            />
            <span class="balance">24.000001</span>
            <div class="option-box">
              <img
                class="grafiti-icon"
                src="../../../../public/Img/icon/the-staking/option-graffiti.png"
                alt="icon"
              />
              <img
                class="copy-icon"
                src="../../../../public/Img/icon/the-staking/option-copy.png"
                alt="icon"
              />
              <img
                class="remove-icon"
                src="../../../../public/Img/icon/the-staking/option-remove.png"
                alt="icon"
              />
              <img
                class="exit-icon"
                src="../../../../public/Img/icon/the-staking/redexit-icon.png"
                alt="icon"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="middle-icon">
      <img
        class="rename"
        src="../../../../public/Img/icon/the-staking/rename-icon.png"
        alt="icon"
      />
      <img
        class="folder"
        src="../../../../public/Img/icon/the-staking/newfolder-icon.png"
        alt="icon"
      />
      <img
        class="filter"
        src="../../../../public/Img/icon/the-staking/staking-filter.png"
        alt="icon"
      />
      <div class="insert-key">
        <span>CLICK OR DRAG TO INSERT KEY</span>
        <img
          class="black-key"
          src="../../../../public/Img/icon/the-staking/black-key.png"
          alt="icon"
        />
      </div>
    </div>
  </div>
</template>
<style scoped>
.keys-parent {
  width: 100%;
  height: 100%;
  margin-left: 5px;
  grid-column: 1/10;
  grid-row: 1/4;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
}
.keys-table-box {
  width: 95%;
  height: 92%;
  margin: 10px 10px 0 0;
  border: 4px solid #bfbfbf;
  border-radius: 20px;
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
  font-size: 10px;
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
  font-size: 10px;
  font-weight: 700;
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
  font-size: 13px;
}
.table-row .username {
  width: 100%;
  grid-column: 3;
  font-size: 10px;
}
.table-row .service-icon {
  width: 20px;
  grid-column: 4;
  justify-self: center;
}
.table-row .since {
  grid-column: 5;
  font-size: 10px;
}
.table-row .state-icon {
  width: 18px;
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
  position: absolute;
  right: 0;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: auto;
  align-items: center;
}
.option-box img {
  width: 20px;
  height: 20px;
  margin: 0 auto;
}
.option-box img:hover {
  width: 23px;
  height: 23px;
  box-shadow: 0 0 4px 0 rgb(228, 230, 228);
}
.option-box img:active {
  width: 21px;
  height: 21px;
  box-shadow: none;
}
.option-box .copy-icon {
  height: 80%;
  grid-column: 1/2;
  grid-row: 1;
}
.option-box .grafiti-icon {
  grid-column: 2;
}
.option-box .remove-icon {
  grid-column: 4;
}
.option-box .exit-icon {
  grid-column: 5;
}
.middle-icon {
  width: 60%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 6%;
  left: 2%;
}
.middle-icon img {
  width: 30px;
  height: 30px;
}
.middle-icon .rename,
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
</style>
