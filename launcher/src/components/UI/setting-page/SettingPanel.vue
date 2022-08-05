<template>
  <div class="seting-panel_parent">
    <div class="setting-panel_title">
      <div class="ttl-box">
        <div class="setting-panel_title_ico">
          <img
            src="../../../../public/img/icon/setting-page/setting_icon.png"
          />
        </div>
        <div class="setting-panel_title_ttl"><span>STEREUM SETTING</span></div>
      </div>
      <div class="confirm-btn">
        <span>CONFIRM & APPLY</span>
      </div>
    </div>
    <div class="division-line"></div>
  </div>
</template>

<style scoped>
.seting-panel_parent {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 99.95%;
  height: 91%;
  background-color: #232323;
  border: 4px solid #979797;
  border-radius: 10px 35px 10px 10px;
  z-index: 0;
}
.setting-panel_title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 95%;
  height: 8%;
}
.ttl-box {
  display: flex;
  width: 40%;
  height: 100%;
  justify-content: flex-start;
  align-items: center;
  margin: 0 5%;
}
.setting-panel_title_ico {
  width: 15%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.setting-panel_title_ico img {
  width: 60%;
}
.setting-panel_title_ttl {
  width: 85%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 130%;
  font-weight: 300;
  color: #eee;
}
.confirm-btn {
  width: 18%;
  height: 65%;
  background: #48e148;
  border: 1px solid #707070;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 100%;
  font-weight: 600;
  color: #fff;
  border-radius: 20px;
  cursor: pointer;
  margin: 5% 0;
}
.confirm-btn:hover,
.confirm-btn:focus {
  border: 1px solid white;
  font-weight: 800;
}
.division-line {
  width: 95%;
  height: 1%;
  background: #eee;
}
</style>
