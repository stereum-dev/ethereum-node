<template>
  <div class="card">
      <slot></slot>
  </div>
</template>
<style scoped>
.card {
  margin: 1%;
  border-radius: 10px;
  border: 1px solid #343434;
  background: rgb(42, 42, 42);
  box-sizing: border-box;
  box-shadow: 1px 1px 10px 1px rgb(23, 23, 23);
  text-decoration: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1;
  cursor: pointer;
}

.card:hover {
  background: #313131;
}
.card:active {
  background: #313131;
}
</style>
