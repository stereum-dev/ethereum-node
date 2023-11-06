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
  grid-column: 4/12;
  grid-row: 3/4;
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  align-self: flex-end;
  margin-bottom: -9px;
}
.searchBox .textBox {
  width: 100%;
  height: 100%;
  border-radius: 50px;
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
