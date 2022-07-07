<template>
  <div class="button-parent">
    <div class="btn" :class="{ active: isActive }" @click="toggle">
      <span>{{ isActive ? "ON" : "OFF" }}</span>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isActive: false,
    };
  },

  methods: {
    toggle() {
      this.isActive = this.isActive ? false : true;
    },
  },
};
</script>
<style scoped>
.btn {
  display: flex;
  width: 30%;
  font-size: 70%;
  font-weight: bold;
  border: 1px solid gray;
  padding: 0 2px;
  border-radius: 10px;
  cursor: pointer;
  color: red;
  justify-content: center;
  align-items: center;
}
.active {
  color: greenyellow !important;
}
</style>
