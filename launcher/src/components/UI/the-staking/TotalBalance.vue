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
          <span class="epochText">Epoch</span>
          <span class="epochNumber">155906</span>
        </div>
        <div class="slotBox">
          <span class="firstNumber">16#</span>
          <span class="outOf">out of</span>
          <span class="secondNumber">32#</span>
          <span class="divider"></span>
          <span class="slot">Slot</span>
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
  justify-content: flex-start;
  align-items: center;
}
.balanceInnerBox {
  width: 100%;
  height: 100%;
  background-color: #464a44;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
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
  height: 50%;
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
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 1px;
}
.epochBox {
  width: 100%;
  height: 40%;
  background-color: #000000;
  border: 2px solid #f9f8f8;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.epochBox .epoch {
  width: 33%;
  height: 100%;
  background-color: #0d5e69;
  border-radius: 3px 0 0 3px;
  padding: 0 3px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
}
.epochBox .epoch .epochText {
  color: #f4dc06;
  font-size: 0.6rem;
  font-weight: 600;
}
.epochBox .epoch .epochNumber {
  color: #f4dc06;
  font-size: 0.6rem;
  font-weight: 700;
}
.slotBox {
  width: 66.6%;
  height: 100%;
  background-color: #1d1d1d;
  border-radius: 5px;
  padding: 0 2px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  color: #f4dc06;
  overflow: hidden;
}
.slotBox .firstNumber {
  font-size: 0.6rem;
  font-weight: 700;
}
.slotBox .outOf {
  font-size: 0.6rem;
  font-weight: 700;
}
.slotBox .secondNumber {
  font-size: 0.6rem;
  font-weight: 700;
}
.slotBox .divider {
  background: #f4dc06;
  width: 1px;
  height: 100%;
  margin: 0 5px;
}
.slotBox .slot {
  font-size: 0.6rem;
  font-weight: 700;
}
.slotBox .slotNumber {
  font-size: 0.6rem;
  font-weight: 700;
}
</style>
