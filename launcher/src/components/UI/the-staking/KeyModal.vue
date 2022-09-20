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
  z-index: 998;
}
.modal-opacity {
  width: 100%;
  height: 100%;
  background-color: black;
  position: fixed;
  left: 0;
  top: 0;
  opacity: 0.7;
  z-index: 999;
}
.key-modal-content {
  width: 55%;
  height: 60%;
  border-radius: 75px;
  border: 3px solid #bfbfbf;
  position: absolute;
  top: 10%;
  left: 18%;
  background-color: #33393e;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  box-shadow: 1px 1px 5px 1px rgb(6, 6, 6);
  z-index: 1000;
}

.close {
  color: rgb(154, 154, 154);
  font-size: 0.55rem;
  font-weight: 500;
  align-self: center;
}
</style>
