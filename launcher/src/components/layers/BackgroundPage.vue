<template>
  <div id="main">
    <section id="containerBg">
      <section class="img-box">
        <img
          class="imgBg"
          src="../../../public/img/icon/stereum-logo/stereum-logo.png"
          alt="icon"
        />

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
  width: 100%;
  height: 100%;
  background-color: #336666;
}

#main {
  background-color: #000;
  width: 100%;
  height: 100%;
  min-width: 972;
  max-width: 1024px;
  max-height: 576px;
  min-height: 576px;
  border-radius: 40px;
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
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
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
