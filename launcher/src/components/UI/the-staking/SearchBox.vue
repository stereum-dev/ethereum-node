<template>
  <div class="searchBox">
    <div class="textBox">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "SearchBox",


};
</script>
<style scoped>
.searchBox {
  grid-column: 3/11;
  grid-row: 2/3;
  width: 100%;
  height: 40px;
  margin-top: 21px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
}
.searchBox .textBox {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}


/* 
.searchBox .textBox img {
  width: 10px;
  cursor: pointer;
} */
</style>
