"use strict";

import { app, protocol, BrowserWindow, shell } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import { StereumService } from "./stereumservice.js";
import { StorageService } from "./storageservice.js";
import { NodeConnection } from "./backend/NodeConnection.js";
import { OneClickInstall } from "./backend/OneClickInstall.js";
import { ServiceManager } from "./backend/ServiceManager.js";
import { ValidatorAccountManager } from "./backend/ValidatorAccountManager.js";
import promiseIpc from "electron-promise-ipc";
import path from "path";
import { readFileSync } from "fs";
import url from "url";
const isDevelopment = process.env.NODE_ENV !== "production";
const stereumService = new StereumService();
const storageService = new StorageService();
const nodeConnection = new NodeConnection();
const oneClickInstall = new OneClickInstall();
const serviceManager = new ServiceManager(nodeConnection);
const validatorAccountManager = new ValidatorAccountManager(
  nodeConnection,
  serviceManager
);

const log = require("electron-log");

let remoteHost = {};

promiseIpc.on("ready", (arg) => {
  log.info("background process ready");
});

// called via promiseIpc as an async function
promiseIpc.on("connect", async (arg) => {
  remoteHost = arg;
  if (arg.sshKeyAuth) {
    remoteHost.privateKey = readFileSync(arg.keyfileLocation, {
      encoding: "utf8",
    });
  }
  stereumService.connect(remoteHost);
  nodeConnection.nodeConnectionParams = remoteHost;
  await nodeConnection.establish();
  return 0;
});

// called via promiseIpc as an async function
promiseIpc.on("inquire", async (arg) => {
  return stereumService.getInstalledVersions(remoteHost);
});

// called via promiseIpc as an async function
promiseIpc.on("setup", async (arg) => {
  return stereumService.setup(arg.stereumRelease);
});

// called via promiseIpc as an async function
promiseIpc.on("destroy", async () => {
  return nodeConnection.destroyNode();
});

// called via promiseIpc as an async function
promiseIpc.on("tunnel", async (arg) => {
  return nodeConnection.openTunnels(arg);
});

// called via promiseIpc as an async function
promiseIpc.on("setApikey", async (arg) => {
  return stereumService.setApikey(arg);
});

// userData storage
promiseIpc.on("readConfig", async () => {
  return storageService.readConfig();
});
promiseIpc.on("writeConfig", async (arg) => {
  return storageService.writeConfig(arg);
});

promiseIpc.on("checkOS", async () => {
  await nodeConnection.findStereumSettings();
  await nodeConnection.findOS();
  return nodeConnection.os;
});

promiseIpc.on("getOneClickConstellation", async (arg) => {
  return await oneClickInstall.getSetupConstellation(arg);
});

promiseIpc.on("prepareOneClickInstallation", async (arg) => {
  return await oneClickInstall.prepareNode(arg, nodeConnection);
});

promiseIpc.on("writeOneClickConfiguration", async () => {
  await oneClickInstall.createServices();
  return await oneClickInstall.writeConfig();
});

promiseIpc.on("startOneClickServices", async () => {
  return await oneClickInstall.startServices();
});

//get data for control cpu comp
promiseIpc.on("getServerVitals", async () => {
  return await nodeConnection.getServerVitals();
});

promiseIpc.on("getAvailablePort", async (args) => {
  return await nodeConnection.checkAvailablePorts(args);
});

promiseIpc.on("checkStereumInstallation", async () => {
  if (nodeConnection.sshService.connected) {
    let services;
    let settings;
    try {
      settings = await nodeConnection.sshService.exec("sudo ls /etc/stereum");
      services = await nodeConnection.listServicesConfigurations();
    } catch {
      services = [];
    }
    if (services.length != 0 || settings.stdout.includes("stereum.yaml"))
      return true;
  }
  return false;
});

promiseIpc.on("getServices", async () => {
  return await serviceManager.readServiceConfigurations();
});

promiseIpc.on("importKey", async (args) => {
  return await validatorAccountManager.importKey(args.files, args.password);
});

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1024,
    height: 607,
    minWidth: 1024,
    minHeight: 607,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      // devTools: false,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  win.setMinimumSize(1024, 607);
  win.setMenuBarVisibility(false);

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
    // win.webContents.openDevTools()
  }
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("web-contents-created", (event, contents) => {
  // open every new window in the OS's default browser instead of a
  // new Electron windows.
  contents.on("new-window", (event, navigationUrl) => {
    const parsedUrl = new url.URL(navigationUrl);
    event.preventDefault();

    if (["https:", "http:", "mailto:"].includes(parsedUrl.protocol)) {
      shell.openExternal(navigationUrl);
    }
  });
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  // if (isDevelopment && !process.env.IS_TEST) {
  // Install Vue Devtools
  try {
    await installExtension(VUEJS_DEVTOOLS);
  } catch (e) {
    log.error("Vue Devtools failed to install:", e.toString());
  }
  // }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
