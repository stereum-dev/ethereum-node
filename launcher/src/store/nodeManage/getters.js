export default {
  getConsensusItems (state) {
    return state.consensusItems
  },
  getExecutionItems (state) {
    return state.executionItems
  },
  getValidatorItems (state) {
    return state.validatorItems
  },
  getSelectedItemToRemove (state) {
    return state.selectedItemToRemove
  },
  getModalItems (state) {
    return state.modalItems
  },
  getConfirmChanges (state) {
    return state.confirmChanges
  },
  getServicePlugins (state) {
    return state.servicePlugins
  },
  getSidebarPlugins (state) {
    return state.sidebarPlugins
  },
  getConfigData (state) {
    return state.configData
  }
}
