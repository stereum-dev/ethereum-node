<template>
  <div class="thestaking-parent">
    <node-header id="head" />
    <StakingGrid />
  </div>
</template>
<script>
import StakingGrid from "../components/UI/the-staking/StakingGrid.vue";

export default {
  components: {
    StakingGrid,
  },
};
</script>
<style scoped>
#head {
  position: fixed;
  top: 0;
  z-index: 10;
}
.thestaking-parent {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}
</style>
