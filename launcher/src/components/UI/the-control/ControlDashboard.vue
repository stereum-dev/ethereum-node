<template>
  <div class="ctrlParent">
    <div class="machineName_cell">machineName_cell</div>
    <div class="nodeProcess_cell">nodeProcess_cell</div>
    <div class="sandFull_cell">
      <sand-clock></sand-clock>
    </div>

    <dashboard-card class="discSpace_cell">
      <router-link to="">
        <div class="sddimg">
          <img class="hddSvg" src="../../../../public/img/icon/hdd.svg" />
        </div>
        <div class="infHdd">
          <div class="infoHdd">{{ No }} GB FREE</div>
          <hdd-loading></hdd-loading>
        </div>
      </router-link>
    </dashboard-card>

    <!-- <div class="networkSync_cell"></div> -->
    <dashboard-card class="nodeStart_cell"
      ><amsterdam-component></amsterdam-component
    ></dashboard-card>
    <dashboard-card class="cpuUsage_cell">
      <router-link to="/cpu">
        <div class="cpuCounter">
          <div class="circleCounter">
            <span class="textCounter">{{ No }}</span>
          </div>
        </div>
        <div class="chart-img">
          <img
            class="cpuChartAnim"
            src="../../../../public/img/icon/animChart.svg"
          />
        </div>
      </router-link>
    </dashboard-card>
    <!-- <div class="networkCheck"></div> -->
    <dashboard-card class="networkCheck">
      <div class="wifiIco">
        <img
          class="wifiImg"
          src="../../../../public/img/icon/wifiIcon.svg"
          alt=""
        />
      </div>
      <div class="recive">
        <span class="rec">{{ rec }}</span>
        <span class="lblMbit">mbit</span>
        <small>Total Received</small>
        <div class="arrowPart">
          <div class="arrowIco">
            <img src="../../../../public/img/icon/arrows/arrowOrange.png" />
          </div>
          {{ ttlRec }} <span class="ttlRec">GB</span>
        </div>
      </div>
      <div class="transmit">
        <span class="tran">{{ tran }}</span>
        <span class="lblMbit">mbit</span>
        <small>Total Transmietted</small>
        <div class="arrowPart">
          <div class="arrowIco">
            <img src="../../../../public/img/icon/arrows/arrowGreen.png" />
          </div>
          {{ ttlTrn }} <span class="ttlRec">GB</span>
        </div>
      </div>
    </dashboard-card>

    <!-- <div class="validatorComment_cell">
      <storage-counter class="validCntr"></storage-counter>
    </div> -->
    <dashboard-card class="validatorComment_cell">
      <storage-counter class="validCntr"></storage-counter>
    </dashboard-card>

    <!-- <div class="nodeStart"></div> -->
    <dashboard-card class="nodeStart"
      ><div class="imgCpu">
        <img class="cpuImg" src="../../../../public/img/icon/cpuIcon.svg" />
      </div>
      <div class="colorBar">
        <color-bar class="colorBarComp"></color-bar>
        <loli-bar class="loli"></loli-bar>
      </div>
    </dashboard-card>
  </div>
</template>

<script>
import ColorBar from "./ColorBar.vue";
import LoliBar from "./LoliBar.vue";
import HddLoading from "./HddLoading.vue";
import SandClock from "./SandClock.vue";
import DashboardCard from "./DashboardCard.vue";
import StorageCounter from "./StorageCounter.vue";
import AmsterdamComponent from "./AmsterdamComponent.vue";
export default {
  components: {
    SandClock,
    StorageCounter,
    HddLoading,
    DashboardCard,
    ColorBar,
    LoliBar,
    AmsterdamComponent,
  },
  data() {
    return {
      No: 100,
      rec: 1.12,
      tran: 1.12,
      ttlRec: 44.6,
      ttlTrn: 44.6,
    };
  },
};
</script>

