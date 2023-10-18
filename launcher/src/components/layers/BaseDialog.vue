<template>
  <dialog open>
    <slot name="title"></slot>
    <slot name="des"></slot>
    <button id="ok" @click="$emit('bDialogDis', true)"><slot name="cancel"></slot></button>
    <button id="canc" @click="$emit('bDialogOk', true)"><slot name="ok"></slot></button>
  </dialog>
</template>
<script>
export default {
  name: "BaseDialog",
  emits: ["bDialogDis", "bDialogOk"],
};
</script>
<style scoped>
dialog {
  border-radius: 40px;
  background-color: rgba(248, 247, 247, 0.849);
  resize: both;
  border: solid 3px rgb(124, 119, 119);
  z-index: 100;
  opacity: 140%;
}
#ok {
  border-radius: 15px 0 0 15px;
  background-color: rgb(124, 119, 119);
  font-weight: bold;
  color: #fff;
}
#canc {
  border-radius: 0 15px 15px 0;
  background-color: rgb(124, 119, 119);
  font-weight: bold;
  color: #fff;
}
</style>
