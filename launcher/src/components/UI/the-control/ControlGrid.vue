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
              src="../../../../public/img/icon/manage-node-icons/up-arrow.png"
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
              src="../../../../public/img/icon/manage-node-icons/down-arrow.png"
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

    <div class="footer"></div>
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
  width: 99.1%;
  height: 90%;
  background-color: rgb(28, 28, 28);
  border: 4px solid #979797;
  border-radius: 10px 35px 10px 10px;
  grid-template-columns: 24% 59% 17%;
  grid-template-rows: 32% 31% 32% 5%;
  z-index: 0;
  text-align: center;
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
  position: relative;
}

.dashboard-container {
  width: 98%;
  height: 93%;
  margin-top: 7px;
  color: white;
  grid-column-start: 2;
  grid-column-end: 4;
  grid-row-start: 1;
  grid-row-end: 3;
  z-index: 0;
  border: 4px solid grey;
  border-radius: 20px 27px 20px 20px;
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

.footer {
  width: 100%;
  height: 99%;
  margin: 0 auto;
  grid-column: 1/4;
  grid-row: 4;
  background-color: rgb(52, 52, 52);
  border-radius:0 0 7px 7px;
}
.plugins-title {
  width: 40%;
  height: 4.5%;
  background-color: #1c3326;
  padding: 2px;
  border: 1px solid #4a5150;
  border-radius: 10px;
  margin:14px auto 5px auto;
  box-shadow: 0 1px 3px 1px rgb(20, 44, 34);
}
.plugins-title span {
  color: rgb(209, 209, 209);
  font-size: 0.9rem;
  font-weight: 600;
}
.plugins-table-bg {
  width: 90%;
  height: 86%;
  background-color: #527162;
  border-radius: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
