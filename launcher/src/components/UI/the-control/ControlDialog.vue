<template>
  <transition name="modal">
    <dialog v-if="open" open>
      <slot></slot>
    </dialog>
  </transition>
</template>

<script>
export default {
  props: {
    open: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style scoped>
dialog {
  border-radius: 10px;
  z-index: 100;
  position: fixed;
  top: 15%;
  left: 60%;
  height: 10%;
  max-width: max-content;
  border: 3px solid #929292;
  background: #000;
  color: #eee;
}

.modal-enter-active {
  animation: modal 0.2s ease-out;
}

.modal-leave-active {
  animation: modal 0.2s ease-in reverse;
}

@keyframes modal {
  from {
    opacity: 0;
    transform: translateY(200px) scale(0.5);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
