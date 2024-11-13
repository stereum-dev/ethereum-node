// src/preload.js
const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("promiseIpc", {
  send: (event, ...args) => ipcRenderer.invoke(event, ...args),
  addListener: (event, listener) => ipcRenderer.on(event, listener),
  removeListener: (channel, listener) => ipcRenderer.removeAllListeners(channel, listener),

  // for terminal interaction
  startShell: () => ipcRenderer.invoke("startShell"),
  onTerminalOutput: (callback) => {
    ipcRenderer.on("terminal-output", (_, arg) => callback(arg));
    return () => ipcRenderer.removeListener("terminal-output", callback);
  },

  // Audio control functions
  setVolume: (volume) => ipcRenderer.invoke("set-system-volume", volume),
  getVolume: () => ipcRenderer.invoke("get-system-volume"),
});
