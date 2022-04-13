<template>
  <div class="ctrlParent">
    <div class="machineName_cell">machineName_cell</div>
    <div class="nodeProcess_cell">nodeProcess_cell</div>
    <div class="sandFull_cell">
      <sand-clock></sand-clock>
    </div>

    <div class="discSpace_cell"></div>

    <!-- <div class="networkSync_cell"></div> -->

    <div class="cpuUsage_cell">
      <the-thermometer></the-thermometer>
    </div>
    <div class="peersConect_cell">
      <router-link to="/cpu"><base-button>test</base-button></router-link>
    </div>
    <!-- <div class="networkUsage_cell">
      <the-thermometer class="netThermo"></the-thermometer>
    </div> -->
    <div class="validatorComment_cell">
      <storage-counter class="validCntr"></storage-counter>
    </div>
  </div>
</template>

<script>
import TheThermometer from "./TheThermometer.vue";
// import ChartBar from "./ChartBar.vue";
// import ChartLine from "./ChartLine.vue";
import SandClock from "./SandClock.vue";
// import BusyRam from "./BusyRam.vue";
import StorageCounter from "./StorageCounter.vue";
export default {
  components: { SandClock, StorageCounter, TheThermometer },
};
</script>

<style scoped>
.ctrlParent {
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: repeat(3, 33.3%);
  grid-template-rows: 12% repeat(2, 40%);
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
  grid-column: 1/2.5;
  grid-row: 2/3;
  margin: 2%;
  border-radius: 10px;
  background: rgba(55, 55, 55, 0.8);
  box-sizing: border-box;
  box-shadow: 2px 1px rgb(24, 23, 23);
}

/*.networkSync_cell {
  grid-column: 2/3;
  grid-row: 2/3;
  display: flex;
  border: 1px solid orange;
}*/

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
  box-shadow: 2px 1px rgb(24, 23, 23);
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
  grid-column: 2.5/3.5;
  grid-row: 2/3;
  display: flex;
  margin: 2%;
  border-radius: 10px;
  background: rgba(55, 55, 55, 0.8);
  box-sizing: border-box;
  box-shadow: 2px 1px rgb(24, 23, 23);
  align-items: center;
  justify-content: center;
}

.netThermo {
  position: relative;
  top: 0rem;
}
</style>
