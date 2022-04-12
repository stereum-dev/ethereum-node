<template>
  <div id="main">
    <div id="containerBg">
      <div class="img-box">
        <img
          class="imgBg"
          src="../../../public/img/icon/stereum-logo/stereum-logo.png"
          alt="icon"
        />
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
#containerBg {
  border-radius: 10px;
  border: 3px solid #989898;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  background-color: #336666;
}

#main {
  background-color: #000;
  width: 100vw;
  height: 100vh;
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
  z-index: 0;
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
