"use strict";

import { app, protocol, BrowserWindow, shell, dialog, Menu } from "electron";
import { autoUpdater } from "electron-updater";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import { StereumService } from "./stereumservice.js";
import { StorageService } from "./storageservice.js";
import { NodeConnection } from "./backend/NodeConnection.js";
import { OneClickInstall } from "./backend/OneClickInstall.js";
import { ServiceManager } from "./backend/ServiceManager.js";
import { ValidatorAccountManager } from "./backend/ValidatorAccountManager.js";
import { TaskManager } from "./backend/TaskManager.js";
import { Monitoring } from "./backend/Monitoring.js";
import promiseIpc from "electron-promise-ipc";
import path from "path";
import { readFileSync } from "fs";
import url from "url";
const isDevelopment = process.env.NODE_ENV !== "production";
const stereumService = new StereumService();
const storageService = new StorageService();
const taskManager = new TaskManager();
const monitoring = new Monitoring();
const nodeConnection = new NodeConnection();
const oneClickInstall = new OneClickInstall();
const serviceManager = new ServiceManager(nodeConnection);
const validatorAccountManager = new ValidatorAccountManager(
  nodeConnection,
  serviceManager
);
const { globalShortcut } = require('electron');

const log = require("electron-log");
log.transports.console.level = "info";
log.transports.file.level = "debug";
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "debug";

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
  taskManager.nodeConnection.nodeConnectionParams = remoteHost;
  monitoring.nodeConnection.nodeConnectionParams = remoteHost;
  monitoring.nodeConnectionProm.nodeConnectionParams = remoteHost;
  await nodeConnection.establish(taskManager);
  await taskManager.nodeConnection.establish();
  await monitoring.nodeConnection.establish();
  await monitoring.nodeConnectionProm.establish();
  return 0;
});

promiseIpc.on("reconnect", async () => {
  try {
      await nodeConnection.establish(taskManager);
      await taskManager.nodeConnection.establish();
      await monitoring.nodeConnection.establish();
      await monitoring.nodeConnectionProm.establish();
  } catch (err) {
    log.error("Couldn't reconnect:\n", err);
  }
});

promiseIpc.on("checkConnection", async () => {
  try {
    await nodeConnection.sshService.exec("ls");
    await taskManager.nodeConnection.sshService.exec("ls");
    await monitoring.nodeConnection.sshService.exec("ls");
    await monitoring.nodeConnectionProm.sshService.exec("ls");
  } catch (err) {
    return false;
  }
  return true;
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
  app.showExitPrompt = true;
  const returnValue = await nodeConnection.destroyNode();
  app.showExitPrompt = false;
  return returnValue;
});

// called via promiseIpc as an async function
promiseIpc.on("tunnel", async (arg) => {
  return nodeConnection.openTunnels(arg);
});

promiseIpc.on("closeTunnels", async () => {
  return await nodeConnection.closeTunnels();
});

