<template>
  <div class="chartGridParent">
    <div class="plugins-control">
      <control-plugins>
        <div class="box1">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae dolore
          debitis exercitationem qui ea est.
        </div>
        <div class="box1">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi
          voluptate illum a quisquam? Obcaecati, officia?
        </div>
        <div class="box1">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo
          obcaecati quae accusamus placeat, veritatis necessitatibus.
        </div>
      </control-plugins>
    </div>
    <div class="chart-box"><chart-line></chart-line></div>
    <div class="footer"></div>
  </div>
</template>

<script>
import ChartLine from "../the-control/ChartLine.vue";
import ControlPlugins from "../the-control/ControlPlugins.vue";
export default {
  components: { ChartLine, ControlPlugins },
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
  z-index: 1;
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
  flex-direction: column;
  justify-content: center;
}
.box1 {
  width: 88%;
  height: 25%;
  border: 3px solid grey;
  border-radius: 8px;
  box-shadow: 3px 5px #434c3a;
  background: #000;
}
.footer {
  grid-row: 2/3;
  grid-column: 1/3;
  border-radius: 0 0 25px 25px;
  background: rgb(42, 45, 42);
  color: white;
}
</style>
