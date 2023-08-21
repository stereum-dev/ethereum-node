<template>
  <div class="credit-parent">
    <node-bg>
      <credit-panel></credit-panel>
    </node-bg>
    <node-header id="head"> </node-header>
  </div>
</template>
<script>
import CreditPanel from "../components/UI/credit/CreditPanel.vue";
export default {
  components: { CreditPanel },
};
</script>

<style scoped>
#head {
  position: fixed;
  top: 0;
}
</style>
