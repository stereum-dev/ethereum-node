<template>
  <div class="cpuParent">
    <node-header id="head" onmousedown="return false"></node-header>
    <node-bg>
      <chart-line></chart-line>
    </node-bg>
  </div>
</template>
<script>
import ChartLine from "../components/UI/the-control/ChartLine.vue";
export default {
  components: { ChartLine },
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
