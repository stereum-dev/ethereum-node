import { autoUpdater } from "electron-updater";
import { app, BrowserWindow } from "electron";

export class StereumUpdater {
  constructor(logger, createWindow) {
    this.updater = autoUpdater;
    this.updateWindow = null;
    this.logger = logger;
    this.createWindow = createWindow;
    this.newVersion = null;
  }

  checkForUpdates() {
    app.showExitPrompt = true;
    this.updater.checkForUpdates();
  }

  getNewLauncherVersion() {
    return this.newVersion;
  }

  initUpdater() {
    this.updater.logger = this.logger;
    this.updater.logger.transports.file.level = "debug";
    this.updater.autoDownload = false;

    this.updater.on("checking-for-update", () => {
      this.logger.info("Stereum is checking for updates.");
    });

    this.updater.on("update-available", async (data) => {
      this.newVersion = data.version;
      this.updateWindow = await this.createWindow("update");
      if (this.updateWindow) this.updateWindow.webContents.send("UpdateEvents", { message: "Update available.", type: "available" });
      this.logger.info("Update available.");
    });

    this.updater.on("update-not-available", () => {
      app.showExitPrompt = false;
      this.createWindow();
      this.logger.info("No updates available. Stereum is Up-to-date.");
    });

    this.updater.on("download-progress", (data) => {
      if (this.updateWindow)
        this.updateWindow.webContents.send("UpdateEvents", {
          message: "Downloading update...",
          type: "downloading",
          data: { percent: data.percent, MBps: data.bytesPerSecond / 1000000 },
        });
      this.logger.info("Update progress", data);
    });

    this.updater.on("update-downloaded", async (data) => {
      app.showExitPrompt = false;
      if (this.updateWindow)
        this.updateWindow.webContents.send("UpdateEvents", { message: "Update downloaded. " + data.version, type: "downloaded" });
      this.newVersion = null;
      this.updater.quitAndInstall();
      this.logger.info("Update downloaded.", data);
    });

    this.updater.on("error", async (error) => {
      app.showExitPrompt = false;
      const allWindows = await BrowserWindow.getAllWindows();
      for (const win of allWindows) {
        await win.close();
      }
      this.createWindow();
      this.logger.error("Error: ", error);
    });
  }

  async downloadUpdate() {
    this.updater.downloadUpdate();
    this.logger.info("Downloading update...");
  }

  async ignoreUpdate(win) {
    app.showExitPrompt = false;
    await win.close();
    this.createWindow();
    this.logger.info("Update ignored.");
  }

  async runDebug() {
    async function Sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    this.updateWindow = await this.createWindow("update");
    await Sleep(5000);
    for (let i = 0; i < 10; i++) {
      this.updateWindow.webContents.send("UpdateEvents", {
        message: "Downloading update...",
        type: "downloading",
        data: { percent: i * 10, MBps: i * 10.11 },
      });
      await Sleep(1000);
    }
    this.updateWindow.webContents.send("UpdateEvents", { message: "Update downloaded. " + "2.0.0-rc.20", type: "downloaded" });
    await Sleep(1000);
    this.updateWindow.close();
  }
}
