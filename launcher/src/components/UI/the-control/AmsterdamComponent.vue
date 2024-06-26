<template>
  <div class="amsterdam-parent">
    <div
      class="icoTitle"
      @mouseenter="cursorLocation = `${footerInfo} ${currentNetwork?.name}`"
      @mouseleave="cursorLocation = ''"
    >
      <div class="icoContainer">
        <img :src="networkIcon" />
      </div>
      <span>{{ $t("controlPage.node") }}</span>
    </div>
    <div class="docBox">
      <div v-if="flag" class="box-wrapper">
        <div class="spinner-square">
          <div class="square-1 square"></div>
          <div class="square-2 square"></div>
          <div class="square-3 square"></div>
        </div>
      </div>
      <no-data
        v-else-if="
          consensusClientIsOff || prometheusIsOff || installedServicesController !== ''
        "
        :service-cat="
          installedServicesController !== ''
            ? 'install'
            : prometheusIsOff
            ? 'prometheus'
            : ''
        "
      />
      <div v-else class="box-wrapper">
        <div class="proposed-part">
          <div class="proposed-rows">
            <div
              v-for="(n, index) in proposedBlock"
              :key="index"
              class="proposed-square"
              :class="{
                white: n.slotStatus == 'pending',
                green: n.slotStatus == 'proposed',
                red: n.slotStatus == 'missed',
              }"
              @mouseenter="
                cursorLocation = `the current epoch: ${
                  currentResult.currentEpoch
                } and the slot number is ${n.slotNumber === 0 ? 'N/A' : n.slotNumber}`
              "
              @mouseleave="cursorLocation = ''"
            ></div>
          </div>
        </div>
        <div class="justified-part">
          <div class="Finalized-row">
            <div
              v-for="n in currentResult.justifiedEpochStatus[0]"
              :key="n"
              class="Finalized-square"
              :class="{
                white: n.slotStatus == 'pending',
                green: n.slotStatus == 'proposed',
                red: n.slotStatus == 'missed',
              }"
              @mouseenter="
                cursorLocation = `the justified epoch: ${currentResult.currentJustifiedEpoch} and the slot number is ${n.slotNumber}`
              "
              @mouseleave="cursorLocation = ''"
            ></div>
          </div>
          <div class="Finalized-row">
            <div
              v-for="n in currentResult.preJustifiedEpochStatus[0]"
              :key="n"
              class="Finalized-square"
              :class="{
                white: n.slotStatus == 'pending',
                green: n.slotStatus == 'proposed',
                red: n.slotStatus == 'missed',
              }"
              @mouseenter="
                cursorLocation = `the previous justified epoch: ${currentResult.previousJustifiedEpoch} and the slot number is ${n.slotNumber}`
              "
              @mouseleave="cursorLocation = ''"
            ></div>
          </div>
        </div>
        <div class="Finalized-part">
          <div class="Finalized-row">
            <div
              v-for="n in currentResult.finalizedEpochStatus[0]"
              :key="n"
              class="Finalized-square"
              :class="{
                white: n.slotStatus == 'pending',
                green: n.slotStatus == 'proposed',
                red: n.slotStatus == 'missed',
              }"
              @mouseenter="
                cursorLocation = `the Finalized epoch: ${currentResult.finalizedEpoch} and the slot number is ${n.slotNumber}`
              "
              @mouseleave="cursorLocation = ''"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapWritableState } from "pinia";
import { useNodeManage } from "@/store/nodeManage";
import { useFooter } from "@/store/theFooter";
import { useControlStore } from "@/store/theControl";
import { useServices } from "@/store/services";
import ControlService from "@/store/ControlService";
import NoData from "./NoData.vue";

