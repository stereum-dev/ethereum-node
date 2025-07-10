import axios from "axios";
import { SSHService } from "./SSHService";
const log = require("electron-log");

export class NodeUpdates {
  constructor(nodeConnection) {
    this.nodeConnection = nodeConnection;
  }

  /**
   * runs the "upgrade-prep" role
   * executes do-release-upgrade
   * runs the "switch-repos" role
   * @returns {number}
   */
  async upgrade() {
    try {
      log.info("Preparing for Upgrade to noble numbat ...");
      await this.nodeConnection.runPlaybook("upgrade-prep", { stereum_role: "upgrade-prep" });
      log.info("Starting Upgrade to noble numbat ...");
      const result = await this.nodeConnection.sshService.exec(
        "do-release-upgrade -f DistUpgradeViewNonInteractive --allow-third-party && touch /var/run/reboot-required"
      );
      await this.nodeConnection.restartServer();
      if (SSHService.checkExecError(result)) throw SSHService.extractExecError(result);
      log.info("Switching third party repos to noble numbat ...");
      await this.nodeConnection.runPlaybook("switch-repos", { stereum_role: "switch-repos" });
    } catch (err) {
      log.error(err);
      return 0;
    }
    return 1;
  }

  /**
   * fetches the updates.json from stereum.net
   * @returns {Object} - updates available for services
   */
  async checkUpdates() {
    if (!this.nodeConnection.settings?.stereum?.settings?.updates?.lane) {
      await this.nodeConnection.findStereumSettings();
    }
    const lane = this.nodeConnection.settings?.stereum?.settings?.updates?.lane || "stable";
    let response = await axios.get(`https://stereum.net/downloads/updates${lane == "dev" ? ".dev" : ""}.json`);
    if (global.branch === "main") response.data.stereum.push({ name: "HEAD", commit: "main" });
    return response.data;
  }

  /**
   * updateStereum and updateServices
   * @param {string} commit
   * @returns {number}
   */
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

  /**
   * runs the "update-services" role
   * @param {string} services
   * @returns {number} seconds
   */
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

  /**
   * runs the "update-stereum" role
   * @param {string} commit - commit id
   * @returns {number} - playbook runtime
   */
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

  /**
   * Returns the current Unix timestamp rounded up to the nearest second
   * @returns {number} - unix timestamp in seconds
   */
  getTimeStamp() {
    return Math.ceil(Date.now() / 1000);
  }

  /**
   * runs the "restart-services" role
   * @param {number} seconds
   */
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

  /**
   * runs a shell command to get the current OS-Version number
   * @returns {string} - Example: 22.04.3
   */
  async getCurrentOsVersion() {
    try {
      const res = await this.nodeConnection.sshService.exec(`lsb_release -d | awk '{print $3}'`);
      return res.stdout;
    } catch (err) {
      log.error("Error occurred during get count of updating OS packages:\n", err);
    }
  }

  /**
   * runs a shell command
   * @returns {string} - a string representing the count of upgradable packages
   */
  async getCountOfUpdatableOSUpdate() {
    try {
      const res = await this.nodeConnection.sshService.exec(`LANG=C apt-get upgrade -s |grep -P '^\\d+ upgraded'|cut -d" " -f1`);

      return res.stdout;
    } catch (err) {
      log.error("Error occurred during get count of updating OS packages:\n", err);
    }
  }

  /**
   * runs the "update-os" role to update the os packages
   * @returns {number} - playbook runtime in seconds
   */
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

  /**
   * runs the "update-package" role, update of one or more specific packages
   * @param {string[]} packages - Array of Packagenames to upgrade
   * @returns {number} - playbook runtime
   */
  async updatePackage(packages) {
    let packagesListString = packages.join(",");
    let extraVars = {
      stereum_role: "update-package",
      packages_list: packagesListString,
    };
    try {
      let before = this.getTimeStamp();
      await this.nodeConnection.runPlaybook("update-package", extraVars);
      let after = this.getTimeStamp();
      return after - before;
    } catch (err) {
      log.error("Error occurred running update-package:\n", err);
      return 0;
    }
  }

  /**
   * executes "apt update" and "apt list --upgradable" on the remote Node
   * @returns {Object[]} - An array of objects representing package names and versions from "apt list --upgradable"
   * Example: [{ packageName: 'gjs', oldVersion: '1.72.2', newVersion: '1.72.4' },{ packageName: 'libgjs0g', oldVersion: '1.72.2', newVersion: '1.72.4' },]
   */
  async getUpgradeablePackages() {
    try {
      await this.nodeConnection.sshService.exec(`apt update`);
      const output = await this.nodeConnection.sshService.exec(`apt list --upgradable`);
      const stdout = output.stdout;

      // Ensure the stdout ends with a newline character
      const outputWithNewline = stdout.endsWith("\n") ? stdout : stdout + "\n";

      // Split the output into lines
      const lines = outputWithNewline.split("\n");

      const packages = lines
        .slice(1)
        .map((line) => {
          // Extract package name, old version, and new version using regex
          const match = line.match(/^(.*?)\/.*?\s(.*?)\s.*?\s\[upgradable from: (.*?)\]$/);
          if (match && match.length === 4) {
            const packageName = match[1];
            // Extract version numbers without distribution-specific suffixes
            const oldVersion = match[3].split("-")[0];
            const newVersion = match[2].split("-")[0];
            return { packageName, oldVersion, newVersion };
          } else {
            return null; // Return null for lines that don't match the regex
          }
        })
        .filter((entry) => entry !== null); // Filter out null entries
      return packages;
    } catch (err) {
      log.error("Error occurred during get list of upgradeable os packages:\n", err);
      return []; // Return an empty array in case of error
    }
  }
}
