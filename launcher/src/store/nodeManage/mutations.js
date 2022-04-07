export default {
  mutatedConsensusItems(state, payload) {
    state.consensusItems = payload;
  },
  mutatedExecutionItems(state, payload) {
    state.executionItems = payload;
  },
  executionPluginHandler(state, payload) {
    state.executionItems.push(payload);
  },
  mutatedValidatorItems(state, payload) {
    state.validatorItems = payload;
  },
  mutatedServicePlugins(state, payload) {
    state.servicePlugins = payload;
  },
  selectedItemToRemoveMutation(state, payload) {
    state.selectedItemToRemove = payload;
  },
};
