import { defineStore } from "pinia";
export const useTaskManager = defineStore("taskManager", {
  state: () => {
    return {
      isTaskModalActive: false,
      errorAlarm: false,
      UpdatedSubtasks: [],
      stopIntervalForModal: false,
      playbookTasks: [],
      taskManagerIcons: {
        progressIcon: "/img/icon/task-manager-icons/task-manager-icon.png",
        activeIcon: "/img/icon/task-manager-icons/task-blue-icon.png",
        successIcon: "/img/icon/task-manager-icons/task-green-icon.png",
        failedIcon: "/img/icon/task-manager-icons/task-red-icon.png",
      },
      installIconSrc: {
        activeInstallIcon: "/animation/loading/turning-circle.gif",
        successInstallIcon: "/img/icon/task-manager-icons/check-icon.png",
        failedInstallIcon: "/img/icon/task-manager-icons/cancel-icon.png",
      },
    };
  },
  getters: {},
  actions: {},
});
