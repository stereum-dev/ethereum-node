<template>
  <div class="timeGasParent">
    <div class="time_left"><the-time></the-time></div>
    <div class="gas_right"><the-gas></the-gas></div>
  </div>
</template>
<script>
import TheTime from "./TheTime.vue";
import TheGas from "./TheGas.vue";
export default {
  components: {
    TheTime,
    TheGas,
  },
};
</script>
<style scoped>
.timeGasParent {
  width: 95%;
  height: 95%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.time_left {
  display: flex;
  width: 50%;
  height: 100%;
  justify-content: center;
  align-items: center;
}
.gas_right {
  display: flex;
  width: 50%;
  height: 100%;
  justify-content: center;
  align-items: center;
}
</style>
