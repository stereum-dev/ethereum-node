import taskManagerGetters from "./getters.js";
import taskManagerMutations from "./mutations.js";
import taskManagerActions from "./actions.js";

export default {
  state() {
    return {
      pluginsInstalling: [
        {
          name: "Geth",
          status: "active",
          statusLabel: "TASK ACTIVE",
          subTasks: [
            {
              status: "active",
              statusLabel: "TASK ACTIVE",
            },
            {
              status: "success",
              statusLabel: "TASK SUCCEEDED",
            },
            {
              status: "failed",
              statusLabel: "TASK FAILED",
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
            },
          ],
        },
      ],
    };
  },
  mutations: taskManagerMutations,
  getters: taskManagerGetters,
  actions: taskManagerActions,
};
