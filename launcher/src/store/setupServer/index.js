import setupServerActions from "./actions.js";
import setupServerGetters from "./getters.js";
import setupServerMutations from "./mutations.js";

export default {
  state() {
    return {};
  },
  mutations: setupServerMutations,
  actions: setupServerActions,
  getters: setupServerGetters,
};
