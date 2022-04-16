<template>
  <div class="card">
      <slot></slot>
  </div>
</template>
<style scoped>
.card {
  margin: 2%;
  border-radius: 10px;
  border: 1px solid rgb(52, 52, 52);
  background: rgb(42, 42, 42);
  box-sizing: border-box;
  box-shadow: 0 0 10px 1px rgb(23, 23, 23);
  text-decoration: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1;
}

.card:hover {
  background: rgb(19, 16, 16);
}
.card:active {
  background: rgb(19, 16, 16);
}
</style>
