<template>
  <div class="cpuParent">
    <node-header id="head" onmousedown="return false"></node-header>
    <node-bg>
      <chart-grid></chart-grid>
    </node-bg>
  </div>
</template>
<script>
import ChartGrid from '../components/UI/the-chart/ChartGrid.vue'
export default {
  components: { ChartGrid }
}
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
