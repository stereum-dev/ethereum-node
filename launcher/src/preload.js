const { contextBridge, ipcRenderer, webUtils } = require("electron");

contextBridge.exposeInMainWorld("promiseIpc", {
  send: (event, ...args) => ipcRenderer.invoke(event, ...args),
  addListener: (event, listener) => ipcRenderer.on(event, listener),
  removeListener: (channel, listener) => ipcRenderer.removeAllListeners(channel, listener),

  // For terminal interaction
  startShell: () => ipcRenderer.invoke("startShell"),
  onTerminalOutput: (callback) => {
    ipcRenderer.on("terminal-output", (_, arg) => callback(arg));
    return () => ipcRenderer.removeListener("terminal-output", callback);
  },

  // Custom URL handling
  onCustomUrl: (callback) => {
    ipcRenderer.on("handle-custom-url", (_, url) => callback(url));
    return () => ipcRenderer.removeListener("handle-custom-url", callback);
  },
});

contextBridge.exposeInMainWorld("webUtils", {
  getPathForFile: (file) => webUtils.getPathForFile(file),
});
