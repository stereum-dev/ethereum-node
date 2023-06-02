<template>
  <div class="staking-parent">
    <div class="staking-box">
      <div class="staking-ico">
        <div class="staking-ico_container">
          <img src="../../../../public/img/icon/control/key-eth.svg" alt="Key-icon" />
        </div>
        <span>STAKING</span>
      </div>
      <div class="staking-container">
        <div class="side-top">
          <div class="top-value">
            <span>{{ formattedBalance }}</span>
          </div>
          <div class="top-icon">
            <!-- <img
              src="../../../../public/img/icon/control/stakingWu.svg"
              alt="coin-icon"
            /> -->
            {{ selectedCurrency }}
          </div>
        </div>
        <div class="side-bottom">
          <div class="number-of-validators">
            <span>{{ formattedValidatorNo }}</span>
          </div>
          <div class="number-of-validators_title">
            <span>IMPORTED</span>
            <span>VALIDATOR(s)</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "pinia";
import { useStakingStore } from "../../../store/theStaking";
import { useNodeManage } from "@/store/nodeManage";
export default {
  data() {
    return {
      currencyIcon: "",
      selectedCurrency: "",
    };
  },
  computed: {
    ...mapState(useStakingStore, {
      totalBalance: "totalBalance",
      keys: "keys",
    }),
    ...mapState(useNodeManage, {
      currentNetwork: "currentNetwork",
    }),
    formattedBalance() {
      return this.totalBalance.toFixed(5);
    },
    formattedValidatorNo() {
      return this.keys.length.toString().padStart(3, "0");
    },
  },
  mounted() {
    this.setSelectedCurrency();
  },
  methods: {
    setSelectedCurrency() {
      switch (this.currentNetwork.id) {
        case 1:
          this.selectedCurrency = "/img/icon/control/ETH_Currency_Symbol.png";
          break;
        case 2:
          this.selectedCurrency = "/img/icon/control/goETH_Currency_Symbol.png";
          break;
        case 3:
          this.selectedCurrency = "/img/icon/control/GNO_Currency_Symbol.png";
          break;
        case 4:
          this.selectedCurrency = "/img/icon/control/sepETH_Currency_Symbol.png";
          break;
        default:
          break;
      }
    },
  },
};
</script>
<style scoped>
.staking-parent {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #c1c1c1;
}
.staking-box {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.staking-ico {
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.staking-ico span {
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50%;
  font-weight: bold;
  color: #c1c1c1;
}
.staking-ico_container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 75%;
}
.staking-ico_container img {
  width: 72%;
  height: 90%;
}
.staking-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 70%;
  height: 100%;
  flex-direction: column;
}
.side-top {
  width: 100%;
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.top-icon {
  width: 35%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  text-transform: uppercase;
  font-weight: 800;
  font-size: 100%;
}

.top-value {
  width: 65%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 90%;
  font-weight: 600;
  color: #74fa65;
}
.side-bottom {
  width: 100%;
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.number-of-validators {
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 100%;
  font-weight: 800;
}
.number-of-validators_title {
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: 55%;
  font-weight: 600;
}
.controller {
  width: 45%;
  height: 85%;
  display: flex;
  flex-direction: column;
  font-size: 10%;
  font-weight: 600;
  justify-content: center;
  align-items: center;
}
</style>
