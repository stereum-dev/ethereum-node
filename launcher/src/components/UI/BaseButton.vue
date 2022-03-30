<template>
  <button id="BaseButton">
    <slot></slot>
  </button>
</template>

<style scoped>
button {
  width:auto;
  border-radius: 40px;
  background-color: rgb(43, 63, 58);
  text-align: center;
  font-weight: bold;
  padding: 10px;
  font-size: 16pt;
  color: #eee;
  cursor: pointer;
}
button:hover {
  background-color: grey;
}
</style>
