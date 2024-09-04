<template>
  <div class="epockSlot_parent">
    <NoData v-if="isConsensusMissing || isConsensusRunning" />
    <div v-else-if="flag" class="wrapper">
      {{ beaconControler }}
    </div>

    <div v-else class="wrapper">
      <div class="epoch-box">
        <div class="box_value">{{ currentResult.currentEpoch }}</div>
        <div class="box_title">{{ $t("controlPage.currentEpoch") }}</div>
      </div>
      <div class="slot-box">
        <div class="box_value">{{ currentResult.currentSlot }}</div>
        <div class="box_title">{{ $t("controlPage.currentSlot") }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import NoData from "./NoData.vue";
import { mapState, mapWritableState } from "pinia";
import { useControlStore } from "@/store/theControl";
import { useNodeManage } from "@/store/nodeManage";
import { useFooter } from "@/store/theFooter";

export default {
  components: {
    NoData,
  },
  data() {
    return {
      message: false,
    };
  },
  computed: {
    ...mapState(useNodeManage, {
      currentNetwork: "currentNetwork",
    }),
    ...mapWritableState(useControlStore, {
      currentSlotData: "currentSlotData",
      currentEpochData: "currentEpochData",
      currentResult: "currentResult",
      balancestatus: "balancestatus",
      noDataFlag: "noDataFlag",
    }),
    ...mapWritableState(useFooter, {
      installedServicesController: "installedServicesController",
      missingServices: "missingServices",
      nodataMessage: "nodataMessage",
    }),
    isConsensusMissing() {
      return this.missingServices?.includes("consensus");
    },
    beaconControler() {
      if (this.currentResult === undefined) {
        return "Checking Beacon Status...";
      } else if (this.currentResult.beaconStatus === undefined) {
        return "Checking Beacon Status...";
      } else if (this.currentResult.beaconStatus !== 0) {
        return "No Running Beacon Node!";
      }
      return "Loading...";
    },
    flag() {
      if (this.currentResult === undefined || this.currentResult.beaconStatus === undefined || this.currentResult.beaconStatus !== 0) {
        return true;
      }

      return false;
    },
  },
};
</script>
<style scoped>
.wrapper {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
}
.epockSlot_parent {
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
.epockSlot_parent:hover {
  background: #313131;
}
.epoch-box,
.slot-box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 90%;
  font-size: 70%;
  font-weight: 600;
  flex-direction: column;
}
.box_title,
.box_value {
  width: 100%;
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.box_title {
  font-size: 80%;
  font-weight: 600;
}
.box_value {
  font-size: 120%;
  font-weight: 700;
}
</style>
