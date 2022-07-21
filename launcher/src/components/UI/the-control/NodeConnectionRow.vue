<template>
  <div class="rowParent">
    <div class="title">
      <span>{{ rowName }}</span>
    </div>
    <div class="btn" :class="{ active: isActive }" @click="toggle">
      <span>{{ onoff }}</span>
    </div>
  </div>
</template>
<script>
export default {
  props: ["rowName"],
  data() {
    return {
      isActive: false,
    };
  },
  computed: {
    onoff() {
      return this.isActive ? "ON" : "OFF";
    },
  },

  methods: {
    toggle() {
      this.isActive = this.isActive ? false : true;
    },
  },
};
</script>
<style scoped>
.rowParent {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 35%;
  border-radius: 10px;
  margin: 1% 0;
}
.active {
  color: greenyellow !important;
}
.title {
  display: flex;
  width: 70%;
  font-size: 48%;
  justify-content: flex-start;
  align-items: center;
  margin: 0 4%;
  font-weight: 600;
}
.btn {
  display: flex;
  width: 30%;
  font-size: 50%;
  font-weight: 800;
  padding: 0 1px;
  border-radius: 5px;
  cursor: pointer;
  color: #eee;
  justify-content: center;
  align-items: center;
  height: 90%;
  border: 1px solid #343434;
  background: rgb(42, 42, 42);
}
</style>
