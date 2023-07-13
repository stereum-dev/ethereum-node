<template>
  <div class="thestaking-parent">
    <node-header id="head" />
    <StakingGrid />
    <TheFooter />
  </div>
</template>
<script>
import StakingGrid from "../components/UI/the-staking/StakingGrid.vue";
import TheFooter from "../components/layers/TheFooter.vue";

export default {
  components: {
    StakingGrid,
    TheFooter,
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
