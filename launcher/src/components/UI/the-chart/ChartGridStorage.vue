<template>
  <div class="chartGridParent">
    <div class="plugins-control">
      <chart-info>
        <div class="backButtonArea">
          <div class="backBtn">
            <img src="../../../../public/img/icon/arrows/BackArrow.png" />
          </div>
        </div>
        <div class="storageInfoTitle"><span>STORAGE SPACE</span></div>
        <div class="selectionButtons">
          <div class="selection btn"><span>SELECTION</span></div>
          <div class="details btn"><span>DETAILED</span></div>
        </div>
        <div class="btnDetails"><span>DETAILED</span></div>
        <div class="infoLine">
          <div class="chartInfoBox">Free</div>
          <div class="ChartInfoColor free"></div>
        </div>
        <div class="infoLine">
          <div class="chartInfoBox">Stereum</div>
          <div class="ChartInfoColor stereum"></div>
        </div>
        <div class="infoLine">
          <div class="chartInfoBox">Geth</div>
          <div class="ChartInfoColor geth"></div>
        </div>
        <div class="infoLine">
          <div class="chartInfoBox">Lighthouse</div>
          <div class="ChartInfoColor lighthouse"></div>
        </div>
        <div class="infoLine">
          <div class="chartInfoBox">Grafna</div>
          <div class="ChartInfoColor grafna"></div>
        </div>
        <div class="infoLine">
          <div class="chartInfoBox">prometheus</div>
          <div class="ChartInfoColor prometheus"></div>
        </div>
      </chart-info>
    </div>
    <div class="chart-box"><storage-chart></storage-chart></div>
    <!-- <div class="footer"></div> -->
  </div>
</template>

<script>
import StorageChart from "../the-control/StorageChart.vue";
import ChartInfo from "./ChartInfo.vue";
export default {
  components: { StorageChart, ChartInfo },
};
</script>

<style scoped>
.chartGridParent {
  display: grid;
  width: 99.9%;
  height: 99.5%;
  border: 6px solid rgb(165, 165, 165);
  border-radius: 10px 30px 30px 30px;
  top: 1px;
  grid-template-columns: 24% 76%;
  grid-template-rows: 95% 5%;
  position: relative;
  box-sizing: border-box;
}
.plugins-control {
  grid-column: 1/2;
  grid-row: 1/2;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  color: white;
  border-top-left-radius: 10px;
}
.chart-box {
  grid-column: 2/3;
  grid-row: 1/2;
  width: 98%;
  height: 96%;
  margin-top: 5px;
  color: white;
  z-index: 1;
  border: 5px solid grey;
  border-radius: 20px;
  display: flex;
  background: #242222;
  flex-direction: column;
  justify-content: center;
}

.footer {
  grid-row: 2/3;
  grid-column: 1/3;
  border-radius: 0 0 7px 10px;
  background: rgb(42, 45, 42);
  color: white;
}

/*storage*/
.backButtonArea {
  width: 100%;
  height: 5%;
  justify-content: flex-end;
  align-items: center;
  display: flex;
}
.backBtn {
  width: 10%;
  height: 60%;
  background: #242222;
  justify-content: center;
  align-items: center;
  display: flex;
  border: 1px solid grey;
  cursor: pointer;
  margin: 2%;
}
.backBtn img {
  width: 90%;
}
.storageInfoTitle,
.btnDetails {
  width: 100%;
  height: 5%;
  justify-content: center;
  align-content: center;
  display: flex;
  background: #242222;
  font-size: 100%;
  border: 2px solid grey;
  border-radius: 10px;
  font-weight: bold;
  margin: 2%;
}
.selectionButtons {
  width: 100%;
  height: 5%;
  justify-content: center;
  align-content: center;
  display: flex;
  margin: 5%;
  gap: 20%;
}
.btn {
  width: 40%;
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 70%;
  border: 2px solid grey;
  border-radius: 10px;
  background: #242222;
  font-weight: bold;
}
.infoLine {
  width: 100%;
  height: 4%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 5%;
  gap: 10%;
}
.chartInfoBox {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 70%;
  font-weight: bold;
  width: 70%;
  height: 100%;
  border-radius: 5px;
  border: 2px solid grey;
  background: #242222;
}
.ChartInfoColor {
  width: 12%;
  height: 100%;
  border: 2px solid grey;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
}
.free {
  background: #fbe750;
}
.stereum {
  background: #16578f;
}
.geth {
  background: #f15562;
}
.lighthouse {
  background: #14af4a;
}
.grafna {
  background: #ef5021;
}
.prometheus {
  background: #14a0db;
}
</style>
