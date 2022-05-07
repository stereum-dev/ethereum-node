<template>
  <div class="drop-icon" @click="openSubTasks">
    <img
      v-if="isSubTasksActive"
      src="../../../../public/img/icon/task-manager-icons/task-down-icon.png"
      alt=""
    />
    <img
      v-else
      src="../../../../public/img/icon/task-manager-icons/task-up-icon.png"
      alt=""
    />
  </div>
</template>
<script>
export default {
  props: ["openSubTasks"],
  data() {
    return {};
  },
};
</script>
<style scoped>
.drop-icon {
  width: 7%;
  height: 70%;
  margin-right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.drop-icon img {
  width: 100%;
  height: 100%;
}
</style>
