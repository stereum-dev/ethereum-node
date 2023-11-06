<template>
  <div class="green">
    <slot></slot>
  </div>
</template>

<style scoped>
.green {
  width: 100vw;
  height: 100vh;
  background-color: #264744;
  z-index: -1;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  border-radius: 0 0 10px 10px;
}
</style>
