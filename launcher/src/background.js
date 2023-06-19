"use strict";

import { app, protocol, BrowserWindow, shell, dialog, Menu, ipcMain } from "electron";
import { autoUpdater } from "electron-updater";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import { StorageService } from "./storageservice.js";
import { NodeConnection } from "./backend/NodeConnection.js";
import { OneClickInstall } from "./backend/OneClickInstall.js";
import { ServiceManager } from "./backend/ServiceManager.js";
import { ValidatorAccountManager } from "./backend/ValidatorAccountManager.js";
import { TaskManager } from "./backend/TaskManager.js";
import { Monitoring } from "./backend/Monitoring.js";
import path from "path";
import { readFileSync } from "fs";
import url from "url";
const isDevelopment = process.env.NODE_ENV !== "production";
const nodeConnection = new NodeConnection();
const storageService = new StorageService();
const taskManager = new TaskManager(nodeConnection);
const monitoring = new Monitoring(nodeConnection);
const oneClickInstall = new OneClickInstall();
const serviceManager = new ServiceManager(nodeConnection);
const validatorAccountManager = new ValidatorAccountManager(nodeConnection, serviceManager);
const { globalShortcut } = require("electron");
const log = require("electron-log");
log.transports.console.level = "info";
log.transports.file.level = "debug";
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "debug";

let remoteHost = {};

ipcMain.handle("ready", () => {
  log.info("background process ready");
});

ipcMain.handle("connect", async (event, arg) => {
  remoteHost = arg;
  if (arg?.sshKeyAuth) {
    remoteHost.privateKey = readFileSync(arg.keyfileLocation, {
      encoding: "utf8",
    });
  }
  nodeConnection.nodeConnectionParams = remoteHost;
  await nodeConnection.establish(taskManager);
  await monitoring.login();
  return 0;
});

ipcMain.handle("reconnect", async () => {
  if (nodeConnection.sshService.connectionPool.length > 0) await nodeConnection.sshService.disconnect();
  try {
    await nodeConnection.establish(taskManager);
  } catch (err) {
    log.error("Couldn't reconnect:\n", err);
  }
});

ipcMain.handle("checkConnection", async () => {
  await nodeConnection.sshService
    .checkSSHConnection(nodeConnection.nodeConnectionParams, 18000)
    .then((isConnected) => {
      nodeConnection.sshService.connected = isConnected;
    })
    .catch((error) => {
      console.error("Error checking SSH connection:", error);
      nodeConnection.sshService.connected = false;
    });
  return nodeConnection.sshService.connected;
});

ipcMain.handle("destroy", async () => {
  app.showExitPrompt = true;
  const serviceConfigs = await serviceManager.readServiceConfigurations();
  const returnValue = await nodeConnection.destroyNode(serviceConfigs);
  app.showExitPrompt = false;
  return returnValue;
});

ipcMain.handle("tunnel", async (event, arg) => {
  return nodeConnection.openTunnels(arg);
});

ipcMain.handle("closeTunnels", async () => {
  return await nodeConnection.closeTunnels();
});

ipcMain.handle("logout", async () => {
  await monitoring.logout();
  return await nodeConnection.logout();
});

// userData storage
ipcMain.handle("readConfig", async () => {
  return storageService.readConfig();
});
ipcMain.handle("writeConfig", async (event, arg) => {
  return storageService.writeConfig(arg);
});

ipcMain.handle("isCheckpointValid", async (event, cp_url) => {
  return await monitoring.isCheckpointValid(cp_url);
});

ipcMain.handle("checkOS", async () => {
  await nodeConnection.findStereumSettings();
  await nodeConnection.findOS();
  return nodeConnection.os;
});

ipcMain.handle("checkSudo", async () => {
  return await nodeConnection.checkSudo();
});

ipcMain.handle("getOneClickConstellation", async (event, arg) => {
  return await oneClickInstall.getSetupConstellation(arg.setup, arg.network);
});

