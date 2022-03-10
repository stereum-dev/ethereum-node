<template>
  <div class="ctrGridParent">
    <div class="activelist-container">Active Component list</div>
    <div class="dashboard-container">dashboard-container</div>
    <div class="control-panel">control-panel</div>
    <div class="alerts">ALERTS</div>
    <div class="ctrlfooter">FOOTER</div>
  </div>
</template>

<style scoped>
.ctrGridParent {
  display: grid;
  width: 98.9%;
  height:98%;
  border: 6px solid rgb(165, 165, 165);
  border-radius: 10px 30px 30px 30px;
  top: 0;
  grid-template-columns: 28% 57% 15%;
  grid-template-rows: repeat(3, 1fr) 5%;
  position: relative;
}

.activelist-container {
  color: white;
  border: 1px solid red;
  border-top-left-radius: 10px;
  grid-column-start: 1;
  grid-column-end: 2;
  grid-row-start: 1;
  grid-row-end: 4;
}

.dashboard-container {
  border: 1px solid blue;
  border-top-right-radius: 30px;
  color: white;
  grid-column-start: 2;
  grid-column-end: 4;
  grid-row-start: 1;
  grid-row-end: 3;
}

.control-panel {
  border: 1px solid yellow;
  color: black;
  grid-column-start: 2;
  grid-column-end: 3;
  grid-row-start: 3;
  grid-row-end: 4;
}

.alerts {
  border: 1px solid green;
  color: white;
  grid-column-start: 3;
  grid-column-end: 4;
  grid-row-start: 2;
  grid-row-end: 4;
}

.ctrlfooter {
  background: rgb(42, 45, 42);
  color: white;
  grid-column-start: 1;
  grid-column-end: 4;
  border-radius: 0 0 25px 25px;
}
</style>
