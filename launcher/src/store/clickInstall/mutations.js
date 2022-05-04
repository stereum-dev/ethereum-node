export default {
  mutatedSelectedPreset (state, payload) {
    state.selectedPreset = payload
  },
  mutatedInstallationPath (state, payload) {
    state.installationPath = payload
  }
}
