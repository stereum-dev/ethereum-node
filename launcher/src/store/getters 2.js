export default {
  linkFlags_get (state) {
    return state.linkFlags
  },
  installation_get (state) {
    return state.installation
  },
  R1clkInstls_get (state) {
    return state.R1clkInstls
  },
  nodeSbActive_get (state) {
    return state.configData_nodeSidebarActive
  },
  nodeSbVideo_get (state) {
    return state.configData_nodeSidebarVideo
  },
  dialogIsVisible_get (state) {
    return state.dialogIsVisible
  }
}
