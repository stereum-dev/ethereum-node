<template>
  <div class="tableParent">
    <div class="tableContent">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {};
</script>
<style scoped>
.tableParent {
  width: 100%;
  height: 60%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 3px;
}
.tableContent {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow-x: hidden;
  overflow-y: auto;
}
.tableContent::-webkit-scrollbar {
  width: 1px;
}
</style>
