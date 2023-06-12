// src/preload.js
const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("promiseIpc", {
  send: (event, ...args) => ipcRenderer.invoke(event, ...args),
  addListener: (event, listener) => ipcRenderer.on(event, listener),
  removeListener: (channel, listener) => ipcRenderer.removeAllListeners(channel, listener)
});
