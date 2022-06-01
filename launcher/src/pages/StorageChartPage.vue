<template>
  <div class="cpuParent">
    <node-header id="head" onmousedown="return false"></node-header>
    <chart-bg>
      <chart-grid-storage></chart-grid-storage>
    </chart-bg>
  </div>
</template>
<script>
import ChartGridStorage from "../components/UI/the-chart/ChartGridStorage.vue";
export default {
  components: { ChartGridStorage },
};
</script>

<style scoped>
#head {
  position: fixed;
  top: 0;
  z-index: 100;
}
.cpuParent {
  box-sizing: border-box;
  padding: 0;
}
</style>
