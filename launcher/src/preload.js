// src/preload.js
const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("promiseIpc", {
  send: (event, ...args) => ipcRenderer.invoke(event, ...args),
  addListener: (event, listener) => ipcRenderer.on(event, listener),
  removeListener: (channel, listener) => ipcRenderer.removeAllListeners(channel, listener),

  // for terminal interaction
  startShell: () => ipcRenderer.invoke("startShell"),
  executeCommand: (command) => ipcRenderer.invoke("executeCommand", command),
  onTerminalOutput: (callback) => {
    ipcRenderer.on("terminal-output", (_, arg) => callback(arg));
    return () => ipcRenderer.removeListener("terminal-output", callback);
  },
});
