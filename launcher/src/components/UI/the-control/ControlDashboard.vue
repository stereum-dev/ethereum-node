<template>
  <div class="ctrlParent">
    <div class="machineName_cell">machineName_cell</div>
    <div class="nodeProcess_cell">nodeProcess_cell</div>
    <div class="sandFull_cell">
      <sand-clock></sand-clock>
    </div>

    <div class="discSpace_cell">
      <div class="sddimg">
        <img class="hddSvg" src="../../../../public/img/icon/hdd.svg" />
      </div>
      <div class="infHdd">
        <div class="infoHdd">{{ No }} GB FREE</div>
        <hdd-loading></hdd-loading>
      </div>
    </div>

    <!-- <div class="networkSync_cell"></div> -->

    <div class="cpuUsage_cell">
      <!-- <the-thermometer></the-thermometer> -->
    </div>
    <router-link to="/cpu" class="peersConect_cell">
      <div class="cpuCounter">
        <div class="circleCounter">{{ No }}</div>
      </div>
      <img
        class="cpuChartAnim"
        src="../../../../public/img/icon/animChart.svg"
        alt=""
      />
    </router-link>
    <div class="networkCheck"></div>

    <div class="validatorComment_cell">
      <storage-counter class="validCntr"></storage-counter>
    </div>
    <div class="nodeStart"></div>
  </div>
</template>

<script>
import HddLoading from "./HddLoading.vue";
import SandClock from "./SandClock.vue";
// import BusyRam from "./BusyRam.vue";
import StorageCounter from "./StorageCounter.vue";
export default {
  components: { SandClock, StorageCounter, HddLoading },
  data() {
    return {
      No: 100,
    };
  },
};
</script>

<style scoped>
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
  margin: 2%;
  border-radius: 10px;
  background: rgba(55, 55, 55, 0.8);
  box-sizing: border-box;
  box-shadow: 2px 1px rgb(24, 23, 23);
  display: flex;
  justify-content: left;
  align-items: center;
}
.hddSvg {
  width: 60%;
}
.infoHdd {
  width: 80%;
}
.infHdd {
  display: flex;
  flex-direction: column;
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
  margin: 2%;
  border-radius: 10px;
  background: rgba(55, 55, 55, 0.8);
  box-sizing: border-box;
  box-shadow: 2px 3px rgb(53, 51, 51);
}
.cpuUsage_cell {
  grid-column: 1/2;
  grid-row: 3/4;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2%;
  border-radius: 10px;
  background: rgba(55, 55, 55, 0.8);
  box-sizing: border-box;
  box-shadow: 2px 1px rgb(24, 23, 23);
}

.peersConect_cell {
  grid-column: 2/3;
  grid-row: 3/4;
  margin: 2%;
  border-radius: 10px;
  background: rgba(55, 55, 55, 0.8);
  box-sizing: border-box;
  box-shadow: 2px 3px rgb(53, 51, 51);
  text-decoration: none;
  display: flex;
}

.peersConect_cell:hover {
  background: rgb(19, 16, 16);
}
.peersConect_cell:active {
  background: rgb(19, 16, 16);
}

.cpuCounter {
  color: aquamarine;
  font-size: 2rem;
  text-align: left;
  margin: 5%;

  width: 100%;
}
.circleCounter {
  width: 4rem;
  height: 3rem;
  border: 3px solid aquamarine;
  display: flex;
  border-radius: 50%;
  justify-content: center;
  align-content: center;
}
.cpuChartAnim {
  position: relative;
  left: -70%;
}

/*.networkUsage_cell {
  grid-column: 1/2;
  grid-row: 4/5;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0 0 0 15px;
  border: 3px dotted red;
}*/

.validatorComment_cell {
  grid-column: 3/4;
  grid-row: 2/3;
  display: flex;

  border-radius: 10px;
  background: rgba(55, 55, 55, 0.8);
  box-sizing: border-box;
  box-shadow: 2px 1px rgb(24, 23, 23);
  align-items: center;
  justify-content: left;
}

.netThermo {
  position: relative;
  top: 0rem;
}
.nodeStart {
  grid-column: 1/2;
  grid-row: 4/5;
  border-radius: 10px;
  background: rgba(55, 55, 55, 0.8);
  box-sizing: border-box;
  box-shadow: 2px 3px rgb(53, 51, 51);
  margin: 2%;
}
</style>
