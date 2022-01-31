<template>
  <section id="main">
    <section id="contTra">
      <div id="trapezoid">
        <slot></slot>
      </div>
    </section>
  </section>
</template>

<style scoped>
#trapezoid {
  height: 0;

  width: 65%;
  border-bottom: 7rem solid #05ed08;
  border-left: 7rem solid transparent;
  border-right: 7rem solid transparent;
  padding: 0 5px 0 0;
  margin: 5px auto;
  resize: both;
}
#contTra {
  border: 3px solid red;
  margin: auto;
  height: auto;
  width: 98%;
  display: grid;
  grid-template-columns: 98%;
  grid-template-rows: 88%;
}
</style>
