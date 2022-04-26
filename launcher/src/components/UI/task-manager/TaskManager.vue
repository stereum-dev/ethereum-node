<template>
  <div class="task-parent">
    <div class="task-icon" @click="taskModalHandler">
      <img
        src="../../../../public/img/icon/manage-node-icons/task-manager-icon.png"
        alt=""
      />
    </div>
    <div class="task-modal-box" v-if="isTaskModalActive"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isTaskModalActive: false,
    };
  },
  methods: {
    taskModalHandler() {
      this.isTaskModalActive = !this.isTaskModalActive;
    },
  },
};
</script>
<style scoped>
.task-parent {
  max-width: 50px;
  max-height: 55px;
  position: fixed;
  left: 4px;
  bottom: 0;
}
.task-icon {
  width: 100%;
  height: 100%;
}
.task-icon img {
  width: 80%;
  height: 80%;
}
.task-modal-box {
  width: 20%;
  height: 40%;
  border: 4px solid red;
  position: fixed;
  left: 5px;
  bottom: 6px;
  z-index: -1;
}
</style>
