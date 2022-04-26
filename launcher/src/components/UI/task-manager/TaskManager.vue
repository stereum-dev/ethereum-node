<template>
  <div class="task-parent">
    <div class="task-icon" @click="taskModalHandler">
      <img
        src="../../../../public/img/icon/task-manager-icons/task-manager-icon.png"
        alt=""
      />
    </div>
    <div class="task-modal-box" v-if="isTaskModalActive">
      <div class="task-table"></div>
      <div class="list-cleaner">
        <img
          src="../../../../public/img/icon/task-manager-icons/read-empty-list-icon.png"
          alt=""
        />
      </div>
    </div>
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
  width: 70%;
}
.task-modal-box {
  width: 25%;
  height: 40%;
  border: 5px solid rgb(105, 105, 105);
  background-color: #33393e;
  border-bottom: none;
  border-left: none;
  border-top-right-radius: 10px;
  opacity: .9;
  position: fixed;
  left: 5px;
  bottom: 4px;
  z-index: -1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.task-table {
  width: 100%;
  height: 80%;
  opacity: 0.7;
}
.list-cleaner {
  width: 99%;
  height: 16%;
  border: 4px solid rgb(86, 84, 84);
  border-bottom: none;
  border-left: none;
  border-top-right-radius: 10px;
  background-color: rgb(131, 131, 131);
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.list-cleaner img {
  width: 12%;
  height: 90%;
  margin-right: 5px;
}
</style>
