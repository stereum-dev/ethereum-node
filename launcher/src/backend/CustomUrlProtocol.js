import { BrowserWindow } from "electron";
import { URL } from "url";

export class ProtocolHandler {
  constructor(storageService) {
    this.storageService = storageService;
  }

  /**
   * Focus or create main window
   */
  focusWindow() {
    const mainWindow = BrowserWindow.getAllWindows()[0];
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.focus();
    }
  }

  /**
   * Get the default configuration
   * @returns {Object} Default config object
   */
  getDefaultConfig() {
    return {
      savedLanguage: {
        language: "english",
        flag: "img/flag/united-kingdom.png",
        label: "en",
      },
      savedConnections: [],
    };
  }

  /**
   * Validate server data
   * @param {Object} server - Server object to validate
   * @returns {boolean} Validation result
   */
  validateServerData(server) {
    return (
      server &&
      typeof server.name === "string" &&
      typeof server.host === "string" &&
      "user" in server &&
      "port" in server &&
      "keylocation" in server &&
      "useAuthKey" in server
    );
  }

  /**
   * Handle the custom URL protocol
   * @param {string} urlString - The URL to handle
   * @returns {Promise<boolean>} Success status
   */
  async handleCustomUrl(urlString) {
    console.log("Handling custom URL:", urlString);

    try {
      // Parse URL
      const parsedUrl = new URL(urlString);
      const data = parsedUrl.searchParams.get("data");

      if (!data) {
        console.warn("No data parameter found in URL");
        return false;
      }

      // Parse data
      const serverArray = JSON.parse(decodeURIComponent(data));
      if (!Array.isArray(serverArray)) {
        console.error("Data is not an array");
        return false;
      }

      // Read existing config
      const existingConfig = (await this.storageService.readConfig()) || this.getDefaultConfig();

      // savedConnections exists
      if (!existingConfig.savedConnections) {
        existingConfig.savedConnections = [];
      }

      // validate srvers
      let addedServers = 0;
      for (const newServer of serverArray) {
        if (this.validateServerData(newServer)) {
          // Chck for duplicates
          const isDuplicate = existingConfig.savedConnections.some((conn) => conn.host === newServer.host && conn.name === newServer.name);

          if (!isDuplicate) {
            existingConfig.savedConnections.push({
              name: newServer.name,
              host: newServer.host,
              user: newServer.user || "",
              port: newServer.port || "",
              keylocation: newServer.keylocation || "",
              useAuthKey: newServer.useAuthKey || false,
            });
            addedServers++;
          } else {
            console.log(`Skipping duplicate server: ${newServer.host}`);
          }
        } else {
          console.warn("Invalid server data:", newServer);
        }
      }

      // Write config
      if (addedServers > 0) {
        await this.storageService.writeConfig(existingConfig);
        console.log(`Successfully added ${addedServers} server(s)`);
      }

      this.focusWindow();

      return addedServers > 0;
    } catch (error) {
      console.error("Error handling custom URL:", error);
      return false;
    }
  }

  /**
   * Generate a protocol URL
   * @param {Object|Array} serverData - Server data to encode
   * @returns {string} Encoded URL
   */
  static generateProtocolUrl(serverData) {
    const data = encodeURIComponent(JSON.stringify(Array.isArray(serverData) ? serverData : [serverData]));
    return `stereumlauncher://open?data=${data}`;
  }
}
