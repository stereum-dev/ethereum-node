<template>
  <div class="ctrGridParent">
    <div class="plugins-container">
      <control-plugins>
        <div class="plugins-title">
          <span>PLUG-INs</span>
        </div>
        <div class="plugins-table-bg">
          <div class="arrow-up">
            <img
              src="../../../../public/Img/icon/manage-node-icons/up-arrow.png"
              alt=""
            />
          </div>
          <div class="plugins-table">
            <div class="plugins-row">
              <div class="plugins-status-color"></div>
              <div class="plugins-row-content">
                <div class="row-plugin-name">
                  <span>plugin-name</span>
                </div>
                <div class="row-category">
                  <span>Consensus Client</span>
                </div>
              </div>
            </div>
          </div>
          <div class="arrow-down">
            <img
              src="../../../../public/Img/icon/manage-node-icons/down-arrow.png"
              alt="icon"
            />
          </div>
        </div>
      </control-plugins>
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
.plugins-title {
  width: 40%;
  height: 22px;
  background-color: #29322d;
  padding: 2px;
  border: 1px solid #3f5b54;
  border-radius: 10px;
}
.plugins-title span {
  color: rgb(223, 223, 223);
  font-size: 16px;
  font-weight: 900;
}
.plugins-table-bg {
  width: 90%;
  height: 85%;
  background-color: #527162;
  border-radius: 35px 35px 45px 45px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.arrow-down,
.arrow-up {
  width: 50%;
  height: 25px;
  margin: 5px;
  border: 1px solid #464f4b;
  border-radius: 15px;
  box-shadow: 0 1px 3px 1px #3b4a43;
}
.arrow-up img {
  width: 100%;
  height: 100%;
}
.arrow-down img {
  width: 100%;
  height: 100%;
}
.arrow-down:hover,
.arrow-up:hover {
  border: 1px solid rgb(100, 109, 100);
}
.arrow-down:active,
.arrow-up:active {
  border: 1px solid rgb(85, 94, 85);
  box-shadow: none;
}
.plugins-table {
  width: 97%;
  height: 87%;
  overflow-x: hidden;
  overflow-y: auto;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(6, 1fr);
}
.plugins-table::-webkit-scrollbar {
  width: 0;
}
.plugins-row {
  width: 97%;
  height: 40px;
  justify-self: center;
  margin-top: 5px;
  background-color: #33393e;
  display: flex;
  justify-content: flex-start;
  border: 1px solid #333;
  border-radius: 3px;
  box-shadow: 0 1px 3px 1px #393939;
}
.plugins-status-color {
  width: 20%;
  height: 100%;
  background-color: #22b53f;
  border-radius: 3px;
}
.plugins-row-content {
  width: 75%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-evenly;
  align-items: center;
  margin-left: 5px;
}
.row-plugin-name,
.row-category {
  width: 90%;
  height: 40%;
  color: #333;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
}

.row-plugin-name span,
.row-category span {
  font-size: 0.7rem;
  font-weight: 700;
}
</style>
