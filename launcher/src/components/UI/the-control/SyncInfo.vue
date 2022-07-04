<template>
  <dialog open>
    <slot></slot>
  </dialog>
</template>

<style scoped>
dialog {
  margin: 0;
  position: fixed;
  top: 20vh;
  left: 40%;
  width: 30%;
  background-color: #000;
  color: #eee;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  padding: 1rem;
  border-radius: 5px;
  border: 1px solid white;
}
</style>
