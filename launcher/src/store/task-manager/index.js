import taskManagerGetters from "./getters.js";
import taskManagerMutations from "./mutations.js";

export default {
  state() {
    return {
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
  mutations: taskManagerMutations,
  getters: taskManagerGetters,
};
