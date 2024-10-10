<template>
  <div class="staking-parent">
    <div class="staking-box">
      <div class="staking-ico">
        <div class="staking-ico_container">
          <img src="/img/icon/control-page-icons/key-eth.svg" alt="Key-icon" />
        </div>
        <span>STAKING</span>
      </div>

      <div class="staking-container">
        <NoData
          v-if="flagNoData || isValidatorMissing"
          @mouseenter="cursorLocation = `${nodataMessage}`"
          @mouseleave="cursorLocation = ''"
        />
        <div v-else class="wrapper">
          <div class="side-top">
            <div class="top-value" @mouseenter="cursorLocation = `${ttlBal}`" @mouseleave="cursorLocation = ''">
              <span>{{ formattedBalance }}</span>
            </div>
            <div class="top-icon" @mouseenter="cursorLocation = `${currentNetwork?.name}`" @mouseleave="cursorLocation = ''">
              <img :src="setSelectedCurrency" alt="coin-icon" />
            </div>
          </div>
          <div class="side-bottom">
            <div class="number-of-validators" @mouseenter="cursorLocation = `${enteredKeys}`" @mouseleave="cursorLocation = ''">
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
  </div>
</template>
<script>
import { useStakingStore } from "@/store/theStaking";
import { useNodeManage } from "@/store/nodeManage";
import { mapWritableState, mapState } from "pinia";
import { useFooter } from "@/store/theFooter";
import { useControlStore } from "@/store/theControl";
import NoData from "./NoData.vue";
import { useSetups } from "@/store/setups";

export default {
  components: {
    NoData,
  },
  data() {
    return {
      currencyIcon: "",
      selectedCurrency: "",
      enteredKeys: this.$t("controlPage.enteredKeys"),
      ttlBal: this.$t("controlPage.ttlBal"),
    };
  },

  computed: {
    ...mapState(useStakingStore, {
      totalBalance: "totalBalance",
      keys: "keys",
    }),
    ...mapWritableState(useControlStore, {
      noDataFlag: "noDataFlag",
    }),
    ...mapState(useNodeManage, {
      currentNetwork: "currentNetwork",
    }),
    ...mapWritableState(useFooter, {
      cursorLocation: "cursorLocation",
      missingServices: "missingServices",
      nodataMessage: "nodataMessage",
    }),
    ...mapState(useSetups, {
      selectedSetup: "selectedSetup",
    }),
    formattedBalance() {
      return this.totalBalance.toFixed(5);
    },
    formattedValidatorNo() {
      return this.keys.length.toString().padStart(3, "0");
    },

    isValidatorMissing() {
      return this.missingServices?.includes("validator");
    },

    setSelectedCurrency() {
      switch (this.selectedSetup?.network) {
        case "gnosis":
          return "/img/icon/control-page-icons/network-currency-icons/network-currency-icons-gnosis-mainnet.png";
        case "sepolia":
          return "/img/icon/control-page-icons/network-currency-icons/network-currency-icons-sepolia-testnet.png";
        case "mainnet":
          return "/img/icon/control-page-icons/network-currency-icons/network-currency-icons-ethereum-mainnet.png";
        case "holesky":
          return "/img/icon/control-page-icons/network-currency-icons/network-currency-icons-holesky-testnet.png";
        default:
          return "";
      }
    },
    flagNoData() {
      if (this.currentResult !== undefined && this.currentResult.beaconStatus === undefined) {
        return true;
      }
      return false;
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
  cursor: default;
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
  width: 70%;
  height: 100%;
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
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
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
}
.top-icon img {
  width: 70%;
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
