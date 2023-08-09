<template>
  <div class="amsterdam-parent">
    <div
      class="icoTitle"
      @mouseenter="cursorLocation = `${footerInfo} ${currentNetwork.name}`"
      @mouseleave="cursorLocation = ''"
    >
      <div class="icoContainer">
        <img :src="networkIcon" />
      </div>
      <span>{{ $t("controlPage.node") }}</span>
    </div>
    <div class="docBox">
      <div v-if="proposed.length === 0" class="box-wrapper">
        <div class="spinner-square">
          <div class="square-1 square"></div>
          <div class="square-2 square"></div>
          <div class="square-3 square"></div>
        </div>
      </div>
      <div v-else class="box-wrapper">
        <div class="proposed-part">
          <div class="proposed-rows-title">
            <span>current justified </span>
          </div>

          <div class="wrapper">
            <div class="proposed-rows">
              <div
                v-for="n in proposed"
                :key="n"
                class="proposed-square"
                :class="{ white: n == 0, blue: n != 0 }"
                @mouseenter="
                  cursorLocation = `the current epoch: ${currentEpochData} and the slot number is ${
                    n != 0 ? n : 'null'
                  }`
                "
                @mouseleave="cursorLocation = ''"
              ></div>
            </div>
          </div>
        </div>
        <!-- <div class="justfied-part">
        <div class="justfied-rows">
          <span>justified</span>
        </div>
        <div class="justfied-rows">
          <div
            v-for="n in justified"
            :key="n"
            class="square"
            @mouseenter="cursorLocation = `the justfied epoch: ${currentEpochData} and the slot number is ${n}`"
            @mouseleave="cursorLocation = ''"
          ></div>
        </div>
        <div class="justfied-rows">
          <div
            v-for="n in justified"
            :key="n"
            class="square"
            @mouseenter="cursorLocation = `the justfied epoch: ${currentEpochData - 1} and the slot number is ${n}`"
            @mouseleave="cursorLocation = ''"
          ></div>
        </div>
      </div> -->
        <div class="finilized-part">
          <div class="finilized-row-title"><span>finalized</span></div>
          <div class="wrapper">
            <div class="finilized-row">
              <div
                v-for="n in finalized"
                :key="n"
                class="finilized-square"
                @mouseenter="
                  cursorLocation = `the finilized epoch: ${currentEpochData - 1} and the slot number is ${n}`
                "
                @mouseleave="cursorLocation = ''"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "pinia";