promiseIpc.on("logout", async () => {
  await monitoring.logout();
  await taskManager.nodeConnection.logout();
  await serviceManager.nodeConnection.logout();
  return await nodeConnection.logout();
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

promiseIpc.on("checkSudo", async () => {
  return await nodeConnection.checkSudo();
});

promiseIpc.on("getOneClickConstellation", async (arg) => {
  return await oneClickInstall.getSetupConstellation(arg.setup, arg.network);
});

promiseIpc.on("prepareOneClickInstallation", async (arg) => {
  app.showExitPrompt = true;
  return await oneClickInstall.prepareNode(arg, nodeConnection);
});

promiseIpc.on("writeOneClickConfiguration", async (args) => {
  log.info(args)
  await oneClickInstall.createServices(
    args.array.map((service) => {
      return service.service;
    }),
    args.checkpointURL,
    args.relayURL,
  );
  return await oneClickInstall.writeConfig();
});

promiseIpc.on("startOneClickServices", async () => {
  const returnValue = await oneClickInstall.startServices();
  app.showExitPrompt = false;
  return returnValue;
});

// open rpc tunnel
promiseIpc.on("openRpcTunnel", async (args) => {
  return await monitoring.openRpcTunnel(args);
});

// close rpc tunnel
promiseIpc.on("closeRpcTunnel", async () => {
  return await monitoring.closeRpcTunnel();
});

// open beacon tunnel
promiseIpc.on("openBeaconTunnel", async (args) => {
  return await monitoring.openBeaconTunnel(args);
});

// close beacon tunnel
promiseIpc.on("closeBeaconTunnel", async () => {
  return await monitoring.closeBeaconTunnel();
});

// get data for node stats (prometheus, and so on)
promiseIpc.on("getNodeStats", async () => {
  return await monitoring.getNodeStats();
});

// get data for control cpu comp
promiseIpc.on("getServerVitals", async () => {
  return await monitoring.getServerVitals();
});

promiseIpc.on("getConnectionStats", async () => {
  const name = await monitoring.getServerName();
  const address = monitoring.getIPAddress();
  return { ServerName: name, ipAddress: address };
});

promiseIpc.on("getAvailablePort", async (args) => {
  return await nodeConnection.checkAvailablePorts(args);
});

promiseIpc.on("checkStereumInstallation", async () => {
  return await monitoring.checkStereumInstallation(nodeConnection);
});

promiseIpc.on("getServices", async () => {
  return await serviceManager.readServiceConfigurations();
});

// get data for service logs
promiseIpc.on("getServiceLogs", async (args) => {
  return await monitoring.getServiceLogs(args);
});

promiseIpc.on("getServiceConfig", async (args) => {
  return await nodeConnection.readServiceConfiguration(args);
});

promiseIpc.on("writeServiceConfig", async (args) => {
  return await nodeConnection.writeServiceConfiguration(args);
});

promiseIpc.on("getServiceYAML", async (args) => {
  return await nodeConnection.readServiceYAML(args);
});

promiseIpc.on("writeServiceYAML", async (args) => {
  return await nodeConnection.writeServiceYAML(args);
});

promiseIpc.on("importKey", async (args) => {
  app.showExitPrompt = true;
  const returnValue = await validatorAccountManager.importKey(
    args.files,
    args.password,
    args.service,
    args.slashingDB
  );
  app.showExitPrompt = false;
  return returnValue;
});

promiseIpc.on("deleteValidators", async (args) => {
  return await validatorAccountManager.deleteValidators(args.serviceID, args.keys, args.picked);
});

promiseIpc.on("listValidators", async (args) => {
  return await validatorAccountManager.listValidators(args);
});

promiseIpc.on("listServices", async () => {
  return await nodeConnection.listServices();
});

promiseIpc.on("manageServiceState", async (args) => {
  return await serviceManager.manageServiceState(args.id, args.state);
});

promiseIpc.on("runAllUpdates", async (args) => {
  app.showExitPrompt = true;
  const returnValue = await nodeConnection.runAllUpdates(args.commit);
  app.showExitPrompt = false;
  return returnValue;
});

promiseIpc.on("updateServices", async (args) => {
  app.showExitPrompt = true;
  let seconds = await nodeConnection.updateServices(args.services);
  app.showExitPrompt = false;
  return seconds;
});

promiseIpc.on("updateStereum", async (args) => {
  app.showExitPrompt = true;
  let seconds = await nodeConnection.updateStereum(args.commit);
  app.showExitPrompt = false;
  return seconds;
});

promiseIpc.on("restartServices", async (args) => {
  await nodeConnection.restartServices(args);
});

promiseIpc.on("checkUpdates", async () => {
  let versions;
  try {
    versions = await nodeConnection.checkUpdates();
  } catch (err) {
    throw err;
  }
  return versions;
});

promiseIpc.on("getCurrentStereumVersion", async () => {
  return await nodeConnection.getCurrentStereumVersion();
});

promiseIpc.on("getCurrentLauncherVersion", async () => {
  return await nodeConnection.getCurrentLauncherVersion();
});

promiseIpc.on("getTasks", async () => {
  return await taskManager.getTasks();
});

promiseIpc.on("updateTasks", async () => {
  return await taskManager.updateTasks();
});

promiseIpc.on("clearTasks", async () => {
  return await taskManager.clearTasks();
});

promiseIpc.on("insertSSVNetworkKeys", async (args) => {
  return await validatorAccountManager.insertSSVNetworkKeys(
    args.service,
    args.pk
  );
});

promiseIpc.on("refreshServiceInfos", async () => {
  return await monitoring.refreshServiceInfos();
});

promiseIpc.on("addFeeRecipient", async (args) => {
  return await validatorAccountManager.addFeeRecipient(args.keys, args.address);
});

promiseIpc.on("getOperatorPageURL", async (args) => {
  return await validatorAccountManager.getOperatorPageURL(args);
});

promiseIpc.on("setGraffitis", async (args) => {
  return await validatorAccountManager.setGraffitis(args);
});

promiseIpc.on("chooseServiceAction", async (args) => {
  return await serviceManager.chooseServiceAction(
    args.action,
    args.service,
    args.data
  );
});

promiseIpc.on("handleServiceChanges", async (args) => {
  return await serviceManager.handleServiceChanges(args);
});

promiseIpc.on("getStereumSettings", async () => {
  await nodeConnection.findStereumSettings();
  return nodeConnection.settings
});

promiseIpc.on("setStereumSettings", async (args) => {
  return await nodeConnection.setStereumSettings(args);
});

promiseIpc.on("writeKeys", async (args) => {
  return await validatorAccountManager.writeKeys(args);
});

promiseIpc.on("readKeys", async () => {
  return await validatorAccountManager.readKeys();
});

promiseIpc.on("prepareStereumNode", async (arg) => {
  app.showExitPrompt = true;
  await oneClickInstall.prepareNode(arg, nodeConnection);
  app.showExitPrompt = false;
  return 0
});

promiseIpc.on("restartServer", async () => {
  return await nodeConnection.restartServer()
});

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

async function createWindow() {
  // Create the browser window.

  const initwin = {
    width: 1044,
    height: 609,
    minHeight: 609,
    minWidth: 1044,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      // devTools: false,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js"),
    },
  }
  if(!isDevelopment){
    initwin['maxHeight'] = 609;
    initwin['maxWidth'] = 1044;
  }
  if (process.platform === "win32"){
    initwin['minHeight'] = 650
    initwin['minWidth'] = 1100
    initwin['maxHeight'] = 650
    initwin['maxWidth'] = 1100
  }

  const win = new BrowserWindow(initwin);
  win.setMenuBarVisibility(false);

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in developmen
    win.loadURL("app://./index.html");
  }

  win.on("close", (e) => {
    if (app.showExitPrompt) {
      e.preventDefault(); // Prevents the window from closing
      const response = dialog.showMessageBoxSync({
        type: "question",
        buttons: ["Yes", "No"],
        title: "Confirm",
        message:
          "Critical tasks are running in the background.\nAre you sure you want to quit?",
        icon: "./public/img/icon/node-journal-icons/red-warning.png",
      });
      if (response === 0) {
        app.showExitPrompt = false;
        win.close();
      }
    }
  });
}

