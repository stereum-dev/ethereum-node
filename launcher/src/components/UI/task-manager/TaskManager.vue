<template>
  <div class="task-parent">
    <div class="task-icon" @click="taskModalHandler">
      <img :src="mainTaskIcon" alt="icon" />
    </div>
    <div class="task-modal-box" v-if="isTaskModalActive">
      <div class="task-table">
        <div class="table-content" id="table-content">
          <div
            class="table-row"
            v-for="(item, index) in pluginsInstalling"
            :key="index"
          >
            <div class="table-row-progress" v-if="item.status == 'progress'">
              <div class="progress-icon"></div>
              <span>{{ item.name }}</span>

              <drop-subtasks
                :openSubTasks="openSubTasksHandler"
              ></drop-subtasks>
            </div>
            <div class="table-row-active" v-if="item.status == 'active'">
              <div class="active-icon">
                <img :src="installIconSrc.activeInstallIcon" alt="icon" />
              </div>
              <span>{{ item.name }}</span>

              <drop-subtasks
                :openSubTasks="openSubTasksHandler"
              ></drop-subtasks>
            </div>
            <div class="table-row-success" v-if="item.status == 'success'">
              <div class="success-icon">
                <img :src="installIconSrc" alt="icon" />
              </div>
              <span>{{ item.name }}</span>

              <drop-subtasks
                :openSubTasks="openSubTasksHandler"
              ></drop-subtasks>
            </div>
            <div class="table-row-failed" v-if="item.status == 'failed'">
              <div class="failed-icon">
                <img :src="installIconSrc" alt="icon" />
              </div>
              <span>{{ item.name }}</span>

              <drop-subtasks
                :openSubTasks="openSubTasksHandler"
              ></drop-subtasks>
            </div>
            <sub-tasks
              :subTasks="item?.subTasks"
              v-if="isSubTasksActive"
            ></sub-tasks>
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
import SubTasks from "./SubTasks.vue";
import DropSubtasks from "./DropTasks.vue";
export default {
  components: { SubTasks, DropSubtasks },
  data() {
    return {
      isTaskModalActive: false,
      isSubTasksActive: false,
      pluginsInstalling: [
        {
          name: "Geth",
          status: "active",
          statusLabel: "TASK ACTIVE",
          subTasks: [
            {
              status: "active",
              statusLabel: "SUB TASK ACTIVE",
            },
          ],
        },
        {
          name: "Nimbus",
          status: "success",
          statusLabel: "TASK SUCCEEDED",
          subTasks: [
            {
              status: "success",
              statusLabel: "SUB TASK SUCCEEDED",
            },
          ],
        },
        {
          name: "Lighthouse",
          status: "failed",
          statusLabel: "TASK FAILED",
          subTasks: [
            {
              status: "failed",
              statusLabel: "SUB TASK FAILED",
            },
          ],
        },
        {
          name: "Grafana",
          status: "progress",
          statusLabel: "TASK IN QUEUE",
          subTasks: [
            {
              status: "progress",
              statusLabel: "SUB TASK IN QUEUE",
            },
          ],
        },
      ],
      taskManagerIcons: [
        {
          progressIcon: require("../../../../public/img/icon/task-manager-icons/task-manager-icon.png"),
        },
        {
          activeIcon: require("../../../../public/img/icon/task-manager-icons/task-blue-icon.png"),
        },
        {
          successIcon: require("../../../../public/img/icon/task-manager-icons/task-green-icon.png"),
        },
        {
          failedIcon: require("../../../../public/img/icon/task-manager-icons/task-red-icon.png"),
        },
      ],
      installIconSrc: {
        activeInstallIcon: require("../../../../public/img/icon/task-manager-icons/task-blue-icon.png"),

        successInstallIcon: require("../../../../public/img/icon/task-manager-icons/task-green-icon.png"),

        failedInstallIcon: require("../../../../public/img/icon/task-manager-icons/task-red-icon.png"),
      },
    };
  },
  mounted() {
    this.installationfailedHandler();
  },
  computed: {
    mainTaskIcon() {
      this.pluginsInstalling.forEach((plugin) => {
        if (plugin.status == "failed") {
          return this.taskManagerIcons.failedIcon;
        } else if (plugin.status == "active") {
          return this.taskManagerIcons.activeIcon;
        } else if (plugin.status == "success") {
          return this.taskManagerIcons.successIcon;
        } else {
          return this.taskManagerIcons.progressIcon;
        }
      });
    },
    // installImgSrc(item) {
    //   if (item.status == "failed") {
    //     return this.installIconSrc.failedInstallIcon;
    //   } else if (item.status == "active") {
    //     return this.installIconSrc.activeInstallIcon;
    //   } else if (item.status == "success") {
    //     return this.installIconSrc.successInstallIcon;
    //   } else {
    //     return;
    //   }
    // },
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
    openSubTasksHandler() {
      this.isSubTasksActive = !this.isSubTasksActive;
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
  z-index: 99;
}
.task-icon {
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.task-icon img {
  width: 50%;
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
.task-table .table-content::webkit-scrollbar {
  visibility: hidden;
  display: none;
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
.table-content .table-row-failed {
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
.table-row-failed .failed-icon,
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
.failed-icon img,
.active-icon img,
.success-icon img {
  width: 84%;
  height: 84%;
}
/* .active-icon img {
  border: 2px solid transparent;
  border-radius: 50%;
  border-top: 2px solid #ffffff;
  border-right: 2px solid #ffffff;
  width: 68%;
  height: 64%;
  animation: spin 2s linear infinite;
} */

/* @keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
} */

.table-row-failed span,
.table-row-active span,
.table-row-success span,
.table-row-progress span {
  width: 70%;
  text-align: center;
  font-size: 0.9rem;
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
