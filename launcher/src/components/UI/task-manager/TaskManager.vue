<template>
  <div class="task-parent">
    <div class="task-icon" @click="taskModalHandler">
      <img
        src="../../../../public/img/icon/task-manager-icons/task-manager-icon.png"
        alt=""
      />
    </div>
    <div class="task-modal-box" v-if="isTaskModalActive">
      <div class="task-table">
        <div class="table-content">
          <div class="table-row-faild bg-red-600 p-10">
            <div class="faild-icon">
              <img
                src="../../../../public/img/icon/task-manager-icons/close2.png"
                alt=""
              />
            </div>
            <span>Task #13</span>

            <div class="drop-icon">
              <img
                src="../../../../public/img/icon/task-manager-icons/task-up-icon.png"
                alt=""
              />
            </div>
          </div>
          <div class="table-row-success">
            <div class="success-icon">
              <img
                src="../../../../public/img/icon/task-manager-icons/check1.png"
                alt=""
              />
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
  border: 5px solid #444444;
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
  opacity: 0.99;
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
  border: 2px solid #444444;
  border-radius: 15px;
  /* background-color:#EB5353; */
  box-shadow: 0 0 3px 1px rgb(36, 36, 36);
  margin-top: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.table-content .table-row-success {
  width: 95%;
  height: 15%;
  border: 2px solid #444444;
  border-radius: 15px;
  background-color: rgb(126, 190, 24);
  box-shadow: 0 0 3px 1px rgb(36, 36, 36);
  margin-top: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.table-row-faild .faild-icon,
.table-row-success .success-icon,
.table-row-progress .progress-icon {
  width: 9%;
  height: 77%;
  background-color: #2c4030;
  border: 1px solid #444444;
  border-radius: 100%;
  margin-left: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}
.faild-icon img {
  width: 72%;
}
.success-icon img {
  width: 87%;
  height: 97%;
}
.progress-icon img {
  width: 60%;
}
.drop-icon {
  width: 15%;
  height: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.drop-icon img {
  width: 53%;
  height: 86%;
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
  width: 100%;
  height: 16%;
  border-top: 4px solid rgb(86, 84, 84);
  background-color: rgb(49, 49, 49);
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
