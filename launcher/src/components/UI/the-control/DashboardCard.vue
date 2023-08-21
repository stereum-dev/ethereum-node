<template>
  <div class="card">
    <slot></slot>
  </div>
</template>
<style scoped>
.card {
  margin: 1%;
  background: #2a2a2a;
  border-radius: 10px;
  border: 1px solid #343434;
  box-shadow: 1px 1px 10px 1px #171717;
  text-decoration: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1;
  position: relative;
}

.card:hover {
  background: #313131;
}

.card:active {
  background: #313131;
}
</style>
