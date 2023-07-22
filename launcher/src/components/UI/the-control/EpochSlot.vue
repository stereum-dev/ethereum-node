<template>
  <div class="epockSlot_parent">
    <!-- <commingSoon /> -->
    <div v-if="flag" class="wrapper">
      {{ beaconControler }}
    </div>
    <div v-else class="wrapper">
      <div class="epoch-box">
        <div class="box_value">{{ currentResult.currentEpoch }}</div>
        <div class="box_title">Current EPOCH</div>
      </div>
      <div class="slot-box">
        <div class="box_value">{{ currentResult.currentSlot }}</div>
        <div class="box_title">Current SLOT</div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "pinia";
import { useNodeManage } from "@/store/nodeManage";
import ControlService from "@/store/ControlService";
export default {
  data() {
    return {
      currentResult: {},
      message: false,
    };
  },
  computed: {
    ...mapState(useNodeManage, {
      currentNetwork: "currentNetwork",
    }),
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
      if (this.currentResult === undefined) {
        return true;
      } else if (this.currentResult.beaconStatus === undefined) {
        return true;
      } else if (this.currentResult.beaconStatus !== 0) {
        return true;
      }
      return false;
    },
  },
  mounted() {
    this.timeCalc();
  },
  methods: {
    async currentEpochSlot() {
      let res = await ControlService.getCurrentEpochSlot();
      this.currentResult = res;
    },
    timeCalc() {
      if (this.currentNetwork.id === 4) {
        setInterval(() => {
          this.currentEpochSlot();
        }, 5000);
      } else {
        setInterval(() => {
          this.currentEpochSlot();
        }, 12000);
      }
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
