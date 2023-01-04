<template>
  <div class="amsterdamparent">
    <div class="icoTitle">
      <div class="icoContainer">
        <img :src="networkIcon" />
      </div>
      <span>{{ $t("controlPage.node") }}</span>
    </div>
    <div class="docBox">
      <div
        class="line-squares"
        v-for="(row, index) in rows"
        :key="index"
        :data-tooltip="index"
      >
        <div
          class="square"
          v-for="square in row"
          :key="square.id"
          :style="{ backgroundColor: square.color }"
        ></div>
      </div>
    </div>
  </div>
</template>
<script>
import SyncInfo from "./SyncInfo.vue";
import { mapState } from "pinia";
import { useServices } from "@/store/services";
export default {
  components: { SyncInfo },
  data() {
    return {
      showSyncInfo: false,
      counter: null,
      networkIcon: "",
      mainnetIcon: "/img/icon/control/mainnetIconControl.png",
      testnetIcon: "/img/icon/control/testnetIconControl.png",
      days: null,
      date: "",
      rows: [
        [
          { id: 1, color: "#eee" },
          { id: 2, color: "#eee" },
          { id: 3, color: "#eee" },
          { id: 4, color: "#eee" },
          { id: 5, color: "#eee" },
          { id: 6, color: "#eee" },
          { id: 7, color: "#eee" },
          { id: 8, color: "#eee" },
          { id: 9, color: "#eee" },
          { id: 10, color: "#eee" },
          { id: 11, color: "#eee" },
          { id: 12, color: "#eee" },
          { id: 13, color: "#eee" },
          { id: 14, color: "#eee" },
          { id: 15, color: "#eee" },
          { id: 16, color: "#eee" },
          { id: 17, color: "#eee" },
          { id: 18, color: "#eee" },
          { id: 19, color: "#eee" },
          { id: 20, color: "#eee" },
          { id: 21, color: "#eee" },
          { id: 22, color: "#eee" },
          { id: 23, color: "#eee" },
          { id: 24, color: "#eee" },
          { id: 25, color: "#eee" },
          { id: 26, color: "#eee" },
          { id: 27, color: "#eee" },
          { id: 28, color: "#eee" },
          { id: 29, color: "#eee" },
          { id: 30, color: "#eee" },
          { id: 31, color: "#eee" },
          { id: 32, color: "#eee" },
        ],
        [
          { id: 33, color: "#eee" },
          { id: 34, color: "#eee" },
          { id: 35, color: "#eee" },
          { id: 36, color: "#eee" },
          { id: 37, color: "#eee" },
          { id: 38, color: "#eee" },
          { id: 39, color: "#eee" },
          { id: 40, color: "#eee" },
          { id: 41, color: "#eee" },
          { id: 42, color: "#eee" },
          { id: 43, color: "#eee" },
          { id: 44, color: "#eee" },
          { id: 45, color: "#eee" },
          { id: 46, color: "#eee" },
          { id: 47, color: "#eee" },
          { id: 48, color: "#eee" },
          { id: 49, color: "#eee" },
          { id: 50, color: "#eee" },
          { id: 51, color: "#eee" },
          { id: 52, color: "#eee" },
          { id: 53, color: "#eee" },
          { id: 54, color: "#eee" },
          { id: 55, color: "#eee" },
          { id: 56, color: "#eee" },
          { id: 57, color: "#eee" },
          { id: 58, color: "#eee" },
          { id: 59, color: "#eee" },
          { id: 60, color: "#eee" },
          { id: 61, color: "#eee" },
          { id: 62, color: "#eee" },
          { id: 63, color: "#eee" },
          { id: 64, color: "#eee" },
        ],
        [
          { id: 65, color: "#eee" },
          { id: 66, color: "#eee" },
          { id: 67, color: "#eee" },
          { id: 68, color: "#eee" },
          { id: 69, color: "#eee" },
          { id: 70, color: "#eee" },
          { id: 71, color: "#eee" },
          { id: 72, color: "#eee" },
          { id: 73, color: "#eee" },
          { id: 74, color: "#eee" },
          { id: 75, color: "#eee" },
          { id: 76, color: "#eee" },
          { id: 77, color: "#eee" },
          { id: 78, color: "#eee" },
          { id: 79, color: "#eee" },
          { id: 80, color: "#eee" },
          { id: 81, color: "#eee" },
          { id: 82, color: "#eee" },
          { id: 83, color: "#eee" },
          { id: 84, color: "#eee" },
          { id: 85, color: "#eee" },
          { id: 86, color: "#eee" },
          { id: 87, color: "#eee" },
          { id: 88, color: "#eee" },
          { id: 89, color: "#eee" },
          { id: 90, color: "#eee" },
          { id: 91, color: "#eee" },
          { id: 92, color: "#eee" },
          { id: 93, color: "#eee" },
          { id: 94, color: "#eee" },
          { id: 95, color: "#eee" },
          { id: 96, color: "#eee" },
        ],
        [
          { id: 97, color: "#eee" },
          { id: 98, color: "#eee" },
          { id: 99, color: "#eee" },
          { id: 100, color: "#eee" },
          { id: 101, color: "#eee" },
          { id: 102, color: "#eee" },
          { id: 103, color: "#eee" },
          { id: 104, color: "#eee" },
          { id: 105, color: "#eee" },
          { id: 106, color: "#eee" },
          { id: 107, color: "#eee" },
          { id: 108, color: "#eee" },
          { id: 109, color: "#eee" },
          { id: 110, color: "#eee" },
          { id: 111, color: "#eee" },
          { id: 112, color: "#eee" },
          { id: 113, color: "#eee" },
          { id: 114, color: "#eee" },
          { id: 115, color: "#eee" },
          { id: 116, color: "#eee" },
          { id: 117, color: "#eee" },
          { id: 118, color: "#eee" },
          { id: 119, color: "#eee" },
          { id: 120, color: "#eee" },
          { id: 121, color: "#eee" },
          { id: 122, color: "#eee" },
          { id: 123, color: "#eee" },
          { id: 124, color: "#eee" },
          { id: 125, color: "#eee" },
          { id: 126, color: "#eee" },
          { id: 127, color: "#eee" },
          { id: 128, color: "#eee" },
        ],
        [
          { id: 129, color: "#eee" },
          { id: 130, color: "#eee" },
          { id: 131, color: "#eee" },
          { id: 132, color: "#eee" },
          { id: 133, color: "#eee" },
          { id: 134, color: "#eee" },
          { id: 135, color: "#eee" },
          { id: 136, color: "#eee" },
          { id: 137, color: "#eee" },
          { id: 138, color: "#eee" },
          { id: 139, color: "#eee" },
          { id: 140, color: "#eee" },
          { id: 141, color: "#eee" },
          { id: 142, color: "#eee" },
          { id: 143, color: "#eee" },
          { id: 144, color: "#eee" },
          { id: 145, color: "#eee" },
          { id: 146, color: "#eee" },
          { id: 147, color: "#eee" },
          { id: 148, color: "#eee" },
          { id: 149, color: "#eee" },
          { id: 150, color: "#eee" },
          { id: 151, color: "#eee" },
          { id: 152, color: "#eee" },
          { id: 153, color: "#eee" },
          { id: 154, color: "#eee" },
          { id: 155, color: "#eee" },
          { id: 156, color: "#eee" },
          { id: 157, color: "#eee" },
          { id: 158, color: "#eee" },
          { id: 159, color: "#eee" },
          { id: 160, color: "#eee" },
        ],
      ],
    };
  },

  mounted() {
    if (this.network === "mainnet") {
      this.networkIcon = this.mainnetIcon;
    } else {
      this.networkIcon = this.testnetIcon;
    }
  },
  computed: {
    ...mapState(useServices, {
      network: "network",
    }),
  },
};
</script>
<style scoped>
* {
  box-sizing: border-box;
}

