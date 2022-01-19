<template>
  <section class="body">
    <section id="main">
      <section id="container">
        <section>
          <img src="stereum_logo_extern.png" alt="" />
          <slot></slot>
        </section>
      </section>
    </section>
  </section>
</template>

<script>
export default {};
</script>

<style scoped>
.body {
  margin: 0;
  padding: 0;
}
#container {
  border-radius: 40px;

  padding: 1rem;
  margin: 2rem auto;
  width: 90vw;
  height: 90vh;
  background-color: #336666;
}
#main {
  background-color: #000;

  justify-content: center;
  align-items: center;
  height: 97vh;
  display: flex;
}

img {
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50%;
  min-height: 20%;
  min-width: 20%;
  transform: translate(-50%, -50%);
  resize: both;
  z-index: 0;
}
</style>
