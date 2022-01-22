<template>

    <div id="main">
      <section id="container">
        <section>
          <img src="stereum_logo_extern.png" alt="" />
          <slot></slot>
        </section>
      </section>
    </div>

</template>

<script>
export default {};
</script>

<style scoped>

#container {
  border-radius: 40px;
box-sizing: border-box;
top: 0;
left: 0;
  margin: auto;
  width: 95%;
  height: 95%;
  background-color: #336666;
  position: relative;
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
padding: 0;
margin: 0;
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
