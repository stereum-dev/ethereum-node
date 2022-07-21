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
      <img
        :class="{ greenArrow: isGreen }"
        src="../../../../public/img/icon/control/arrowUpDown.png"
      />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      feeValue: 85,
      isGreen: false,
    };
  },
  watch: {
    feeValue(newFeeValue, oldFeeValue) {
      if (newFeeValue > oldFeeValue) {
        this.isGreen = true;
      } else {
        this.isGreen = false;
      }
    },
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
.greenArrow {
  filter: grayscale(100%) brightness(80%) sepia(300%) hue-rotate(50deg)
    saturate(500%);
  transform: rotate(-85deg);
}
</style>
