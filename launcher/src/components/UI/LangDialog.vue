<template>
  <dialog open v-if="open">
    <slot> </slot>
  </dialog>
</template>

<script>
export default {
  name: "LangDialog",
  props: ["open"],
};
</script>

<style scoped>
dialog {
  position: fixed;
  top: 12%;
  width: 90%;
  height: 75%;
  margin: 0 auto;
  box-shadow: 1px 1px 5px 1px rgba(31, 31, 31, 0.26);
  border: 5px solid #919191;
  border-radius: 20px;
  padding: 1rem;
  background-color: #1d3d3ad7;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
  overflow-x: hidden;
  overflow-y: auto;
}
dialog::-webkit-scrollbar {
  width: 1px;
}
</style>
