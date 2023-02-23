<template>
  <div class="drop-icon" @click="openSubTasksHandler">
    <img v-if="isSubTasksActive" src="../../../../public/img/icon/task-manager-icons/up.png" alt="" />
    <img v-else src="../../../../public/img/icon/task-manager-icons/down.png" alt="" />
  </div>
</template>
<script>
export default {
  props: ["item"],
  data() {
    return {
      isSubTasksActive: false,
    };
  },
  methods: {
    openSubTasksHandler() {
      this.isSubTasksActive = !this.isSubTasksActive;
      this.$emit("droptaskActive", this.item);
    },
  },
};
</script>
<style scoped>
.drop-icon {
  width: 8%;
  height: 72%;
  margin-right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.drop-icon img {
  width: 100%;
  height: 100%;
  cursor: pointer;
}
</style>
