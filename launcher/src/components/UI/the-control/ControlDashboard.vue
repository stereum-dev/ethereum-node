<template>
  <div class="ctrlParent">
    <!-- <sand-clock></sand-clock>
    <busy-ram></busy-ram>
    <storage-counter></storage-counter> -->
    <div class="machineName_cell"></div>
    <div class="nodeProcess_cell"></div>
    <div class="sandFull_cell"><sand-clock></sand-clock></div>
    <div class="discSpace_cell"></div>
    <div class="networkSync_cell"></div>
    <div class="cpuUsage_cell"><the-thermometer></the-thermometer></div>
    <div class="peersConect_cell"></div>
    <div class="networkUsage_cell"></div>
    <div class="validatorComment_cell">
      <storage-counter class="validCntr"></storage-counter>
    </div>
  </div>
</template>
<script>
import TheThermometer from "./TheThermometer.vue";
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
  grid-template-rows: 12% repeat(3, 29.5%);
  position: relative;
}
.machineName_cell {
  grid-column: 1/2;
  grid-row: 1/2;
  background: red;
  border-radius: 15px 0 0 0;
}
.nodeProcess_cell {
  grid-column: 2/3;
  grid-row: 1/2;
  background: yellow;
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
  background: yellow;
}
.networkSync_cell {
  grid-column: 2/3;
  grid-row: 2/3;
  background: red;
}
.cpuUsage_cell {
  grid-column: 1/2;
  grid-row: 3/4;
  background: red;
  display: flex;
  justify-content: center;
  align-items: center;
}
.peersConect_cell {
  grid-column: 2/3;
  grid-row: 3/4;
  background: yellow;
}
.networkUsage_cell {
  grid-column: 1/2;
  grid-row: 4/5;
  background: yellow;
  border-radius: 0 0 0 15px;
}
.validatorComment_cell {
  grid-column: 3/4;
  grid-row: 2/3;

  display: flex;
}
.validCntr {
}
</style>
