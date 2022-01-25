<template>
  <section id="main">
    <section id="contTra">
      <div id="trapezoid">
      <slot></slot>
        <br />Test<br />
        for the node page
      </div>
    </section>
  </section>
</template>

<style scoped>
#trapezoid {
  height: 0;
  width: 92%;
  border-bottom: 80px solid #05ed08;
  border-left: 45px solid transparent;
  border-right: 45px solid transparent;
  padding: 0 8px 0 0;
  margin: 5px auto;
}
#contTra {
  border: 3px solid red;
  position: absolute;
  top: 8%;
  left: 2.5%;
  width: 62.5%;
}
</style>
