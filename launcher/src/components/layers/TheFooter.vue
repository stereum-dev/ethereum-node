<template>
  <div class="footer-parent">
    <div class="footer-status-info"><span>Lorem, ipsum dolor.</span></div>
  </div>
</template>

<script>
export default {
  name: "TheFooter",
};
</script>

<style scoped lang="css">
.footer-parent {
  width: 99%;
  height: 4.2%;
  margin: 0 auto;
  grid-column: 1/4;
  grid-row: 4;
  background-color: rgb(229, 19, 19);
  border-radius: 0 0 7px 7px;
  position: fixed;
  bottom: 0.8%;
}
</style>
