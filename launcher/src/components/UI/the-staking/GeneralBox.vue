<template>
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
</template>
<style scoped>
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
  bottom: 6%;
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
</style>
