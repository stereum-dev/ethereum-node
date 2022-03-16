<template>
  <div class="ctrGridParent">
    <div class="plugins-container">
      <control-plugins></control-plugins>
    </div>
    <div class="dashboard-container">
      <control-dashboard></control-dashboard>
    </div>
    <div class="control-panel">
      <control-panel></control-panel>
    </div>
    <div class="alerts">
      <control-alert></control-alert>
    </div>

    <div class="ctrlfooter">FOOTER</div>
  </div>
</template>

<script>
import ControlDashboard from "./ControlDashboard.vue";
import ControlPlugins from "./ControlPlugins.vue";
import ControlPanel from "./ControlPanel.vue";
import ControlAlert from "./ControlAlert.vue";
export default {
  components: { ControlDashboard, ControlPlugins, ControlPanel, ControlAlert },
};
</script>

<style scoped>
.ctrGridParent {
  display: grid;
  width: 98.9%;
  height: 97.5%;
  border: 6px solid rgb(165, 165, 165);
  border-radius: 10px 30px 30px 30px;
  top: 1px;
  grid-template-columns: 24% 59% 17%;
  grid-template-rows: repeat(3, 1fr) 5%;
  position: relative;
}

.plugins-container {
  background-color: transparent;
  color: white;
  border-top-left-radius: 10px;
  grid-column: 1/2;
  grid-row: 1/4;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dashboard-container {
  width: 98%;
  height: 93%;
  margin-top: 5px;
  color: white;
  grid-column-start: 2;
  grid-column-end: 4;
  grid-row-start: 1;
  grid-row-end: 3;
  z-index: 0;
  border: 5px solid grey;
  border-radius: 20px;
}

.control-panel {
  grid-column-start: 2;
  grid-column-end: 3;
  grid-row-start: 3;
  grid-row-end: 4;
}

.alerts {
  grid-column-start: 3;
  grid-column-end: 4;
  grid-row-start: 2;
  grid-row-end: 4;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}

.ctrlfooter {
  background: rgb(42, 45, 42);
  color: white;
  grid-column-start: 1;
  grid-column-end: 4;
  border-radius: 0 0 25px 25px;
}
</style>
