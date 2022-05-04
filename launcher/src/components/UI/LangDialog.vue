<template>
  <dialog open v-if="open">
    <slot> </slot>
  </dialog>
</template>

<script>
export default {
  name: 'LangDialog',
  props: ['open']
}
</script>

<style scoped>
dialog {
  position: fixed;
  top: 40%;
  min-width: 20rem;
  margin: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  border-radius: 20px;
  padding: 1rem;
  background-color: white;
  border: solid 5px rgba(15, 15, 15, 0.5);
  background-color: rgba(76, 72, 72, 0.5);
  resize: both;
}
</style>
