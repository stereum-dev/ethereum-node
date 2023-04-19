<template>
  <div class="balance_box">
    <div class="balanceInnerBox">
      <div class="balance">
        <div class="balance-title">
          <span>{{ $t("timeReward.totalText") }} {{ keys.length }} {{ $t("timeReward.validators") }}</span>
        </div>
        <div class="balance-value">
          <span>32.000548</span>
        </div>
      </div>
      <div class="epochBox">
        <div class="epoch">
          <span class="epochNumber">155906</span>
        </div>
        <div class="slotBox">
          <span class="firstNumber">16#</span>
          <span class="outOf">/</span>
          <span class="secondNumber">32#</span>
          <span class="divider"></span>
          <span class="slotNumber">4989008</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "pinia";
import { useStakingStore } from "../../../store/theStaking";

export default {
  computed: {
    ...mapState(useStakingStore, {
      totalBalance: 32.0000185,
      keys: "keys",
    }),
  },
};
</script>
<style scoped>
.balance_box {
  width: 100%;
  height: 100%;
  grid-column: 10/13;
  grid-row: 1;
  background-color: #bfbfbf;
  padding: 3px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.balanceInnerBox {
  width: 100%;
  height: 100%;
  background-color: #464a44;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.balanceInnerBox .balance {
  width: 100%;
  height: 60%;
  margin: 0 auto;
  border-radius: 10px;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.balance .balance-title {
  color: #fff;
  font-size: 0.6rem;
  font-weight: 500;
}
.balance .balance-value {
  width: 97%;
  height: 60%;
  background: #000;
  border-radius: 25px;
  padding: 1px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.balance .balance-value span {
  color: #e2e2e2;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 1px;
}
.epochBox {
  width: 100%;
  height: 30%;
  background-color: #000000;
  border-radius: 5px 5px 10px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.epochBox .epoch {
  width: 33%;
  height: 100%;
  background-color: #0d5e69;
  border-radius: 0 0 0 8px;
  padding: 0 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.epochBox .epoch .epochNumber {
  color: #e4d54e;
  font-size: 0.8rem;
  font-weight: 500;
}
.slotBox {
  width: 66.6%;
  height: 100%;
  background-color: #1d1d1d;
  border-radius: 0 0 8px 0;
  padding: 0 2px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  color: #f4dc06;
  overflow: hidden;
}
.slotBox .firstNumber {
  color: #e4d54e;
  font-size: 0.8rem;
  font-weight: 500;
}
.slotBox .outOf {
  color: #e4d54e;
  font-size: 0.8rem;
  font-weight: 500;
}
.slotBox .secondNumber {
  color: #e4d54e;
  font-size: 0.8rem;
  font-weight: 500;
}
.slotBox .divider {
  background: #656565;
  width: 1px;
  height: 100%;
  margin: 0 5px;
}
.slotBox .slot {
  color: #e4d54e;
  font-size: 0.8rem;
  font-weight: 500;
}
.slotBox .slotNumber {
  color: #e4d54e;
  font-size: 0.8rem;
  font-weight: 500;
}
</style>
