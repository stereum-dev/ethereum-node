<template>
  <div class="gasParent">
    <div class="gasIco" v-on:click="test1">
      <img src="../../../../public/img/icon/control/gasIco.svg" />
    </div>
    <div class="baseFeeBox">
      <div class="baseFeeBox_title"><span>BASE FEE</span></div>
      <div class="feeValue" v-on:click="test">
        <span>{{ feeValue }}</span>
      </div>
    </div>
    <div class="ethIco">
      <img
        :class="{ greenArrow: isGreen, greyArrow: isGrey }"
        src="../../../../public/img/icon/control/arrowUpDown.png"
      />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // fee value data is dummy, for wire the have to change to null
      feeValue: 85,
      isGreen: false,
      isGrey: true,
    };
  },
  watch: {
    feeValue(newFeeValue, oldFeeValue) {
      if (newFeeValue > oldFeeValue) {
        this.isGreen = true;
        this.isGrey = false;
      } else if (newFeeValue < oldFeeValue) {
        this.isGreen = false;
        this.isGrey = false;
      } else {
        this.isGreen = false;
        this.isGrey = true;
      }
    },
  },
  // methods are dummy and have to delete
  methods: {
    test() {
      this.feeValue++;
    },
    test1() {
      this.feeValue--;
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
  border: 1px solid #343434;
  background: rgb(42, 42, 42);
  box-sizing: border-box;
  box-shadow: 1px 1px 10px 1px rgb(23, 23, 23);
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
  color: #c1c1c1;
}
.feeValue {
  width: 70%;
  height: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #181717;
  border-radius: 10px;
  padding: 5%;
  color: #c1c1c1;
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
.greyArrow {
  filter: grayscale(100%);
  transform: rotate(-40deg);
}
</style>
