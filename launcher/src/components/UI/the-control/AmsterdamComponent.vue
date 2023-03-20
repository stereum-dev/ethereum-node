<template>
  <div class="amsterdam-parent">
    <div class="icoTitle">
      <div class="icoContainer">
        <img :src="networkIcon" />
      </div>
      <span>{{ $t("controlPage.node") }}</span>
    </div>
    <div class="docBox">
      <comming-soon></comming-soon>
      <div v-for="obj in pattern" :key="obj" class="line-squares no-events" :data-tooltip="'EPOCH: ' + obj.slot">
        <div
          v-for="square in obj.bar"
          :key="square"
          class="square"
          :style="{ backgroundColor: getColor(square) }"
        ></div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "pinia";
import { useServices } from "@/store/services";
export default {
  data() {
    return {
      showSyncInfo: false,
      counter: null,
      networkIcon: "",
      mainnetIcon: "/img/icon/click-installation/mainnet-icon.png",
      testnetIcon: "/img/icon/click-installation/testnet-icon.png",
      gnosisIcon: "/img/icon/click-installation/gnosis_mainnet_icon.png",
      defaultIcon: "/img/icon/control/spinner.gif",
      days: null,
      date: "",
      pattern: [],
    };
  },
  computed: {
    ...mapState(useServices, {
      network: "network",
    }),
  },

  mounted() {
    if (this.network === "mainnet") {
      this.networkIcon = this.mainnetIcon;
    } else if (this.network === "testnet") {
      this.networkIcon = this.testnetIcon;
    } else if (this.network === "gnosis") {
      this.networkIcon = this.gnosisIcon;
    } else {
      this.networkIcon = this.defaultIcon;
    }
  },

  created() {
    // Add initial objects to the array
    for (let i = 0; i < 5; i++) {
      this.epochMonitoring();
    }

    // Call the addObject() function every sec
    setInterval(() => {
      this.epochMonitoring();
    }, 1000);
  },
  methods: {
    epochMonitoring() {
      // Create a new object an it can wire, the stracture has to be like this
      //stracture started
      const newObj = {
        id: 1,
        title: "epoch",
        // slot: 12345,
        // bar: Array(32).fill(0),
        //the random just for showing the functionality is and tha last comment are the true pattern
        slot: Math.floor(Math.random() * 100000),
        bar: Array(32)
          .fill(0)
          .map(() => Math.floor(Math.random() * 5)),
      };
      // end of stracture

      // Add the new object to the beginning of the array
      this.pattern.unshift(newObj);

      // If the array has more than 5 objects, remove the last one
      if (this.pattern.length > 5) {
        this.pattern.pop();
      }

      // Update the ids of the remaining objects
      this.pattern.forEach((obj, index) => {
        obj.id = index + 1;
      });
    },
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
.no-events {
  pointer-events: none;
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
  position: relative;
}
.line-squares {
  width: 100%;
  height: 20%;
  justify-content: center;
  align-items: center;
  display: flex;
}
.square {
  width: 1.5%;
  height: 20%;
  margin: 0 0.7%;
  display: inline-block;
}
</style>