<style scoped>
.recive {
  width: 30%;
  display: flex;
  flex-direction: column;
}
.rec {
  color: #ec590a;
  font-weight: bold;
  font-size: 1rem;
}
.transmit {
  width: 30%;
  display: flex;
  flex-direction: column;
}
small {
  font-size: 0.3rem;
}
.tran {
  color: #336666;
  font-weight: bold;
  font-size: 1rem;
}
.lblMbit {
  color: #eee;
  font-weight: bold;
  font-size: 0.9rem;
}
.ctrlParent {
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: repeat(3, 31%);
  grid-template-rows: 12% repeat(3, 25%);
  position: relative;
  gap: 2%;
  margin: 1%;
  box-sizing: border-box;
}
.card a {
  width: 100%;
  height: 100%;
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-items: center;
}
.machineName_cell {
  grid-column: 1/2;
  grid-row: 1/2;
  color: aliceblue;
  border-radius: 15px 0 0 0;
}

.nodeProcess_cell {
  grid-column: 2/3;
  grid-row: 1/2;
}

.sandFull_cell {
  grid-column: 3/4;
  grid-row: 1/2;
  border-radius: 0 15px 0 0;
  display: flex;
}

.discSpace_cell {
  grid-column: 1/2;
  grid-row: 2/3;
}
.sddimg {
  width: 30%;
}
.hddSvg {
  width: 80%;
}
.infoHdd {
  width: 80%;
}
.infHdd {
  display: flex;
  flex-direction: column;
}
.loading-container {
  width: 100%;
  height: 100%;
}
/*.networkSync_cell {
  grid-column: 2/3;
  grid-row: 2/3;
  display: flex;
  border: 1px solid orange;
}*/
.networkCheck {
  grid-row: 2/3;
  grid-column: 2/3;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}
.cpuUsage_cell {
  grid-column: 1/2;
  grid-row: 3/4;
}

.chart-img {
  width: 60%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.chart-img img {
  width: 80%;
  height: 90%;
}
.textCounter {
  color: rgb(146, 146, 146);
  font-size: 1rem;
  font-weight: 600;
  z-index: 20;
}
.cpuCounter {
  width: 40%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.circleCounter {
  width: 51%;
  height: 70%;
  border: 4px solid rgb(77, 77, 77);
  box-shadow: 0 1px 5px 1px rgb(18, 18, 18);
  position: relative;
  background: #000;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
.circleCounter::before {
  content: "";
  /* box-shadow: inset 1px 1px 5px 1px rgb(227, 198, 141); */
  position: absolute;
  width: 100%;
  height: 100%;
  bottom: 0;
  left: 0;
  animation: wipe 10s cubic-bezier(0.2, 0.6, 0.8, 0.4) forwards;
}
@keyframes wipe {
  0% {
    height: 0;
    background: rgb(13, 84, 13);
  }
  5% {
    height: 5%;
    background: linear-gradient(rgb(13, 84, 13), rgb(12, 114, 12), #138a13);
  }
  10% {
    height: 10%;
    background: linear-gradient(#158e11, #1da018, #1fb11a, #6bab17);
  }
  25% {
    height: 30%;
    background: linear-gradient(#5e9b0f, #6fa519, #69ae10, #7da105);
  }
  50% {
    height: 50%;
    background: linear-gradient(#90ce25, #abdf1c, #a7bc20, #c0cf1b);
  }
  75% {
    height: 75%;
    background: linear-gradient(#efa418, #fcd616, #eae728, #c0cf1b);
  }
  100% {
    height: 100%;
    background: linear-gradient(
      #c81a07,
      #f63f0d,
      #f85c08,
      #f18214,
      #efa418,
      #fcd616
    );
  }
}

.networkUsage_cell {
  grid-column: 1/2;
  grid-row: 4/5;
}

.validatorComment_cell {
  grid-column: 3/4;
  grid-row: 2/3;
}

.netThermo {
  position: relative;
  top: 0rem;
}
.nodeStart {
  grid-column: 1/2;
  grid-row: 4/5;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}
.colorBar {
  width: 60%;
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
}
.loli {
  width: 80%;
}
.imgCpu {
  width: 30%;
}
.cpuImg {
  width: 80%;
}
.wifiIco {
  width: 30%;
}
.wifiImg {
  width: 80%;
}

.slice-colors .slice-item {
  width: 100%;
  height: 100%;
}
.arrowPart {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.arrowIco {
  width: 20%;
}
.arrowIco img {
  width: 100%;
}
.ttlRec {
  font-weight: bold;
  color: #eee;
}
</style>
