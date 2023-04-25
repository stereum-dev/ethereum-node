<template>
  <installation-box :back="back" :title="title" :next="next">
    <div class="list-parent">Importing Syncing</div>
  </installation-box>
</template>

<script>
export default {
  data() {
    return {
      back: "importingList",
      title: "IMPORTED CONFIG",
      next: "importingVerify",
    };
  },
};
</script>

<style scoped>
.list-parent {
  grid-column: 2/5;
  grid-row: 3/4;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
