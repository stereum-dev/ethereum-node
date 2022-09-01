<template>
  <dialog open>
    <slot></slot>
  </dialog>
</template>
<script>
export default {
  props: ["open"],
};
</script>
<style scoped>
dialog {
  border-radius: 10px;
  z-index: 10;
  position: fixed;
  top: 15%;
  left: 60%;
  height: 10%;
  width: 30%;
  border: 3px solid #929292;
  background: #000;
  color: #eee;
}
</style>
