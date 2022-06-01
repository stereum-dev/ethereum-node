export default {
  installation_get(state) {
    return state.installation;
  },
  R1clkInstls_get(state) {
    return state.R1clkInstls;
  },
  nodeSbActive_get(state) {
    return state.configData_nodeSidebarActive;
  },
  nodeSbVideo_get(state) {
    return state.configData_nodeSidebarVideo;
  },
  getTaskManagerIcons(state) {
    return state.taskManagerIcons;
  },
  getServiceIcons(state) {
    return state.services;
  },
  getRunningServices(state) {
    return state.runningServices;
  },
};
