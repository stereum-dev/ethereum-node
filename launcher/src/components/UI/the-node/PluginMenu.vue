<template>
  <div class="menu-parent">
    <slot></slot>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
};
</script>
<style scoped>
.menu-parent {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