ipcMain.handle("prepareOneClickInstallation", async (event, arg) => {
  app.showExitPrompt = true;
  return await oneClickInstall.prepareNode(arg, nodeConnection);
});

ipcMain.handle("writeOneClickConfiguration", async (event, args) => {
  log.info(args);
  await oneClickInstall.createServices(
    args.array.map((service) => {
      return service.service;
    }),
    args.checkpointURL,
    args.relayURL
  );
  return await oneClickInstall.writeConfig();
});

ipcMain.handle("startOneClickServices", async () => {
  const returnValue = await oneClickInstall.startServices();
  app.showExitPrompt = false;
  return returnValue;
});

// open rpc tunnel
ipcMain.handle("openRpcTunnel", async (event, args) => {
  return await monitoring.openRpcTunnel(args);
});

// close rpc tunnel
ipcMain.handle("closeRpcTunnel", async () => {
  return await monitoring.closeRpcTunnel();
});

// open ws tunnel
ipcMain.handle("openWsTunnel", async (event, args) => {
  return await monitoring.openWsTunnel(args);
});

// close ws tunnel
ipcMain.handle("closeWsTunnel", async () => {
  return await monitoring.closeWsTunnel();
});

// open beacon tunnel
ipcMain.handle("openBeaconTunnel", async (event, args) => {
  return await monitoring.openBeaconTunnel(args);
});

// close beacon tunnel
ipcMain.handle("closeBeaconTunnel", async () => {
  return await monitoring.closeBeaconTunnel();
});

// get data for node stats (prometheus, and so on)
ipcMain.handle("getNodeStats", async () => {
  return await monitoring.getNodeStats();
});

// get data for control cpu comp
ipcMain.handle("getServerVitals", async () => {
  return await monitoring.getServerVitals();
});

// get data for storage comp
ipcMain.handle("getStorageStatus", async () => {
  return await monitoring.getStorageStatus();
});

ipcMain.handle("getConnectionStats", async () => {
  const name = await monitoring.getServerName();
  const address = monitoring.getIPAddress();
  return { ServerName: name, ipAddress: address };
});

ipcMain.handle("getAvailablePort", async (event, args) => {
  return await nodeConnection.checkAvailablePorts(args);
});

ipcMain.handle("checkStereumInstallation", async () => {
  return await monitoring.checkStereumInstallation(nodeConnection);
});

ipcMain.handle("getServices", async () => {
  return await serviceManager.readServiceConfigurations();
});

// get data for service logs
ipcMain.handle("getServiceLogs", async (event, args) => {
  return await monitoring.getServiceLogs(args);
});

ipcMain.handle("getServiceConfig", async (event, args) => {
  return await nodeConnection.readServiceConfiguration(args);
});

ipcMain.handle("writeServiceConfig", async (event, args) => {
  return await nodeConnection.writeServiceConfiguration(args);
});

ipcMain.handle("getServiceYAML", async (event, args) => {
  return await nodeConnection.readServiceYAML(args);
});

ipcMain.handle("writeServiceYAML", async (event, args) => {
  return await nodeConnection.writeServiceYAML(args);
});

ipcMain.handle("importKey", async (event, args) => {
  app.showExitPrompt = true;
  const returnValue = await validatorAccountManager.importKey(args);
  app.showExitPrompt = false;
  return returnValue;
});

ipcMain.handle("deleteValidators", async (event, args) => {
  return await validatorAccountManager.deleteValidators(args.serviceID, args.keys, args.picked);
});

ipcMain.handle("listValidators", async (event, args) => {
  return await validatorAccountManager.listValidators(args);
});

ipcMain.handle("listServices", async () => {
  return await nodeConnection.listServices();
});

ipcMain.handle("manageServiceState", async (event, args) => {
  return await serviceManager.manageServiceState(args.id, args.state);
});

ipcMain.handle("runAllUpdates", async (event, args) => {
  app.showExitPrompt = true;
  const returnValue = await nodeConnection.runAllUpdates(args.commit);
  app.showExitPrompt = false;
  return returnValue;
});

