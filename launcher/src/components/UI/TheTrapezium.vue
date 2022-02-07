<template>
  <section id="main">
    <section id="contTra">
      <div id="trapezoid">
        <slot></slot>
      </div>
    </section>
  </section>
</template>

<script></script>

<style scoped>
#trapezoid {
  height: 0;
  width: auto;
  margin: 5px auto;
  border-bottom: 7rem solid #05ed08;
  border-left: 7rem solid transparent;
  border-right: 7rem solid transparent;
}
#contTra {
  border: 3px solid red;
  margin: auto;
  height: 99%;
  width: 98%;
}
</style>
