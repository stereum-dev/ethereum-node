<template>
  <div class="balance-parent">
    <div class="finalized-box">
      <div class="finalized-value">{{ finalized_epoch }}</div>
      <div class="title">{{ $t("balWid.fin") }} EPOCH</div>
    </div>
    <div class="balance-box">
      <div class="balance-value">{{ balance }} GWei</div>
      <div class="title">{{ $t("balWid.bal") }}</div>
    </div>
  </div>
</template>
<script>
import { mapState } from "pinia";
import { useControlStore } from "@/store/theControl";
export default {
  data() {
    return {
      finalized_epoch: "Loading..",
      balance: 0,
    };
  },
  computed: {
    ...mapState(useControlStore, {
      balancestatus: "balancestatus",
    }),
  },

  watch: {
    balancestatus(newbalancestatus) {
      if (
        typeof newbalancestatus === "object" &&
        newbalancestatus.hasOwnProperty("finalized_epoch") &&
        newbalancestatus.hasOwnProperty("balance")
      ) {
        this.finalized_epoch = newbalancestatus.finalized_epoch;
        this.balance = this.numberFormat(newbalancestatus.balance);
      }
    },
  },
  methods: {
    numberFormat(x) {
      //return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
      return x.toLocaleString();
    },
  },
};
</script>
<style scoped>
.balance-parent {
  display: flex;
  width: 99%;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  height: 100%;
  color: #c1c1c1;
  position: relative;
  border: 1px solid #343434;
  box-shadow: 1px 1px 10px 1px #171717;
  border-radius: 10px;
  background: #2a2a2a;
}
.balance-parent:hover {
  background: #313131;
}
.balance-box,
.finalized-box {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: 50%;
  color: #eee;
  width: 50%;
  height: 100%;
  font-weight: 600;
}
.title {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 100%;
  color: #eee;
  width: 100%;
  height: 50%;
}
.finalized-value,
.balance-value {
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  font-size: 100%;
  width: 100%;
  height: 50%;
}
.balance-value {
  color: #74fa65;
}
</style>