ipcMain.handle("updateServices", async (event, args) => {
  app.showExitPrompt = true;
  let seconds = await nodeConnection.updateServices(args.services);
  app.showExitPrompt = false;
  return seconds;
});

ipcMain.handle("updateStereum", async (event, args) => {
  app.showExitPrompt = true;
  let seconds = await nodeConnection.updateStereum(args.commit);
  app.showExitPrompt = false;
  return seconds;
});

ipcMain.handle("restartServices", async (event, args) => {
  await nodeConnection.restartServices(args);
});

ipcMain.handle("checkUpdates", async () => {
  return await nodeConnection.checkUpdates();
});

ipcMain.handle("getCurrentOsVersion", async () => {
  return await nodeConnection.getCurrentOsVersion();
});

ipcMain.handle("getCountOfUpdatableOSUpdate", async () => {
  return await nodeConnection.getCountOfUpdatableOSUpdate();
});

ipcMain.handle("updateOS", async () => {
  return await nodeConnection.updateOS();
});

ipcMain.handle("getCurrentStereumVersion", async () => {
  return await nodeConnection.getCurrentStereumVersion();
});

ipcMain.handle("getCurrentLauncherVersion", async () => {
  return await nodeConnection.getCurrentLauncherVersion();
});

ipcMain.handle("getLargestVolumePath", async () => {
  return await nodeConnection.getLargestVolumePath();
});

ipcMain.handle("getTasks", async () => {
  return await taskManager.getTasks();
});

ipcMain.handle("updateTasks", async () => {
  return await taskManager.updateTasks();
});

ipcMain.handle("clearTasks", async () => {
  return await taskManager.clearTasks();
});

ipcMain.handle("insertSSVNetworkKeys", async (event, args) => {
  return await validatorAccountManager.insertSSVNetworkKeys(args.service, args.pk);
});

ipcMain.handle("refreshServiceInfos", async () => {
  return await monitoring.refreshServiceInfos();
});

ipcMain.handle("getFeeRecipient", async (event, args) => {
  return await validatorAccountManager.getFeeRecipient(args.serviceID, args.pubkey);
});

ipcMain.handle("setFeeRecipient", async (event, args) => {
  return await validatorAccountManager.setFeeRecipient(args.serviceID, args.pubkey, args.address);
});

ipcMain.handle("deleteFeeRecipient", async (event, args) => {
  return await validatorAccountManager.deleteFeeRecipient(args.serviceID, args.pubkey);
});

ipcMain.handle("getOperatorPageURL", async (event, args) => {
  return await validatorAccountManager.getOperatorPageURL(args);
});

ipcMain.handle("setGraffitis", async (event, args) => {
  return await validatorAccountManager.setGraffitis(args.id, args.graffiti);
});

ipcMain.handle("chooseServiceAction", async (event, args) => {
  return await serviceManager.chooseServiceAction(args.action, args.service, args.data);
});

ipcMain.handle("handleServiceChanges", async (event, args) => {
  return await serviceManager.handleServiceChanges(args);
});

ipcMain.handle("getStereumSettings", async () => {
  await nodeConnection.findStereumSettings();
  return nodeConnection.settings;
});

ipcMain.handle("setStereumSettings", async (event, args) => {
  return await nodeConnection.setStereumSettings(args);
});

ipcMain.handle("writeKeys", async (event, args) => {
  return await validatorAccountManager.writeKeys(args);
});

ipcMain.handle("readKeys", async () => {
  return await validatorAccountManager.readKeys();
});

ipcMain.handle("prepareStereumNode", async (event, args) => {
  app.showExitPrompt = true;
  await oneClickInstall.prepareNode(args, nodeConnection);
  app.showExitPrompt = false;
  return 0;
});

ipcMain.handle("restartServer", async () => {
  return await nodeConnection.restartServer();
});

