<template>
  <div>
    <div class="header">
      <node-header></node-header>
    </div>
    <staking-background>
      <key-table></key-table>
      <general-box></general-box>
      <validators-box></validators-box>
    </staking-background>
  </div>
</template>
<script>
import KeyTable from "../components/UI/the-staking/KeyTable.vue";
import GeneralBox from "../components/UI/the-staking/GeneralBox.vue";
import ValidatorsBox from "../components/UI/the-staking/ValidatorsBox.vue";
import StakingBackground from "../components/UI/the-staking/StakingBackground.vue";

export default {
  components: {
    KeyTable,
    GeneralBox,
    ValidatorsBox,
    StakingBackground,
  },
};
</script>
<style scoped>
.header {
  height: 50px;
  position: fixed;
  top: 0;
  z-index: 10;
}
</style>
