<template>
  <div class="task-parent">
    <div class="task-icon" @click="taskModalHandler">
      <img
        src="../../../../public/img/icon/task-manager-icons/task-manager-icon.png"
        alt=""
      />
    </div>
    <div class="bg-neutral-900 task-modal-box" v-if="isTaskModalActive">
      <div class="task-table">
        <div class="table-content">
          <div class="table-row-faild">
            <div class="process-icon">
              <svg class="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24">
                <!-- ... -->
              </svg>
            </div>
            <span>Task #13</span>

            <div class="drop-icon">
              <img
                src="../../../../public/img/icon/task-manager-icons/task-up-icon.png"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
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
  opacity: 0.9;
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
  opacity: 0.9;
}
.table-content::webkit-scrollbar {
  width: 1px;
}
.task-table .table-content {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 5px;
}
.table-content .table-row-faild {
  width: 95%;
  height: 15%;
  border: 2px solid rgb(147, 145, 145);
  border-radius: 15px;
  background-color: rgb(245, 59, 59);
  box-shadow: 0 0 3px 1px rgb(36, 36, 36);
  margin-top: 5px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.table-content .table-row-success {
  width: 95%;
  height: 15%;
  border: 2px solid rgb(147, 145, 145);
  border-radius: 15px;
  background-color: rgb(126, 190, 24);
  box-shadow: 0 0 3px 1px rgb(36, 36, 36);
  margin-top: 5px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.table-row-faild .process-icon,
.table-row-success .process-icon,
.table-row-progress .process-icon {
  width: 7%;
  height: 64%;
  background-color: #2c4030;
  border: 2px solid rgb(46, 46, 46);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}
.process-icon svg {
  z-index: 2;
}
.drop-icon {
  width: 15%;
  height: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.drop-icon img {
  width: 60%;
  height: 95%;
}
.table-row-faild span,
.table-row-success span {
  width: 70%;
  text-align: center;
  font-size: 1rem;
  font-weight: 700;
  color: rgb(53, 53, 53);
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
