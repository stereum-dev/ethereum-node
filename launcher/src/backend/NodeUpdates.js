import axios from "axios";
import { SSHService } from "./SSHService";
const log = require("electron-log");

export class NodeUpdates {

	constructor(nodeConnection) {
    this.nodeConnection = nodeConnection;
  }

	async upgrade() {
			try{
				log.info("Preparing for Upgrade to noble numbat ...");
				await this.nodeConnection.runPlaybook("upgrade_prep", {stereum_role: "upgrade_prep",});	
				log.info("Starting Upgrade to noble numbat ...");
				const result = await this.nodeConnection.sshService.exec("do-release-upgrade -d -f DistUpgradeViewNonInteractive --allow-third-party");
				await this.nodeConnection.restartServer();
				if (SSHService.checkExecError(result)) throw SSHService.extractExecError(result);
				log.info("Switching third party repos to noble numbat ...");
				await this.nodeConnection.runPlaybook("switch_repos", {stereum_role: "switch_repos",});			
				
			} catch (err) {
				log.error(err);
				return 1;
			}
    return 0;
		}					

  async checkUpdates() {
    let response = await axios.get("https://stereum.net/downloads/updates.json");
    if (global.branch === "main") response.data.stereum.push({ name: "HEAD", commit: "main" });
    return response.data;
  }

  async runAllUpdates(commit) {
    //stereum and service updates
    let before = 0;
    let after = 0;
    try {
      before = this.getTimeStamp();
      await this.updateStereum(commit);
      await this.updateServices();
      after = this.getTimeStamp();
    } catch (err) {
      log.error("Error occurred running all updates:\n", err);
      return 30;
    }
    if (after != 0 && before != 0) return after - before;
    return 30;
  }

  async updateServices(services) {
    try {
      let before = this.getTimeStamp();
      await this.nodeConnection.runPlaybook("Update Services", {
        stereum_role: "update-services",
        services_to_update: services ? services : undefined,
      });
      let after = this.getTimeStamp();
      return after - before;
    } catch (err) {
      log.error("Error occurred running service updates:\n", err);
      return 0;
    }
  }

  async updateStereum(commit) {
    let extraVars = {
      stereum_role: "update-stereum",
      stereum_args: {
        override_gitcommit: commit ? commit : undefined,
      },
    };
    try {
      let before = this.getTimeStamp();
      await this.nodeConnection.runPlaybook("Update Stereum", extraVars);
      await this.nodeConnection.runPlaybook("Update Changes", { stereum_role: "update-changes" });
      let after = this.getTimeStamp();
      return after - before;
    } catch (err) {
      log.error("Error occurred running stereum updates:\n", err);
      return 0;
    }
  }

  getTimeStamp() {
    return Math.ceil(Date.now() / 1000);
  }

  async restartServices(seconds) {
    try {
      await this.nodeConnection.runPlaybook("Restart Services", {
        stereum_role: "restart-services",
        restart_time_scope: seconds + 10,
      });
    } catch (err) {
      log.error("Error occurred during restarting services:\n", err);
    }
  }

  async getCurrentOsVersion() {
    try {
      const res = await this.nodeConnection.sshService.exec(`lsb_release -d | awk '{print $3}'`);
      return res.stdout;
    } catch (err) {
      log.error("Error occurred during get count pd updating os packages:\n", err);
    }
  }

  async getCountOfUpdatableOSUpdate() {
    try {
      const res = await this.nodeConnection.sshService.exec(`LANG=C apt-get upgrade -s |grep -P '^\\d+ upgraded'|cut -d" " -f1`);

      return res.stdout;
    } catch (err) {
      log.error("Error occurred during get count pd updating os packages:\n", err);
    }
  }

  async updateOS() {
    try {
      let before = this.getTimeStamp();
      await this.nodeConnection.runPlaybook("Update OS", {
        stereum_role: "update-os",
        stereum_args: { only_os_updates: true },
      });
      let after = this.getTimeStamp();
      return after - before;
    } catch (err) {
      log.error("Error occurred running os package updates:\n", err);
      return 0;
    }
  }
}