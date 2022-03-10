export default {
  mutatedConsensusItems(state, payload) {
    state.consensusItems = payload;
  },
  selectedItemToRemoveMutation(state, payload) {
    state.selectedItemToRemove = payload;
  },
};
