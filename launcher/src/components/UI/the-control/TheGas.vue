<template>
  <div class="gasParent">
    <div class="gasIco">
      <img src="../../../../public/img/icon/control/gasIco.svg" />
    </div>
    <div class="baseFeeBox">
      <div class="baseFeeBox_title"><span>BASE FEE</span></div>
      <div class="feeValue">
        <span>{{ feeValue }}</span>
      </div>
    </div>
    <div class="ethIco">
      <img src="../../../../public/img/icon/control/ethIco.svg" />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      feeValue: 86,
    };
  },
};
</script>
<style scoped>
.gasParent {
  width: 95%;
  height: 95%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.gasIco {
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.gasIco img {
  width: 80%;
}
.baseFeeBox {
  width: 40%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #464a44;
  border-radius: 10px;
}
.baseFeeBox_title {
  width: 100%;
  height: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.baseFeeBox_title span {
  font-size: 40%;
  font-weight: bold;
}
.feeValue {
  width: 70%;
  height: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #33393e;
  border-radius: 10px;
  padding: 5%;
}
.ethIco {
  width: 30%;
  height: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.ethIco img {
  width: 10 0%;
}
</style>
