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
  left: 0.5%;
  background-color: rgb(229, 19, 19);
  border-radius: 0 0 7px 7px;
  position: fixed;
  bottom: 0.8%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  z-index: 1;
}
.footer-status-info {
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-left: 3.8%;
  font-size: 80%;
  color: #c1c1c1;
  font-weight: 700;
}
</style>
