<template>
  <div class="task-parent">
    <div class="task-icon" @click="taskModalHandler" @mouseenter="cursorLocation = taskMng" @mouseleave="cursorLocation = ''">
      <img :src="mainTaskIcon" alt="icon" />
      <span class="notification">{{ displayingTasks.length }}</span>
    </div>
    <div v-if="isTaskModalActive" class="task-modal-box">
      <div class="task-table">
        <div class="table-content">
          <div v-for="(item, index) in displayingTasks" :key="index" class="table-row">
            <div v-if="item.status == null" class="table-row-active">
              <div class="active-icon">
                <img :src="installIconSrc.activeInstallIcon" alt="icon" />
              </div>
              <span>{{ item.name }}</span>
              <drop-tasks :item="item" @droptaskActive="openDropDown"></drop-tasks>
            </div>
            <div v-if="item.status === 'success'" class="table-row-success">
              <div class="success-icon">
                <img :src="installIconSrc.successInstallIcon" alt="icon" />
              </div>
              <span>{{ item.name }}</span>

              <drop-tasks :item="item" @droptaskActive="openDropDown"></drop-tasks>
            </div>
            <div v-if="item.status === 'failed'" class="table-row-failed">
              <div class="failed-icon">
                <img :src="installIconSrc.failedInstallIcon" alt="icon" />
              </div>
              <span>{{ item.name }}</span>
              <drop-tasks :item="item" @droptaskActive="openDropDown"></drop-tasks>
            </div>
            <sub-tasks v-if="item.showDropDown"></sub-tasks>
          </div>
        </div>
      </div>
      <div class="list-cleaner">
        <span class="footer-text">{{ $t("taskManager.clickDisplay") }}</span>
        <img src="/img/icon/task-manager-icons/remove-tasks.png" alt="" @click="listCleanerHandler" />
      </div>
    </div>
  </div>
