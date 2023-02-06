// src/preload.js
const {contextBridge, ipcRenderer} = require("electron");
contextBridge.exposeInMainWorld("promiseIpc", {
  send: (event, ...args) => ipcRenderer.invoke(event, ...args)
})
