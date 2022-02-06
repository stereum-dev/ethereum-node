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

  width:  65%;
  border-bottom: 7rem solid #05ed08;
  border-left: 7rem solid transparent;
  border-right: 7rem solid transparent;
  margin: 5px auto;
  resize: both;
  grid-row-start: 1;
  grid-row-end: 2;

}
#contTra {
  border: 3px solid red;
  margin: auto;
  height: 99%;
  width: 98%;
  display: grid;
  grid-template-columns: 90%;
  grid-template-rows: 98%;
justify-content: center;

  resize: both;
  
}
</style>