import { useNodeManage } from "@/store/nodeManage";
import { mapWritableState } from "pinia";
import { useFooter } from "@/store/theFooter";
import { useControlStore } from "@/store/theControl";
import ControlService from "@/store/ControlService";
export default {
  data() {
    return {
      showSyncInfo: false,
      counter: null,
      defaultIcon: "/img/icon/control/spinner.gif",
      days: null,
      date: "",
      pattern: [],
      footerInfo: this.$t("controlPage.netSel"),
      proposed: [],
      justifiedStart: 0,
      justified: [],
      finalizedStart: [],
      finalized: [],
    };
  },
  computed: {
    ...mapState(useNodeManage, {
      currentNetwork: "currentNetwork",
    }),
    ...mapWritableState(useFooter, {
      cursorLocation: "cursorLocation",
    }),
    ...mapWritableState(useControlStore, {
      currentSlotData: "currentSlotData",
      currentEpochData: "currentEpochData",
      currentResult: "currentResult",
    }),
    networkIcon() {
      return this.currentNetwork.network ? this.currentNetwork.icon : this.defaultIcon;
    },
  },
  watch: {
    currentSlotData: "updateEpoch",
    currentEpochData: "updateEpoch",
    // justifiedStart: {
    //   handler(justifiedBegin) {
    //     this.justified = new Array(32).fill(0).map((_, index) => justifiedBegin + index);
    //   },
    //   immediate: true,
    // },
    // justifiedStart: {
    //   handler(justifiedBegin) {
    //     this.epochUpdater(justifiedBegin, "justified");
    //   },
    //   immediate: true,
    // },
    finalizedStart: {
      handler(finalizedBegin) {
        this.epochUpdater(finalizedBegin, "finalized");
      },
      immediate: true,
    },
  },
  mounted() {
    if (this.currentNetwork.id === 4) {
      setInterval(() => {
        if (this.currentSlotData !== undefined && this.currentEpochData !== undefined) {
          this.currentEpochSlot();
        }
      }, 5000);
    } else {
      setInterval(() => {
        if (this.currentSlotData !== undefined && this.currentEpochData !== undefined) {
          this.currentEpochSlot();
        }
      }, 12000);
    }
  },
  methods: {
    async currentEpochSlot() {
      try {
        let res = await ControlService.getCurrentEpochSlot();

        if (res && res.currentSlot !== undefined && res.currentEpoch !== undefined) {
          this.currentSlotData = res.currentSlot;
          this.currentEpochData = res.currentEpoch;
          this.currentResult = res;
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    },
    updateEpoch() {
      const arraySize = this.currentNetwork.id === 4 ? 16 : 32;
      const resultArray = new Array(arraySize).fill(0);
      this.proposed = [];

      if (this.currentSlotData !== null && this.currentEpochData !== null) {
        const index =
          (((this.currentSlotData - this.currentEpochData * arraySize) % arraySize) + arraySize) % arraySize;
        for (let i = 0; i <= index; i++) {
          resultArray[(index - i + arraySize) % arraySize] = this.currentSlotData - i;
        }
      }
      // this.justifiedStart = resultArray[0] - 33;
      this.finalizedStart = resultArray[0] - (arraySize + 1);
      this.proposed.push(...resultArray);
    },
    epochUpdater(newValue, arrayName) {
      const arraySize = this.currentNetwork.id === 4 ? 16 : 32;
      const newArray = new Array(arraySize).fill(0).map((_, index) => newValue + index + 1);
      this[arrayName] = newArray;
    },
  },
};
</script>
<style scoped>
.wrapper {
  width: 100%;
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.box-wrapper {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
.amsterdam-parent {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-content: center;
  color: #c1c1c1;
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
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  border-radius: 0 10px 10px 0;
}

.justfied-part {
  width: 95%;
  height: 45%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border-top: 1px solid #c1c1c1;
}
.justfied-rows {
  width: 100%;
  height: 30%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.justfied-rows span {
  margin-left: 2.5%;
  font-size: 45%;
  font-weight: 700;
  text-transform: uppercase;
}
.finilized-part,
.proposed-part {
  width: 95%;
  height: 48%;

  border-radius: 0 0 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding-top: 1%;
}
.proposed-part {
  margin-bottom: 1%;
}
.finilized-part {
  border-top: 1px solid #c1c1c1;
}
.finilized-row-title,
.proposed-rows-title {
  width: 95%;
  height: 20%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 50%;
  font-weight: 700;
  text-transform: uppercase;
  margin: 0.5% 0;
}
.finilized-row,
.proposed-rows {
  width: 100%;
  height: 60%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  font-size: 60%;
  font-weight: 600;
  text-transform: uppercase;
  margin-top: 1.5%;
  color: red;
}
.finilized-square {
  width: 3%;
  height: 95%;
  margin: 0 0.5%;
  background: #94deff;
  border-radius: 5px;
}
.proposed-square {
  width: 3%;
  height: 90%;
  margin: 0 0.5%;
  border-radius: 5px;
}
.finilized-square:hover,
.proposed-square:hover {
  transform: scale(1.3);
}
.white {
  background: #c1c1c1;
}
.blue {
  background: #94deff;
}
.square {
  width: 23%;
  height: 40%;
  margin: 0 2.5%;

  background: #94deff;
}
/*test the load Bar*/
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
/*end of the test*/
</style>
