import { defineStore } from "pinia";
export const useTaskManager = defineStore("taskManager", {
  state: () => {
    return {
      playbookTasks: [],
      dataTasks: [
        // {
        //   id: 1,
        //   playbook: "Geth",
        //   status: null,
        //   showDropDown: false,
        //   tasks: [
        //     {
        //       name: "Preparing node",
        //       action: "SUB TASK SUCCEEDED",
        //       status: "failed",
        //     },
        //     {
        //       name: "Writing service configs",
        //       action: "SUB TASK SUCCEEDED",
        //       status: "success",
        //     },
        //     {
        //       name: "Set firewall rules",
        //       action: "SUB TASK SUCCEEDED",
        //       status: "success",
        //     },
        //     {
        //       name: "Enable service docker",
        //       action: "SUB TASK SUCCEEDED",
        //       status: "success",
        //     },
        //   ],
        // },
        {
          id: 2,
          playbook: "Nimbus",
          status: null,
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
      ],
      taskManagerIcons: {
        progressIcon: require("../../public/img/icon/task-manager-icons/task-manager-icon.png"),
        activeIcon: require("../../public/img/icon/task-manager-icons/task-blue-icon.png"),
        successIcon: require("../../public/img/icon/task-manager-icons/task-green-icon.png"),
        failedIcon: require("../../public/img/icon/task-manager-icons/task-red-icon.png"),
      },
      installIconSrc: {
        activeInstallIcon: require("../../public/img/icon/task-manager-icons/turning_circle.gif"),
        successInstallIcon: require("../../public/img/icon/task-manager-icons/check3.png"),
        failedInstallIcon: require("../../public/img/icon/task-manager-icons/close3.png"),
      },
      pluginsInstalling: [
        {
          name: "Geth",
          status: "active",
          statusLabel: "TASK ACTIVE",
          subTasks: [
            {
              status: "active",
              statusLabel: "TASK ACTIVE",
              displayTooltip: false,
            },
            {
              status: "success",
              statusLabel: "TASK SUCCEEDED",
              displayTooltip: false,
            },
            {
              status: "failed",
              statusLabel: "TASK FAILED",
              displayTooltip: false,
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
              statusLabel: "TASK SUCCEEDED",
              displayTooltip: false,
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
              statusLabel: "TASK FAILED",
              showTooltip: false,
            },
          ],
        },
      ],
    };
  },
  getters: {},
  actions: {},
});