ipcMain.handle("readSSVNetworkConfig", async (event, args) => {
  return await nodeConnection.readSSVNetworkConfig(args);
});

ipcMain.handle("writeSSVNetworkConfig", async (event, args) => {
  return await nodeConnection.writeSSVNetworkConfig(args.serviceID, args.config);
});

ipcMain.handle("getValidatorStats", async (event, args) => {
  return await monitoring.getValidatorStats(args);
});

ipcMain.handle("getValidatorState", async (event, args) => {
  return await monitoring.getValidatorState(args);
});

ipcMain.handle("getQRCode", async () => {
  return await monitoring.getQRCode();
});

ipcMain.handle("checkActiveValidators", async (event, args) => {
  return await validatorAccountManager.checkActiveValidators(
    args.files,
    args.password,
    args.serviceID,
    args.slashingDB
  );
});

ipcMain.handle("exitValidator", async (event, args) => {
  return await validatorAccountManager.exitValidator(args.pubkey, args.password, args.serviceID);
});

ipcMain.handle("exportConfig", async () => {
  return await serviceManager.exportConfig();
});

ipcMain.handle("importConfig", async (event, args) => {
  return await serviceManager.importConfig(args.configServices, args.removedServices, args.checkPointSync);
});

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: "app", privileges: { secure: true, standard: true } }]);

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
  };
  if (!isDevelopment) {
    initwin["maxHeight"] = 609;
    initwin["maxWidth"] = 1044;
  }
  if (!isDevelopment && process.platform === "win32") {
    initwin["minHeight"] = 650;
    initwin["minWidth"] = 1100;
    initwin["maxHeight"] = 650;
    initwin["maxWidth"] = 1100;
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

  win.on("ready-to-show", async () => {
    await nodeConnection.closeTunnels();
  });

  win.on("close", (e) => {
    if (app.showExitPrompt) {
      e.preventDefault(); // Prevents the window from closing
      const response = dialog.showMessageBoxSync({
        type: "question",
        buttons: ["Yes", "No"],
        title: "Confirm",
        message: "Critical tasks are running in the background.\nAre you sure you want to quit?",
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
if (!isDevelopment) {
  app.on("browser-window-focus", function () {
    globalShortcut.register("CommandOrControl+R", () => {
      // console.log("CommandOrControl+R is pressed: Shortcut Disabled");
    });
    globalShortcut.register("F5", () => {
      // console.log("F5 is pressed: Shortcut Disabled");
    });
  });
  app.on("browser-window-blur", function () {
    globalShortcut.unregister("CommandOrControl+R");
    globalShortcut.unregister("F5");
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
  contents.setWindowOpenHandler((details) => {
    const parsedUrl = new url.URL(details.url);
    if (["https:", "http:", "mailto:"].includes(parsedUrl.protocol)) {
      shell.openExternal(parsedUrl.href);
    }
    return { action: "deny" };
  });
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  // workaround for linux whitescreen
  // if(process.platform === "linux"){
  //   app.commandLine.appendSwitch('--no-sandbox')
  // }

  // Disable "View" and "Window" Menu items in build (since CTRL+R and F5 is disabled also)
  if (!isDevelopment) {
    const hideMenuItems = ["viewmenu", "windowmenu"];
    var menu = Menu.getApplicationMenu();
    menu.items.filter((item) => hideMenuItems.includes(item.role)).map((item) => (item.visible = false));
    Menu.setApplicationMenu(menu);
  }
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
});

autoUpdater.on("error", (error) => {
  dialog.showErrorBox("Error: ", error == null ? "unknown" : (error.stack || error).toString());
});

autoUpdater.on("update-downloaded", () => {
  dialog
    .showMessageBox({
      type: "question",
      buttons: ["Yes", "No"],
      title: "Install Update",
      message: "Update downloaded!\n Do you want to restart and apply updates now?",
    })
    .then((result) => {
      if (result.response == 0) {
        autoUpdater.quitAndInstall();
      }
    });
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
