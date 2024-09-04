<template>
  <div class="balance-parent">
    <NoData v-if="isConsensusMissing" />
    <div v-else class="wrapper">
      <div class="finalized-box">
        <div class="finalized-value" @mouseenter="cursorLocation = `${finEPOCH} `" @mouseleave="cursorLocation = ''">
          {{ finalized_epoch }}
        </div>
        <div class="title">{{ $t("balWid.fin") }} EPOCH</div>
      </div>
      <div class="balance-box">
        <div class="balance-value" :style="{ color: balance < 0 ? '#EC590A' : '#74fa65' }">{{ fmtBalance }} GWei</div>
        <div class="title">{{ $t("balWid.bal") }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import NoData from "./NoData.vue";
import { mapWritableState } from "pinia";
import { useFooter } from "@/store/theFooter";
import { mapState } from "pinia";
import { useControlStore } from "@/store/theControl";
export default {
  components: {
    NoData,
  },
  data() {
    return {
      finalized_epoch: "Loading..",
      balance: 0,
      fmtBalance: 0,
      finEPOCH: this.$t("controlPage.finEPOCH"),
    };
  },
  computed: {
    ...mapState(useControlStore, {
      balancestatus: "balancestatus",
      noDataFlag: "noDataFlag",
    }),
    ...mapWritableState(useFooter, {
      cursorLocation: "cursorLocation",
      installedServicesController: "installedServicesController",
      missingServices: "missingServices",
    }),
    isConsensusMissing() {
      return this.missingServices?.includes("consensus");
    },
  },

  watch: {
    balancestatus(newbalancestatus) {
      if (
        typeof newbalancestatus === "object" &&
        newbalancestatus.hasOwnProperty("finalized_epoch") &&
        newbalancestatus.hasOwnProperty("balance")
      ) {
        this.finalized_epoch = newbalancestatus.finalized_epoch;
        this.balance = newbalancestatus.balance;
        this.fmtBalance = this.numberFormat(newbalancestatus.balance);
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
.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.balance-parent {
  display: flex;
  width: 100%;
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
  font-size: 180%;
  width: 100%;
  height: 50%;
}
</style>