// Disable CTRL+R and F5 in build
if(!isDevelopment){
  app.on('browser-window-focus', function () {
    globalShortcut.register("CommandOrControl+R", () => {
        // console.log("CommandOrControl+R is pressed: Shortcut Disabled");
    });
    globalShortcut.register("F5", () => {
        // console.log("F5 is pressed: Shortcut Disabled");
    });
  });
  app.on('browser-window-blur', function () {
    globalShortcut.unregister('CommandOrControl+R');
    globalShortcut.unregister('F5');
  });
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
  if(process.platform === "linux"){
    app.commandLine.appendSwitch('--no-sandbox')
  }
  // if (isDevelopment && !process.env.IS_TEST) {
  // Install Vue Devtools
  try {
    await installExtension(VUEJS_DEVTOOLS);
  } catch (e) {
    log.error("Vue Devtools failed to install:", e.toString());
  }
  // }
  // Disable "View" and "Window" Menu items in build (since CTRL+R and F5 is disabled also)
  if(!isDevelopment){
    const hideMenuItems = ["viewmenu","windowmenu"];
    var menu = Menu.getApplicationMenu();
    menu.items.filter((item) => hideMenuItems.includes(item.role)).map((item) => item.visible = false);
    Menu.setApplicationMenu(menu);
  }
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
});

autoUpdater.on('error', (error) => {
  dialog.showErrorBox('Error: ', error == null ? "unknown" : (error.stack || error).toString())
})

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox({
    type: "question",
    buttons: ["Yes", "No"],
    title: "Install Update",
    message: "Update downloaded!\n Do you want to restart and apply updates now?",
  }).then((result) => {
    if(result.response == 0){
      autoUpdater.quitAndInstall()
    }
  })
})

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
