export default {
    showDialog (state) {
      state.dialogIsVisible = true
    },
    hideDialog (state) {
      state.dialogIsVisible = false
    },
    updateRunningServices (state, payload) {
      state.runningServices = payload
    },
  }
  