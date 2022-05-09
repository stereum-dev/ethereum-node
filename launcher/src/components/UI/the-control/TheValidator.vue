<template>
  <div class="validatorParent">
    <div class="validatorTitle"><span>Validator</span></div>
    <hr />
    <div class="validatorBox">
      <div class="leftSide">
        <div class="keyPart">
          <div class="keyIco">
            <img src="../../../../public/img/icon/Control/keyEth.svg" />
          </div>
          <div class="keyValuePart">
            <span>{{ activeValue }} ACTIVE</span>
          </div>
        </div>
        <div class="ethBagPart">
          <div class="ethBagPart_ico">
            <img src="../../../../public/img/icon/Control/ethBag.svg" />
          </div>
          <div class="gewiPart">
            <div class="gewiGreenValue">
              <span>{{ ValidatorVal }}</span>
            </div>
            <div class="gewiValueBox">
              <div class="gewiValue">
                <span>{{ gewiValue }}</span>
              </div>
              <div class="gewiTitle"><span>GEWI</span></div>
            </div>
          </div>
        </div>
      </div>

      <div class="rightSide">
        <div class="rightSideTitle">
          <span>RATING</span>
        </div>
        <div class="rightSideValue">{{ RSightValue }}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeValue: 1,
      ValidatorVal: 32.00000001,
      gewiValue: 1,
      RSightValue: "S",
    };
  },
};
</script>

<style scoped>
.validatorParent {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  box-sizing: border-box;
  width: 50%;
  height: 60%;
}
.validatorParent hr {
  width: 80%;
  color: #4e5059;
}
.validatorTitle {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 95%;
  height: 15%;
  font-size: 50%;
  color: #5d5e64;
}
.validatorTitle span {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60%;
  height: 90%;
}
.validatorBox {
  width: 95%;
  height: 78%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.leftSide {
  width: 65%;
  height: 100%;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
}
.keyPart {
  width: 100%;
  height: 35%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.keyIco {
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.keyIco img {
  width: 50%;
}
.keyValuePart {
  width: 65%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.keyValuePart span {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 90%;
  font-size: 50%;
  font-weight: bold;
}
.ethBagPart {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 65%;
}
.ethBagPart_ico {
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.ethBagPart_ico img {
  width: 50%;
}
.gewiPart {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 65%;
  height: 100%;
}
.gewiGreenValue {
  display: flex;
  width: 100%;
  height: 50%;
  justify-content: center;
  align-items: center;
  color: #74fa65;
  font-size: 50%;
  font-weight: bold;
}
.gewiGreenValue span {
  width: 90%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.gewiValueBox {
  width: 100%;
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.gewiValue {
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30%;
}
.gewiValue span {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.gewiTitle {
  width: 70%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50%;
  font-weight: bold;
}
.gewiTitle span {
  width: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.rightSide {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 33%;
}
.rightSideTitle {
  display: flex;
  width: 100%;
  height: 35%;
  justify-content: center;
  align-items: center;
  font-size: 30%;
}
.rightSideTitle span {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
.rightSideValue {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 65%;
  font-size: 100%;
  color: #4dfff3;
}
.rightSideValue span {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
