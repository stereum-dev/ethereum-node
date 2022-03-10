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
  height: 93%;
  top: 7.5%;
  grid-template-columns: 28% 57% 15%;
  grid-template-rows: repeat(3, 31.5%) 5%;
  position: relative;
}

.activelist-container {
  background: red;
  color: white;
  grid-column-start: 1;
  grid-column-end: 2;
  grid-row-start: 1;
  grid-row-end: 4;
}

.dashboard-container {
  background: blue;
  color: white;
  grid-column-start: 2;
  grid-column-end: 4;
  grid-row-start: 1;
  grid-row-end: 3;
}

.control-panel {
  background: yellow;
  color: black;
  grid-column-start: 2;
  grid-column-end: 3;
  grid-row-start: 3;
  grid-row-end: 4;
}

.alerts {
  background: green;
  color: white;
  grid-column-start: 3;
  grid-column-end: 4;
  grid-row-start: 2;
  grid-row-end: 4;
}

.ctrlfooter {
  background: purple;
  color: white;
  grid-column-start: 1;
  grid-column-end: 4;
  border-radius: 0 0 25px 25px;
}
</style>