</template>
<script>
import SubTasks from "./SubTasks.vue";
import DropTasks from "./DropTasks.vue";
import { mapWritableState } from "pinia";
import { useFooter } from "@/store/theFooter";
import { useTaskManager } from "@/store/taskManager";
import ControlService from "@/store/ControlService";
import { useServers } from "../../../store/servers";
export default {
  components: { SubTasks, DropTasks },
  data() {
    return {
      intervalId: null,
      // isTaskModalActive: false,
      showDropDownList: false,
      isTaskFailed: false,
      isTaskSuccess: false,
      polling: null,
      refresh: null,
      Tasks: [],
      displayingTasks: [],
      checkNewTasks: [],
      taskMng: this.$t("taskMang.taskMng"),
    };
  },
  computed: {
    ...mapWritableState(useTaskManager, {
      playbookTasks: "playbookTasks",
      taskManagerIcons: "taskManagerIcons",
      installIconSrc: "installIconSrc",
      UpdatedSubtasks: "UpdatedSubtasks",
      stopIntervalForModal: "stopIntervalForModal",
      errorAlarm: "errorAlarm",
      isTaskModalActive: "isTaskModalActive",
    }),
    ...mapWritableState(useFooter, {
      cursorLocation: "cursorLocation",
    }),
    ...mapWritableState(useServers, {
      allTasks: "allTasks",
    }),
    mainTaskIcon() {
      if (this.Tasks.some((task) => task.status === null)) {
        return this.taskManagerIcons.activeIcon;
      }
      if (this.Tasks.some((task) => task.status === "failed")) {
        return this.taskManagerIcons.failedIcon;
      }
      if (this.Tasks.some((task) => task.status === "success")) {
        return this.taskManagerIcons.successIcon;
      }
      return this.taskManagerIcons.progressIcon;
    },
  },
  watch: {
    Tasks() {
      if (this.Tasks.some((task) => task.status === "failed")) {
        this.errorAlarm = true;
      } else {
        this.errorAlarm = false;
      }
    },
    showDropDownList(newValue) {
      if (newValue == true && !this.stopIntervalForModal) {
        this.intervalId = setInterval(() => {
          this.getTasks();
          this.UpdatedSubtasks = this.displayingTasks[0].subTasks;
        }, 1000);
      } else {
        clearInterval(this.intervalId);
      }
    },
    stopIntervalForModal(newValue) {
      if (newValue === true) {
        clearInterval(this.intervalId);
      } else if (this.showDropDownList === true) {
        this.intervalId = setInterval(() => {
          this.getTasks();
          this.UpdatedSubtasks = this.displayingTasks[0].subTasks;
        }, 1000);
      }
    },
  },

  created() {
    this.checkNewTasks = this.displayingTasks;
  },

  mounted() {
    this.polling = setInterval(ControlService.updateTasks, 2000); //refresh playbook logs
    this.refresh = setInterval(this.getTasks, 1000); //refresh data
  },
  beforeUnmount() {
    clearInterval(this.polling);
    clearInterval(this.refresh);
  },
  methods: {
    getTasks: async function () {
      const freshTasks = await ControlService.getTasks();
      this.allTasks = freshTasks;
      this.Tasks = Array.isArray(freshTasks) ? freshTasks : this.Tasks;
      if (!this.showDropDownList) {
        this.displayingTasks = this.Tasks;
      } else if (this.displayingTasks.length > 0) {
        // check length of array to avoid side effects
        // if DropDown is open only update what the user sees so the menue doesn't close
        this.displayingTasks[0].subTasks = this.Tasks.find((t) => t.id === this.displayingTasks[0].id).subTasks;
        this.displayingTasks[0].status = this.Tasks.find((t) => t.id === this.displayingTasks[0].id).status;
      }
    },
    taskModalHandler() {
      if (this.isTaskModalActive) {
        this.checkNewTasks = this.displayingTasks;
        this.isTaskModalActive = false;
        this.showDropDownList = false;
        clearInterval(this.intervalId);
      } else {
        this.isTaskModalActive = true;
      }
    },

    openDropDown(item) {
      item.showDropDown = !item.showDropDown;
      window.scrollTo(0, 0);
      if (item.showDropDown) {
        this.showDropDownList = true;
        this.displayingTasks = this.Tasks.filter((e) => e.id === item.id);
      } else {
        this.showDropDownList = false;
        this.displayingTasks = this.Tasks;
      }
    },
    listCleanerHandler: async function () {
      this.displayingTasks = [];
      this.Tasks = [];
      this.showDropDownList = false;
      await ControlService.clearTasks();
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
  z-index: 100;
}
.task-icon {
  width: 65%;
  height: 100%;
  display: flex;
  justify-content: center;
  cursor: pointer;
  position: relative;
}
.task-icon img {
  width: 100%;
}
.task-icon .notification {
  position: absolute;
  top: -10%;
  right: -5%;
  width: 40%;
  height: 40%;
  max-width: 16px;
  max-height: 16px;
  padding: 0.5rem;
  background-color: #ff0000;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 0.6rem;
  font-weight: 600;
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

.task-table .table-content {
  width: 100%;
  height: 100%;
  min-height: 195px;
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-top: 5px;
}
/* width */
.table-content::-webkit-scrollbar {
  width: 3px;
}

/* Track */
.table-content::-webkit-scrollbar-track {
  background: transparent;
  height: 5px;
  cursor: pointer;
}

/* Handle */
.table-content::-webkit-scrollbar-thumb {
  background: rgb(34, 137, 127);
  border-radius: 3px;
}

/* Handle on hover */
.table-content::-webkit-scrollbar-thumb:hover {
  background: rgb(28, 87, 81);
}
.table-content .table-row {
  width: 97%;
  height: 29px;
  border: 2px solid #d9d9d9;
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
  background-color: #aa4343;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 0;
}
.table-content .table-row-success {
  width: 100%;
  height: 100%;
  border-radius: 15px;
  background-color: #4fba43;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 0;
}

.table-content .table-row-active {
  width: 100%;
  height: 100%;
  border-radius: 15px;
  background-color: #7ecde4;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
}

.table-row-failed .failed-icon {
  width: 10%;
  height: 100%;
  margin-left: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.table-row-active .active-icon {
  width: 20px;
  height: 20px;
  background-color: #323232;
  border: 2px solid #444444;
  border-radius: 50%;
  margin-left: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.table-row-success .success-icon {
  width: 10%;
  height: 100%;
  margin-left: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.failed-icon img {
  width: 17px;
  height: 17px;
}
.success-icon img {
  width: 20px;
  height: 20px;
}
.active-icon img {
  width: 20px;
  height: 16px;
}

.table-row-failed span {
  width: 70%;
  text-align: center;
  text-transform: capitalize;
  font-size: 0.8rem;
  font-weight: 600;
  color: rgb(220, 220, 220);
}
.table-row-active span,
.table-row-success span,
.table-row-progress span {
  width: 70%;
  text-align: center;
  text-transform: capitalize;
  font-size: 0.8rem;
  font-weight: 600;
  color: rgb(56, 56, 56);
}
.list-cleaner {
  width: 100%;
  height: 14%;
  border-top: 3px solid #444444;
  border-radius: 7px;
  background-color: rgb(97, 97, 97);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.list-cleaner img {
  width: 10%;
  height: 97%;
  margin-right: 1px;
  cursor: pointer;
}
.footer-text {
  font-size: 0.7rem;
  font-weight: 600;
  color: #c4c4c4;
  margin-left: 45px;
}
</style>
