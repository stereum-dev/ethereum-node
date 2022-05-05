<template>
  <div class="task-parent">
    <div class="task-icon" @click="taskModalHandler">
      <img
        v-if="installIsActive || installInProgress"
        src="../../../../public/img/icon/task-manager-icons/task-manager-icon.png"
        alt=""
      />
      <img
        v-if="installFailed"
        src="../../../../public/img/icon/task-manager-icons/task-red-icon.png"
        alt=""
      />
      <img
        v-if="installedSuccessfully"
        src="../../../../public/img/icon/task-manager-icons/task-green-icon.png"
        alt=""
      />
    </div>
    <div class="task-modal-box" v-if="isTaskModalActive">
      <div class="task-table">
        <div class="table-content">
          <div
            class="table-row"
            v-for="(item, index) in pluginsInstalling"
            :key="index"
          >
            <div class="table-row-active" v-if="installIsActive">
              <div class="active-icon">
                <span class="loader"></span>
              </div>
              <span>{{ item.name }}</span>

              <div class="drop-icon">
                <img
                  src="../../../../public/img/icon/task-manager-icons/task-up-icon.png"
                  alt=""
                />
              </div>
            </div>
            <div class="table-row-progress" v-if="installInProgress">
              <div class="progress-icon"></div>
              <span>{{ item.name }}</span>

              <div class="drop-icon">
                <img
                  src="../../../../public/img/icon/task-manager-icons/task-up-icon.png"
                  alt=""
                />
              </div>
            </div>
            <div class="table-row-success" v-if="installedSuccessfully">
              <div class="success-icon">
                <img
                  src="../../../../public/img/icon/task-manager-icons/checkf.png"
                  alt=""
                />
              </div>
              <span>{{ item.name }}</span>
              <div class="drop-icon">
                <img
                  src="../../../../public/img/icon/task-manager-icons/task-up-icon.png"
                  alt=""
                />
                <img
                  v-if="openTaskActive"
                  src="../../../../public/img/icon/task-manager-icons/task-down-icon.png"
                  alt=""
                />
              </div>
            </div>
            <div class="table-row-faild" v-if="installFailed">
              <div class="faild-icon">
                <img
                  src="../../../../public/img/icon/task-manager-icons/close2.png"
                  alt=""
                />
              </div>
              <span>{{ item.name }}</span>

              <div class="drop-icon">
                <img
                  src="../../../../public/img/icon/task-manager-icons/task-up-icon.png"
                  alt=""
                />
              </div>
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
import { mapGetters, mapState } from "vuex";
export default {
  data() {
    return {
      installIsActive: true,
      installInProgress: false,
      installedSuccessfully: false,
      installFailed: false,
      isTaskModalActive: false,
      openTaskActive: false,
      closeTaskActive: false,
      pluginsInstalling: [
        {
          name: "Geth",
          installingTask: "TASK ACTIVE",
          queueTask: "TASK IN QUE",
          successfullTask: "TASK SUCCEEDED",
          failedTask: "TASK FAILED",
          subTasks: {
            installingSubTask: "SUB TASK ACTIVE",
            queueSubTask: "SUB TASK IN QUE",
            successfullSubTask: "SUB TASK SUCCEEDED",
            failedSubTask: "SUB TASK FAILED",
          },
        },
        {
          name: "Nimbus",
          installingTask: "TASK ACTIVE",
          queueTask: "TASK IN QUE",
          successfullTask: "TASK SUCCEEDED",
          failedTask: "TASK FAILED",
          subTasks: {
            installingSubTask: "SUB TASK ACTIVE",
            queueSubTask: "SUB TASK IN QUE",
            successfullSubTask: "SUB TASK SUCCEEDED",
            failedSubTask: "SUB TASK FAILED",
          },
        },
      ],
    };
  },
  mounted() {
    this.installationfailedHandler();
  },
  methods: {
    taskModalHandler() {
      this.isTaskModalActive = !this.isTaskModalActive;
    },
    installationfailedHandler() {
      setTimeout(() => {
        this.installIsActive = false;
        this.installFailed = true;
      }, 5000);
      setTimeout(() => {
        this.installIsActive = false;
        this.installFailed = false;
        this.installedSuccessfully = true;
      }, 10000);
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
  cursor: pointer;
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
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  /* opacity: 0.9; */
  opacity: 0.99;
  position: fixed;
  left: 4px;
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
.table-content .table-row {
  width: 95%;
  height: 12%;
  border: 2px solid #888888;
  border-radius: 20px;
  box-shadow: 0 1px 5px 1px rgb(35, 35, 35);
  margin-top: 5px;
}
.table-content .table-row-faild {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  background-color: #de2727;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.table-content .table-row-success {
  width: 100%;
  height: 100%;
  border-radius: 15px;
  background-color: rgb(126, 190, 24);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.table-content .table-row-progress {
  width: 100%;
  height: 100%;
  border-radius: 15px;
  background-color: rgb(104, 104, 104);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.table-content .table-row-active {
  width: 100%;
  height: 100%;
  border-radius: 15px;
  background-color: rgb(92, 182, 251);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.table-row-faild .faild-icon,
.table-row-success .success-icon,
.table-row-active .active-icon,
.table-row-progress .progress-icon {
  width: 6%;
  height: 70%;
  /* background-color: #292929; */
  background-color: #323232;
  border: 2px solid #444444;
  border-radius: 50%;
  margin-left: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.faild-icon img {
  width: 84%;
  height: 84%;
}
.success-icon img {
  width: 84%;
  height: 84%;
}
.active-icon .loader {
  border: 2px solid transparent;
  border-radius: 50%;
  border-top: 2px solid #ffffff;
  border-right: 2px solid #ffffff;
  /* border-bottom: 2px solid #ffffff; */
  /* border-left: 2px solid #ffffff; */
  width: 68%;
  height: 64%;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

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
.table-row-faild span,
.table-row-active span,
.table-row-success span,
.table-row-progress span {
  width: 70%;
  text-align: center;
  font-size: 1rem;
  font-weight: 700;
  color: rgb(53, 53, 53);
}
.list-cleaner {
  width: 97%;
  height: 12%;
  border: 3px solid #444444;
  border-radius: 7px;
  background-color: rgb(97, 97, 97);
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.list-cleaner img {
  width: 10%;
  height: 97%;
  margin-right: 1px;
  cursor: pointer;
}
</style>
