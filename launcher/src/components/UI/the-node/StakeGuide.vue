<template>
  <div class="bg-dark">
    <h1 v-if="firstMessage" class="first-message">Check if your Node is synced</h1>
  </div>
</template>
<script>
export default {
  data() {
    return {
      firstMessage: true,
    };
  },
  mounted() {
    setTimeout(() => {
      this.firstMessage = false;
    }, 5000);
  },
};
</script>
<style scoped>
.bg-dark {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 311;
}
.first-message {
  color: #c1c1c1;
  font-size: 400%;
  font-weight: 800;
}
</style>
