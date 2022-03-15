<template>
  <div class="ctrlParent">
    <sand-clock></sand-clock>
    <busy-ram></busy-ram>
    <storage-counter></storage-counter>
  </div>
</template>
<script>
import SandClock from "./SandClock.vue";
import BusyRam from "./BusyRam.vue";
import StorageCounter from "./StorageCounter.vue";
export default {
  components: { SandClock, BusyRam, StorageCounter },
};
</script>
<style scoped>
.ctrlParent {
  padding: 1rem;
  display: flex;
}
</style>