[data-tooltip] {
  position: relative;
  cursor: default;
}
[data-tooltip]::after {
  position: absolute;
  width: max-content;
  left: calc(50%-25%);

  text-align: center;
  content: attr(data-tooltip);
  color: #eee;
  background: black;
  border-radius: 5px;
  font-size: 70%;
  padding: 2% 3%;
  border: 1px solid #929292;
  text-transform: uppercase;
  visibility: hidden;
  opacity: 0;
  transform: translateY(20%);
  transition: opacity 0.3s transform 0.2s;
}
[data-tooltip]:hover::after {
  opacity: 1;
  visibility: visible;
  transform: rotateY(0);
}
.serviceName {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  flex-direction: column;
}
.serviceName_val {
  display: flex;
  width: 100%;
  height: 50%;
  justify-content: space-between;
  align-items: center;
  font-size: 80%;
}
.serviceName-row {
  display: flex;
  width: 25%;
  justify-items: center;
  align-items: center;
}
.serviceName-greenRow,
.serviceName-blueRow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 70%;
  font-weight: bold;
}
.serviceName-greenRow {
  color: #5ed966;
}
.serviceName-blueRow {
  color: #4dfff3;
}
.amsterdamparent {
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
.line-squares {
  width: 97%;
  height: 18%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.square {
  background: #4dfff3;
  width: 1.9%;
  height: 30%;
}
</style>
