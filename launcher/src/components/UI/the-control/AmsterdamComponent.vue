<template>
  <div class="amsterdam-parent">
    <div class="icoTitle">
      <div class="icoContainer">
        <img :src="networkIcon" />
      </div>
      <span>{{ $t("controlPage.node") }}</span>
    </div>
    <div class="docBox">
      <div
        class="line-squares"
        v-for="obj in array"
        :key="obj"
        :data-tooltip="obj.slot"
      >
        <div
          class="square"
          v-for="square in obj.bar"
          :key="square"
          :style="{ backgroundColor: getColor(square) }"
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
    array() {
      var array = [];
      for (var i = 1; i <= 5; i++) {
        var obj = {
          id: i,
          title: "epoch",
          slot: 12345,
          bar: Array(32).fill(0),
        };
        array.push(obj);
      }
      return array;
    },
  },

  methods: {
    getColor(number) {
      switch (number) {
        case 0:
          return "#707070";
        case 1:
          return "#74FA65";
        case 2:
          return "#FFD924";
        case 3:
          return "#FA831B";
        case 4:
          return "#EB5353";
      }
    },
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
.line-squares {
  width: 97%;
  height: 18%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.square {
  width: 1.9%;
  height: 30%;
}
</style>
