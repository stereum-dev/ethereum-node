<template>
  <div class="np2p-parent">
    <div class="np2p-icon-box">
      <div class="np2p-icon-box_container">
        <img src="/img/icon/control/PeertoPeerIcon.png" alt="" />
      </div>
      <span>PEER TO PEER NETWORK</span>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.np2p-parent {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  height: 100%;
}
.np2p-icon-box {
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.np2p-icon-box_container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 75%;
}
.np2p-icon-box_container img {
  width: 55%;
  height: 70%;
}
.np2p-icon-box span {
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50%;
  font-weight: bold;
  color: #c1c1c1;
}
</style>
