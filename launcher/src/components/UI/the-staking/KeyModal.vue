<template>
  <div class="key-modal-parent">
    <div class="modal-opacity" @click="$emit('hideModal')"></div>
    <div class="key-modal-content">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
   
    };
  },
};
</script>
<style scoped>
.key-modal-parent {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 10%;
  left: 5%;
  z-index: 310;
}
.modal-opacity {
  width: 100%;
  height: 100%;
  background-color: black;
  position: fixed;
  left: 0;
  top: 0;
  opacity: 0.7;
  z-index: 311;
}
.key-modal-content {
  width: 50%;
  height: 50%;
  border-radius: 1rem;
  background-color: #363a41;
  border: 4px solid rgb(171, 170, 170);
  z-index: 312;
  opacity: 1;
  position: absolute;
  top: 13%;
  left: 20%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  box-shadow: 1px 1px 5px 1px rgb(6, 6, 6);
}

.close {
  color: rgb(154, 154, 154);
  font-size: 0.55rem;
  font-weight: 500;
  align-self: center;
}
</style>
