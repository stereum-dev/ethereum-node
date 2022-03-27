<template>
  <div class="modal-parent">
    <div class="modal-opacity" @click="$emit('close-modal')"></div>
    <div class="modal-box">
      <div class="modal">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['list'],
};
</script>
<style scoped>
.modal-parent {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: -7px;
  left: -11px;
  z-index: 5;
}
.modal-opacity {
  width: 100vw;
  height: 100vh;
  background-color: rgb(0, 0, 0);
  z-index: 6;
  opacity: 0.8;
}

.modal-box {
  width: 45%;
  height: 65%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 10%;
  left: 28%;
  z-index: 7;
}
.modal {
  width: 100%;
  height: 100%;
  border: 3px solid rgb(43, 43, 43);
  border-radius: 35px;
  background-color: rgb(210, 207, 197);
}
</style>