export default {
  components: {
    NoData,
  },

  data() {
    return {
      showSyncInfo: false,
      counter: null,
      defaultIcon: "/animation/loading/mushroom-spinner.gif",
      days: null,
      date: "",
      pattern: [],
      footerInfo: this.$t("controlPage.netSel"),
      proposed: [],
      polling: {},
      loadingStrater: false,
      prometheusIsOff: false,
      consensusClientIsOff: false,
    };
  },
  computed: {
    ...mapState(useNodeManage, {
      currentNetwork: "currentNetwork",
    }),
    ...mapState(useServices, {
      installedServices: "installedServices",
      runningServices: "runningServices",
    }),
    ...mapWritableState(useFooter, {
      cursorLocation: "cursorLocation",
      isConsensusRunning: "isConsensusRunning",
      epoch: "epoch",
      slot: "slot",
      status: "status",
      installedServicesController: "installedServicesController",
    }),
    ...mapWritableState(useControlStore, {
      currentSlotData: "currentSlotData",
      currentEpochData: "currentEpochData",
      currentResult: "currentResult",
      noDataFlag: "noDataFlag",
      consensusName: "consensusName",
      pageNumber: "pageNumber",
    }),
    proposedBlock() {

      if (this.currentNetwork.id === 3) {

        return Array.from({ length: 16 }, () => ({
          slotNumber: 0,
          slotStatus: "pending",
        }));
      } else {
        return Array.from({ length: 32 }, () => ({
          slotNumber: 0,
          slotStatus: "pending",
        }));
      }
    },

    networkIcon() {
      return this.currentNetwork?.network ? this.currentNetwork?.icon : this.defaultIcon;
    },
    flag() {
      if (
        this.installedServicesController === "consensus" ||
        this.installedServicesController === "Prometheus" ||
        this.installedServicesController === "consensus and Prometheus"
      ) {
        return false;
      } else if (this.consensusClientIsOff === true) {
        return false;
      } else if (this.prometheusIsOff === true) {
        return false;
      } else if (this.currentResult === undefined) {
        return true;
      } else if (this.currentResult.beaconStatus === undefined) {
        return true;
      } else if (this.proposedBlock.every((item) => item.slotNumber === 0)) {
        return true;
      } else if (this.currentResult.beaconStatus !== 0) {
        return false;
      } else if (this.loadingStrater) {
        return true;
      }
      return false;
    },
  },

  watch: {
    installedServices() {
      this.serviceController(this.installedServices);
      this.serviceStateController(this.consensusName, "consensusClientIsOff");
      this.serviceStateController("prometheus", "prometheusIsOff");
    },
    pageNumber() {
      clearInterval(this.polling);
      this.loadingStrater = true;
      setTimeout(() => {
        this.refreshHandling(this.consensusName);
        this.loadingStrater = false;
      }, 3000);
    },
    currentResult: {
      handler(newResult) {
        if (
          newResult &&
          newResult.currentEpochStatus &&
          newResult.currentEpochStatus[0]
        ) {
          const newArray = newResult.currentEpochStatus[0]
            .slice(0, this.proposedBlock.length)
            .map((slot) => ({
              slotNumber: slot.slotNumber,
              slotStatus: slot.slotStatus,
            }));

          while (newArray.length < this.proposedBlock.length) {
            newArray.push({ slotNumber: 0, slotStatus: "pending" });
          }

          this.proposedBlock.splice(0, this.proposedBlock.length, ...newArray);
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.refreshTimer();
  },
  beforeUnmount() {
    clearInterval(this.polling);
  },
  methods: {
    serviceStateController(serviceName, stateProperty) {
      let isServiceOff = true; // Default to true, assuming the service is off

      for (let service of this.installedServices) {
        if (service.name.toLowerCase() === serviceName.toLowerCase()) {
          isServiceOff = service.state === "exited";
          break; // Exit the loop as we've found the service
        }
      }

      this[stateProperty] = isServiceOff;
    },
    serviceController(arr) {
      const foundCategories = new Set();
      let hasPrometheus = false;

      for (let obj of arr) {
        if (obj.category === "consensus" || obj.category === "execution") {
          foundCategories.add(obj.category);
        }
        if (obj.name === "Prometheus") {
          hasPrometheus = true;
        }
      }

      const categories = ["consensus", "execution"];
      const missingCategories = categories.filter(
        (category) => !foundCategories.has(category)
      );

      if (!hasPrometheus) {
        missingCategories.push("Prometheus");
      }

      this.installedServicesController = missingCategories
        .join(", ")
        .replace(/, (?=[^,]*$)/, " and ");
    },

    refreshTimer() {

      if (this.currentNetwork.id === 3) {

        this.polling = setInterval(() => {
          if (this.currentSlotData !== undefined && this.currentEpochData !== undefined) {
            this.currentEpochSlot(this.consensusName);
          }
        }, 5000);
      } else {
        this.polling = setInterval(() => {
          if (this.currentSlotData !== undefined && this.currentEpochData !== undefined) {
            this.currentEpochSlot(this.consensusName);
          }
        }, 12000);
      }
    },
    refreshHandling() {
      this.currentResult = {};
      clearInterval(this.polling);
      this.currentEpochSlot(this.consensusName);
    },

    initializeProposedBlock() {

      if (this.currentNetwork.id === 3) {

        return Array.from({ length: 16 }, () => ({
          slotNumber: 0,
          slotStatus: "pending",
        }));
      } else {
        return Array.from({ length: 32 }, () => ({
          slotNumber: 0,
          slotStatus: "pending",
        }));
      }
    },
    async currentEpochSlot() {
      try {
        let res = await ControlService.getCurrentEpochSlot(this.consensusName);
        if (res && res.currentSlot !== undefined && res.currentEpoch !== undefined) {
          this.currentSlotData = res.currentSlot;
          this.currentEpochData = res.currentEpoch;
          this.currentResult = res;
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    },
  },
};
//for test PR
</script>
<style scoped>
.box-wrapper {
  width: 100%;
  height: 95%;
  box-sizing: border-box;
  position: relative;
}
.amsterdam-parent {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-content: center;
  color: #c1c1c1;
  position: relative;
}
.icoTitle {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 30%;
  height: 100%;
}
.icoContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80%;
}
.icoContainer img {
  width: 70%;
}
.icoTitle span {
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 60%;
}
.docBox {
  width: 70%;
  height: 100%;
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.Finalized-part,
.proposed-part {
  width: 95%;
  height: 25%;
  border-radius: 0 0 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.justified-part {
  width: 95%;
  height: 50%;
  border-radius: 0 0 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.Finalized-row,
.proposed-rows {
  width: 100%;
  height: 80%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  font-size: 60%;
  font-weight: 600;
  text-transform: uppercase;
  margin-top: 1.5%;
  color: red;
}
.Finalized-square {
  width: 3%;
  height: 90%;
  margin: 0 0.5%;
  border-radius: 5px;
}
.proposed-square {
  width: 3%;
  height: 90%;
  margin: 0 0.5%;
  border-radius: 5px;
}
.Finalized-square:hover,
.proposed-square:hover {
  transform: scale(1.3);
}
.white {
  background: #c1c1c1;
}
.green {
  background: #568d50;
}
.red {
  background: #ff0000;
}

.spinner-square {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
}
.square {
  width: 5%;
  height: 40%;
  border-radius: 4px;
  margin-right: 5%;
}

.square-1 {
  animation: square-anim 1200ms 0s infinite;
}

.square-2 {
  animation: square-anim 1200ms 200ms infinite;
}

.square-3 {
  animation: square-anim 1200ms 400ms infinite;
}

@keyframes square-anim {
  0% {
    height: 40%;
    background-color: #336666;
  }
  20% {
    height: 40%;
  }
  40% {
    height: 80%;
    background-color: #478e8e;
  }
  80% {
    height: 40%;
  }
  100% {
    height: 40%;
    background-color: #336666;
  }
}
</style>
