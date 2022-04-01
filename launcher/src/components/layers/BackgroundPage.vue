<template>
  <div id="main">
    <section id="containerBg">
      <section class="img-box">
        <img class="imgBg" src="../../../public/Img/icon/stereum-logo/stereum_logo.png" alt="" />

        <slot></slot>
      </section>
    </section>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
#containerBg {
  border-radius: 40px;
  box-sizing: border-box;
  top: 0;
  left: 0;
  margin: auto;
  width: 95%;
  height: 95%;
  background-color: #336666;
}

#main {
  background-color: #000;
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: -1;
  top: 0;
  left: 0;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
}
.img-box {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.imgBg {
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50%;
  min-height: 20%;
  min-width: 20%;
  transform: translate(-50%, -50%);
  resize: both;
  opacity: 0.2;
}
</style>
