<template>
  <div class="task-parent">
    <div class="task-icon" @click="taskModalHandler">
      <img :src="mainTaskIcon" alt="icon" />
    </div>
    <div class="task-modal-box" v-if="isTaskModalActive">
      <div class="task-table">
        <div class="table-content">
          <div
            class="table-row"
            v-for="(item, index) in playbookTasks"
            :key="index"
          >
            <!-- <div class="table-row-active">
              <div class="active-icon">
                <img :src="installIconSrc.activeInstallIcon" alt="icon" />
              </div>
              <span>AKTIVE TASK</span>
            </div> -->
            <div
              class="table-row-success"
              v-if="item.status === 'success' || item.status === 'changed'"
            >
              <div class="success-icon">
                <img :src="installIconSrc.successInstallIcon" alt="icon" />
              </div>
              <span>{{ item.playbook }}</span>

              <drop-tasks
                :item="item"
                @droptaskActive="openDropDown"
              ></drop-tasks>
            </div>
            <div class="table-row-failed" v-if="item.status === 'failed'">
              <div class="failed-icon">
                <img :src="installIconSrc.failedInstallIcon" alt="icon" />
              </div>
              <span>{{ item.playbook }}</span>
              <drop-tasks
                :item="item"
                @droptaskActive="openDropDown"
              ></drop-tasks>
            </div>
            <sub-tasks
              v-if="item.showDropDown"
              :subTasks="item?.tasks"
            ></sub-tasks>
          </div>
        </div>
      </div>
      <div class="list-cleaner" @click="listCleanerHandler">
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
import DropTasks from "./DropTasks.vue";
export default {
  components: { SubTasks, DropTasks },
  data() {
    return {
      isTaskModalActive: false,
      showDropDownList: false,
      playbookTasks: [],
      dataTasks: [
        {
          id: 1,
          playbook: "Geth",
          status: "success",
          showDropDown: false,
          tasks: [
            {
              name: "Preparing node",
              action: "SUB TASK SUCCEEDED",
              status: "failed",
            },
            {
              name: "Writing service configs",
              action: "SUB TASK SUCCEEDED",
              status: "success",
            },
            {
              name: "Set firewall rules",
              action: "SUB TASK SUCCEEDED",
              status: "success",
            },
            {
              name: "Enable service docker",
              action: "SUB TASK SUCCEEDED",
              status: "success",
            },
          ],
        },
        {
          id: 2,
          playbook: "Nimbus",
          status: "success",
          showDropDown: false,
          tasks: [
            {
              name: "Removing conflicts",
              action: "SUB TASK SUCCEEDED",
              status: "success",
            },
            {
              name: "Writing service configs",
              action: "SUB TASK SUCCEEDED",
              status: "success",
            },
            {
              name: "Set firewall rules",
              action: "SUB TASK SUCCEEDED",
              status: "success",
            },
            {
              name: "Install docker",
              action: "SUB TASK SUCCEEDED",
              status: "success",
            },
          ],
        },
        {
          id: 3,
          playbook: "Lighthouse",
          status: "failed",
          showDropDown: false,
          tasks: [
            {
              name: "Removing conflicts",
              action: "SUB TASK SUCCEEDED",
              status: "success",
            },
            {
              name: "Writing service configs",
              action: "SUB TASK FAILED",
              status: "failed",
            },
            {
              name: "Set firewall rules",
              action: "SUB TASK SUCCEEDED",
              status: "success",
            },
            {
              name: "Install docker",
              action: "SUB TASK SUCCEEDED",
              status: "success",
            },
          ],
        },
      ],
      taskManagerIcons: {
        progressIcon: require("../../../../public/img/icon/task-manager-icons/task-manager-icon.png"),
        activeIcon: require("../../../../public/img/icon/task-manager-icons/task-blue-icon.png"),
        successIcon: require("../../../../public/img/icon/task-manager-icons/task-green-icon.png"),
        failedIcon: require("../../../../public/img/icon/task-manager-icons/task-red-icon.png"),
      },
      installIconSrc: {
        activeInstallIcon: require("../../../../public/img/icon/task-manager-icons/turning_circle_alt2.gif"),
        successInstallIcon: require("../../../../public/img/icon/task-manager-icons/check3.png"),
        failedInstallIcon: require("../../../../public/img/icon/task-manager-icons/close3.png"),
      },
    };
  },
  mounted() {
    this.playbookTasks = this.dataTasks;
  },

  computed: {
    checkTaskStatus() {
      this.playbookTasks.map((el) => {
        let taskStatus = el.tasks.some((task) => {
          return task.status === "failed";
        });
        if (taskStatus) {
          el.status === "failed";
        }
      });
    },
    mainTaskIcon() {
      let mainIconColor = this.playbookTasks.some(
        (el) => el.status === "failed"
      );
      if (mainIconColor) {
        return this.taskManagerIcons.failedIcon;
      } else {
        return this.taskManagerIcons.successIcon;
      }
    },
  },
  methods: {
    taskModalHandler() {
      this.isTaskModalActive = !this.isTaskModalActive;
    },

    openDropDown(item) {
      item.showDropDown = !item.showDropDown;
      if (item.showDropDown) {
        this.playbookTasks = this.dataTasks.filter((task) => {
          return task.playbook == item.playbook;
        });
      } else {
        this.playbookTasks = this.dataTasks;
      }
    },
    listCleanerHandler() {
      this.playbookTasks = [];
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
  bottom: 4px;
  z-index: 99;
}
.task-icon {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  cursor: pointer;
}
.task-icon img {
  width: 60%;
  height: 65%;
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
  position: relative;
}
.plugin-row {
  width: 100%;
  height: 100%;
}
.table-content .table-row-failed {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  background-color: #df5656;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.table-content .table-row-success {
  width: 100%;
  height: 100%;
  border-radius: 15px;
  background-color: #5ed285;
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
.table-row-success .success-icon {
  width: 16px;
  height: 16px;
  /* background-color: #292929; */
  background-color: #323232;
  border: 2px solid #444444;
  border-radius: 50%;
  margin-left: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.failed-icon img {
  width: 12px;
  height: 11px;
}
.success-icon img {
  width: 13px;
  height: 14px;
}
.active-icon img {
  width: 20px;
  height: 20px;
  margin-top: 2px;
}

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
