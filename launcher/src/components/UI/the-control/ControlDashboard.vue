<template>
  <div class="ctrlParent">
    <sand-clock></sand-clock>
    <busy-ram></busy-ram>
  </div>
</template>
<script>
import SandClock from "./SandClock.vue";
import BusyRam from "./BusyRam.vue";
export default {
  components: { SandClock, BusyRam },
};
</script>
<style scoped>
.ctrlParent {
  padding: 1rem;
}
</style>
