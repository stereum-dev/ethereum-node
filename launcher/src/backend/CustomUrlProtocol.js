import { app, BrowserWindow } from "electron";
import { URL } from "url";

export class ProtocolHandler {
  constructor(storageService) {
    this.storageService = storageService;
    this.initializeProtocolHandler();
  }

  /**
   * Initialize protocol handlers for all platforms
   */
  initializeProtocolHandler() {
    if (app.isReady()) {
      app.setAsDefaultProtocolClient("stereumlauncher");
    } else {
      app.on("ready", () => {
        app.setAsDefaultProtocolClient("stereumlauncher");
      });
    }

    // Handle protocol activation for Windows
    if (process.platform === "win32") {
      const gotTheLock = app.requestSingleInstanceLock();
      if (!gotTheLock) {
        app.quit();
        return;
      }

      app.on("second-instance", (event, argv) => {
        const url = argv.find((arg) => arg.startsWith("stereumlauncher://"));
        if (url) {
          this.handleCustomUrl(url);
        }
        this.focusWindow();
      });

      // Handle protocol for Windows when app starts
      const protocolUrl = process.argv.find((arg) => arg.startsWith("stereumlauncher://"));
      if (protocolUrl) {
        this.handleCustomUrl(protocolUrl);
      }
    }

    // Handle protocol activation for macOS
    if (process.platform === "darwin") {
      app.on("open-url", (event, url) => {
        event.preventDefault();
        this.handleCustomUrl(url);
      });
    }

    // Handle protocol activation for Linux
    if (process.platform === "linux") {
      app.on("ready", () => {
        // Handle any URLs passed on startup
        const protocolUrl = process.argv.find((arg) => arg.startsWith("stereumlauncher://"));
        if (protocolUrl) {
          this.handleCustomUrl(protocolUrl);
        }
      });

      // Linux also uses second-instance like Windows
      app.on("second-instance", (event, argv) => {
        const url = argv.find((arg) => arg.startsWith("stereumlauncher://"));
        if (url) {
          this.handleCustomUrl(url);
        }
        this.focusWindow();
      });
    }
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

      // Parse server data
      const serverArray = JSON.parse(decodeURIComponent(data));
      if (!Array.isArray(serverArray)) {
        console.error("Data is not an array");
        return false;
      }

      // Read existing config using storageService
      const existingConfig = (await this.storageService.readConfig()) || this.getDefaultConfig();

      // Ensure savedConnections exists
      if (!existingConfig.savedConnections) {
        existingConfig.savedConnections = [];
      }

      // Process and validate servers
      let addedServers = 0;
      for (const newServer of serverArray) {
        if (this.validateServerData(newServer)) {
          // Check for duplicates
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

      // Save if we added any servers
      if (addedServers > 0) {
        await this.storageService.writeConfig(existingConfig);
        console.log(`Successfully added ${addedServers} server(s)`);
      }

      // Focus the window
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
