<template>
  <div class="control-parent">
    <node-bg>
      <control-grid></control-grid>
    </node-bg>
    <node-header id="head"> </node-header>
  </div>
</template>

<script>
import ControlGrid from "../components/UI/the-control/ControlGrid.vue";
export default {
  components: { ControlGrid },
};
</script>

<style scoped>
#head {
  position: fixed;
  top: 0;
}
</style>
