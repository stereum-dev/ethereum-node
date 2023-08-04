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
      <div class="proposed-part">
        <div class="proposed-rows-title">
          <span>proposed</span>
        </div>
        <div class="proposed-rows">
          <div
            v-for="n in proposed"
            :key="n"
            class="proposed-square"
            :class="{ white: n == 0, blue: n != 0 }"
            @mouseenter="cursorLocation = `the current epoch: ${currentEpochData} and the slot number is ${n}`"
            @mouseleave="cursorLocation = ''"
          ></div>
        </div>
      </div>
      <div class="justfied-part">
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
            @mouseenter="cursorLocation = `the justfied epoch: ${currentEpochData} and the slot number is ${n}`"
            @mouseleave="cursorLocation = ''"
          ></div>
        </div>
      </div>
      <div class="finilized-part">
        <div class="finilized-row-title"><span>finalized</span></div>
        <div class="finilized-row"><div v-for="n in 32" :key="n" class="finilized-square"></div></div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "pinia";
import { useNodeManage } from "@/store/nodeManage";
import { mapWritableState } from "pinia";
import { useFooter } from "@/store/theFooter";
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

      currentSlotData: null,
      currentEpochData: null,
      proposed: [],
      justifiedStart: 0,
      justified: [],
    };
  },
  computed: {
    ...mapState(useNodeManage, {
      currentNetwork: "currentNetwork",
    }),
    ...mapWritableState(useFooter, {
      cursorLocation: "cursorLocation",
    }),
    networkIcon() {
      return this.currentNetwork.network ? this.currentNetwork.icon : this.defaultIcon;
    },
  },
  watch: {
    currentSlotData: "updateResultArray",
    currentEpochData: "updateResultArray",
    justifiedStart: {
      handler(justifiedBegin) {
        this.justified = new Array(32).fill(0).map((_, index) => justifiedBegin + index);
      },
      immediate: true,
    },
  },
  mounted() {
    this.currentEpochSlot();
    setInterval(() => {
      this.currentEpochSlot();
    }, 10000);
  },
  methods: {
    async currentEpochSlot() {
      let res = await ControlService.getCurrentEpochSlot();
      this.currentSlotData = res.currentSlot;
      this.currentEpochData = res.currentEpoch;
    },
    updateResultArray() {
      const arraySize = 32;
      const resultArray = new Array(arraySize).fill(0);
      this.proposed = [];

      if (this.currentSlotData !== null && this.currentEpochData !== null) {
        const index = (((this.currentSlotData - this.currentEpochData * 32) % arraySize) + arraySize) % arraySize;

        for (let i = 0; i <= index; i++) {
          resultArray[(index - i + arraySize) % arraySize] = this.currentSlotData - i;
        }
      }
      this.justifiedStart = resultArray[0] - 32;
      this.proposed.push(...resultArray);
    },
  },
};
</script>
<style scoped>
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
  height: 25%;

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
  height: 40%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 50%;
  font-weight: 700;
  text-transform: uppercase;
  margin: 1% 0;
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
}
.finilized-square {
  width: 3%;
  height: 95%;
  margin: 0 0.5%;
  background: #94deff;
}
.proposed-square {
  width: 3%;
  height: 90%;
  margin: 0 0.5%;
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
  margin: 0 0.5%;

  background: #94deff;
}
</style>
