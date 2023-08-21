import { defineStore } from "pinia";
export const useTaskManager = defineStore("taskManager", {
  state: () => {
    return {
      playbookTasks: [],
      taskManagerIcons: {
        progressIcon: require("../../public/img/icon/task-manager-icons/task-manager-icon.png"),
        activeIcon: require("../../public/img/icon/task-manager-icons/task-blue-icon.png"),
        successIcon: require("../../public/img/icon/task-manager-icons/task-green-icon.png"),
        failedIcon: require("../../public/img/icon/task-manager-icons/task-red-icon.png"),
      },
      installIconSrc: {
        activeInstallIcon: require("../../public/img/icon/task-manager-icons/turning_circle.gif"),
        successInstallIcon: require("../../public/img/icon/task-manager-icons/check5.png"),
        failedInstallIcon: require("../../public/img/icon/task-manager-icons/cancel.png"),
      },
    };
  },
  getters: {},
  actions: {},
});
