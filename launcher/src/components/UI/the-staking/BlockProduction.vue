<template>
  <div class="sync_box divide-y divide-gray-600">
    <!-- <div class="totalBox">
      <div class="totalTitle">
        <span>total</span>
      </div>
      <div class="totalValue">
        <span>0/0</span>
      </div>
    </div> -->
    <div class="statusBox">
      <div class="status">
        <div class="statusTitle">
          <span>STATUS</span>
        </div>
        <div class="statusValue">
          <div class="assignValue">
            <span v-if="stats.currentProp !== 0" class="isOnline">Assigned Slot</span>
            <span v-else>Not Assigned</span>
          </div>
          <div class="slotValue">
            <span v-if="stats.currentProp !== 0">{{ stats.attestationSlot }}</span>
            <span v-else class="isOffline">---</span>
          </div>
        </div>
      </div>
    </div>
    <div class="statusTiming">
      <p v-if="stats.currentProp !== 0">
        Next Block Proposal in: <span>{{ stats.currentProp - stats.currentSlot * 12 }}</span>
      </p>
      <p v-else>Next Block Proposal in: <span>??</span></p>
    </div>
  </div>
</template>

<script>
import { mapWritableState } from "pinia";
import { useStakingStore } from "@/store/theStaking";
export default {
  data() {
    return {
      blockIsOnline: true,
    };
  },
  computed: {
    ...mapWritableState(useStakingStore, {
      keys: "keys",
      stats: "stats",
    }),
  },
};
</script>

<style scoped>
.sync_box {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  height: 100%;
}
.totalBox {
  width: 100%;
  height: 25%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.statusBox {
  width: 100%;
  height: 55%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.statusBox .status {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr, 2fr;
  grid-template-rows: repeat(4, 1fr);
}
.statusTitle {
  grid-column: 1/2;
  grid-row: 2/4;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.statusTitle span {
  color: #efefef;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: center;
  text-transform: capitalize;
}
.statusValue {
  grid-column: 2/3;
  grid-row: 2/4;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.statusValue .assignValue,
.statusValue .slotValue {
  width: 100%;
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.statusValue .assignValue span {
  color: #e1e1e1;
  font-size: 0.6rem;
  font-weight: 600;
  text-align: center;
  text-transform: uppercase;
}
.statusValue .assignValue .isOnline {
  color: #58c024;
  font-size: 0.6rem;
  font-weight: 600;
  text-align: center;
  text-transform: uppercase;
}
.statusValue .slotValue span {
  color: #efdd55;
  font-size: 0.8rem;
  font-weight: 600;
  text-align: center;
  text-transform: uppercase;
}
.statusValue .slotValue .isOffline {
  color: #f1f0ef;
  font-size: 0.8rem;
  font-weight: 600;
  text-align: center;
  letter-spacing: 2px;
}

.totalTitle {
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 5px 0 0 5px;
}
.totalTitle span,
.startTitle span,
.endTitle span {
  color: #efefef;
  font-size: 0.6rem;
  font-weight: 600;
  text-align: center;
  text-transform: capitalize;
}
.totalValue {
  width: 50%;
  height: 100%;
  padding: 0 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 0 0 0;
}
.totalValue span {
  color: #e1e1e1;
  font-size: 0.6rem;
  font-weight: 600;
  text-transform: uppercase;
  overflow: hidden;
}

.status,
.startEpoch,
.endEpoch {
  width: 100%;
  height: 30%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.startValue,
.endValue {
  width: 50%;
  height: 95%;
  padding: 3px 3px 0 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #171717;
  border: 1px solid #9e9e9e;
  border-radius: 3px;
}
.startValue span,
.endValue span {
  color: #efd96bdf;
  font-size: 0.6rem;
  font-weight: 600;
  text-align: center;
  overflow: hidden;
}
.statusTiming {
  width: 100%;
  height: 25%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
}
.statusTiming p {
  color: #eeeeee;
  font-size: 0.5rem;
  font-weight: 600;
  text-align: right;
  text-transform: capitalize;
}
.statusTiming p span {
  color: #efd96bdf;
  font-size: 0.5rem;
  font-weight: 600;
  text-align: center;
  text-transform: capitalize;
}
</style>
