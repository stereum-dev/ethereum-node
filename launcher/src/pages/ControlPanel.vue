<template>
  <div class="ctpParent">
    <node-bg>
    <control-grid></control-grid>
    </node-bg>
    <node-header id="head">
    
    </node-header>
  </div>
</template>

<script>
import ControlGrid from '../components/UI/ControlGrid.vue';
export default {
  components:{ControlGrid}
}
</script>

<style scoped>
#parent {
  box-sizing: border-box;
  padding: 0;
}

#head {
  position: fixed;
  top: 0;
}
</style>
