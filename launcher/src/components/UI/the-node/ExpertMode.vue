<template>
  <div class="expert-parent">
    <div class="opacityBackground" @click="$emit('hideModal')"></div>
    <div class="expert-modal">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import { mapWritableState } from "pinia";
import { useServices } from "@/store/services";
export default {
  props: ["item"],
  computed: {
    ...mapWritableState(useServices, {}),
  },
};
</script>
<style scoped>
.expert-parent {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}
.opacityBackground {
  width: 100%;
  height: 100%;
  background-color: rgb(8, 8, 8);
  opacity: 0.4;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1001;
  cursor: default;
}
.expert-modal {
  width: 44%;
  height: 84%;
  background-color: #33393e;
  box-shadow: 0px 1px 3px 1px rgb(19, 19, 19);
  border-radius: 5px;
  border: 3px solid #adadad;
  position: absolute;
  top: 10.4%;
  left: 19%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  z-index: 1002;
  cursor: default;
}
</style>
