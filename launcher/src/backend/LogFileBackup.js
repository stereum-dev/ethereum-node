import { app } from "electron";
import * as fs from "fs";

export class LogFileBackup {
  async backupLogFiles() {
    let logPath = app.getPath("userData");
    let backupPath;
    if (process.platform != "darwin") {
      logPath += "/logs/";
    }
    backupPath = logPath + "backups/";

    if (!fs.existsSync(backupPath)) {
      fs.mkdirSync(backupPath);
    }

    fs.copyFileSync(`${logPath}main.log`, `${backupPath}main-${Date.now()}.log`);
  }

  async deleteLogBackups(maxLogs) {
    let backupLogs = [];
    let logPath = app.getPath("userData");
    let backupPath;
    if (process.platform != "darwin") {
      logPath += "/logs/";
    }
    backupPath = logPath + "backups/";

    fs.readdir(backupPath, (err, files) => {
      files.forEach((file) => {
        backupLogs.push(file);
      });
      if (backupLogs.length > maxLogs) {
        backupLogs.reverse();
        for (let i = maxLogs; i < backupLogs.length; i++) {
          fs.unlinkSync(backupPath + backupLogs[i], (err) => {
            if (err) throw err;
          });
        }
      }
    });
  }
}
