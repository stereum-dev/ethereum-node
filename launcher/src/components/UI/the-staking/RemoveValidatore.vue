<template>
  <div class="removeRow">
  </div>
</template>
<script>
export default {};
</script>
<style scoped>
.removeRow {
  grid-column: 1/8;
  grid-row: 1;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 5% 85% 10%;
  grid-template-rows: 1fr;
  background-color: #a23838;
  opacity: 0.5;
  border-radius: 50px;
  z-index: 1;
  position: relative;
  pointer-events: none;
}
</style>
