export default {
  installationPlugins(state) {
    return state.plugins;
  },
  getSystemInformation(state) {
    return state.systemInfos;
  },
  getMainnetPlugins(state) {
    return state.mainnetPlugins;
  },
  getTestnetPlugins(state) {
    return state.testnetPlugins;
  },
  getSelectedNetworks(state) {
    return state.selectedNetworks;
  },
  getSelectedPreset(state) {
    return state.selectedPreset;
  },
};
