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
        class="containerSquare"
        v-for="item in items"
        :key="item"
        :data-tooltip="item"
      >
        <div
          v-for="(n, index) in 32"
          :key="index"
          class="square"
          :style="{
            background: index === item * 2 ? 'red' : 'green',
            '!important': index === item * 2,
          }"
        >
          {{ item * 32 * n }}
        </div>
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
      items: [
        [
          {
            id: 1,
            color: 0,
            column: 1,
          },
          {
            id: 2,
            color: 0,
            column: 2,
          },
          {
            id: 3,
            color: 0,
            column: 1,
          },
          {
            id: 4,
            color: 0,
            column: 1,
          },
          {
            id: 5,
            color: 0,
            column: 1,
          },
          {
            id: 6,
            color: 0,
            column: 1,
          },
          {
            id: 7,
            color: 0,
            column: 1,
          },
          {
            id: 8,
            color: 0,
            column: 1,
          },
          {
            id: 9,
            color: 0,
            column: 1,
          },
          {
            id: 10,
            color: 0,
            column: 1,
          },
          {
            id: 11,
            color: 0,
            column: 1,
          },
          {
            id: 12,
            color: 0,
            column: 1,
          },
          {
            id: 13,
            color: 0,
            column: 1,
          },
          {
            id: 14,
            color: 0,
            column: 1,
          },
          {
            id: 15,
            color: 0,
            column: 1,
          },
          {
            id: 16,
            color: 0,
            column: 1,
          },
          {
            id: 17,
            color: 0,
            column: 1,
          },
          {
            id: 18,
            color: 0,
            column: 1,
          },
          {
            id: 19,
            color: 0,
            column: 1,
          },
          {
            id: 20,
            color: 0,
            column: 1,
          },
          {
            id: 21,
            color: 0,
            column: 1,
          },
          {
            id: 22,
            color: 0,
            column: 1,
          },
          {
            id: 23,
            color: 0,
            column: 1,
          },
          {
            id: 24,
            color: 0,
            column: 1,
          },
          {
            id: 25,
            color: 0,
            column: 1,
          },
          {
            id: 26,
            color: 0,
            column: 1,
          },
          {
            id: 27,
            color: 0,
            column: 1,
          },
          {
            id: 28,
            color: 0,
            column: 1,
          },
          {
            id: 29,
            color: 0,
            column: 1,
          },
          {
            id: 30,
            color: 0,
            column: 1,
          },
          {
            id: 31,
            color: 0,
            column: 1,
          },
          {
            id: 32,
            color: 0,
            column: 1,
          },
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
  justify-content: flex-end;
  align-items: flex-end;
}
.containerSquare {
  display: flex;
  flex-wrap: nowrap;
  width: 95%;
  height: 20%;
  justify-content: space-between;
  align-items: center;
}

.square {
  width: 3px;
  height: 3px;
  background-color: green;
  color: transparent;
}
</style>
