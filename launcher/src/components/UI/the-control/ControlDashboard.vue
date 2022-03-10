<template>
  <div class="ctrlParent">
    <sand-clock></sand-clock>
  </div>
</template>
<script>
import SandClock from "./SandClock.vue";
export default {
  components: { SandClock },
};
</script>
<style scoped>
.ctrlParent {
  padding: 1rem;
}
</style>
