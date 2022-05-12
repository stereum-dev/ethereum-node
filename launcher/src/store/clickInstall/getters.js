export default {
  installationPlugins(state) {
    return state.presets;
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
  getAllPlugins(state) {
    return state.plugins;
  },
  getInstallationPath(state) {
    return state.installationPath;
  },
  getIncludedPlugins(state) {
    return state.selectedPreset.includedPlugins;
  },
  getSubTasks(state) {
    return state.selectedPreset.includedPlugins.forEach((task) => {
      task.subTasks;
    });
  },
};
