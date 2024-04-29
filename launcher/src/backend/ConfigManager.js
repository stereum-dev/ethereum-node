const log = require("electron-log");
const yaml = require("js-yaml");
const uuid = require("uuid");

export class ConfigManager {
  constructor(nodeConnection) {
    this.nodeConnection = nodeConnection;
    this.multiSetupPath = "/etc/stereum/multisetup.yaml";
  }

  /**
   * Creates a multi-setup configuration file in YAML format.
   *
   * @param {Object|string} configs - The configurations to include in the setup. If a string is provided,
   * it is treated as a single configuration ID. If an object is provided, it should map configuration IDs
   * to configuration objects.
   * @param {string} network - The network of the setup.
   * @returns {string} The ID of the created setup.
   */
  async createMultiSetupYaml(configs, network) {
    // Generate a new UUID for the setup
    let setupID = uuid.v4();

    try {
      // Check if the multi-setup configuration file exists
      const fileExistResult = await this.nodeConnection.sshService.exec(
        `test -f ${this.multiSetupPath} && echo "exist" || echo "notExist"`
      );

      // If the file does not exist, create it
      if (fileExistResult.stdout.includes("notExist")) {
        await this.nodeConnection.sshService.exec(`touch ${this.multiSetupPath}`);
      }

      // If a network is provided, create the multi-setup configuration content
      if (network) {
        await this.createMultiSetupContent(configs, network, setupID);
      }

      // Return the ID of the created setup for One-Click installation
      return setupID;
    } catch (error) {
      console.error(`Failed to create multi-setup configuration file in YAML format: ${error}`);
    }
  }

  /**
   * Creates the content for a multi-setup configuration.
   *
   * @param {Object|string} configs - The configurations to include in the setup. If a string is provided,
   * it is treated as a single configuration ID. If an object is provided, it should map configuration IDs
   * to configuration objects.
   * @param {string} network - The network of the setup.
   * @param {string} [setupID=null] - The ID of the setup. If not provided, a new UUID will be generated.
   */
  async createMultiSetupContent(configs, network, setupID = null) {
    try {
      // Generate a new UUID if setupID is not provided
      setupID = setupID === null ? uuid.v4() : setupID;

      // Create the setup object
      let setup = {
        [setupID]: {
          name: "setup1",
          network: network,
          color: "default",
          type: "ETH",
          services:
            typeof configs === "string"
              ? [configs]
              : Array.isArray(configs) && configs.length > 0
              ? configs.map((config) => config.id)
              : [],
        },
      };

      // Write the setup to the multi-setup configuration file
      await this.writeMultiSetup(setup);
    } catch (error) {
      console.error(`Failed to create multi-setup configuration content: ${error}`);
    }
  }

  /**
   * Writes a setup to the multi-setup configuration file.
   *
   * @param {Object} setup - The setup to write to the multi-setup configuration file.
   */
  async writeMultiSetup(setup) {
    try {
      // Convert the setup object to a YAML string and escape backticks
      let setupYaml = yaml.safeDump(setup).replace(/`/g, "\\`");

      await this.nodeConnection.sshService.exec(`echo -e "${setupYaml}" > ${this.multiSetupPath}`);
    } catch (error) {
      console.error(`Failed to write setup to multi-setup configuration file: ${error}`);
    }
  }

  /**
   * Reads the multi-setup configuration file.
   *
   * @returns {Promise<string|undefined>} The content of the multi-setup configuration file,
   * or undefined if an error occurs.
   */
  async readMultiSetup() {
    try {
      let result = await this.nodeConnection.sshService.exec(`cat ${this.multiSetupPath}`);
      if (result) {
        return result.stdout;
      } else {
        log.error("Result is undefined");
        return undefined;
      }
    } catch (err) {
      log.error("Can't read multiConfig file", err);
      return undefined;
    }
  }

  /**
   * Adds a service to a setup in the multi-setup configuration.
   *
   * @param {string} serviceID - The ID of the service to add.
   * @param {string} network - The network of the service.
   * @param {string} [setupID=null] - The ID of the setup to add the service to.
   * If not provided and there is only one setup, this setup's ID will be used.
   */
  async addServiceIntoSetup(serviceID, network, setupID = null) {
    try {
      let currentSetups = await this.readMultiSetup();
      let setupsObj = yaml.load(currentSetups);
      // If setupsObj is undefined, assign it an empty object
      if (!setupsObj) {
        setupsObj = {};
      }

      // If there are no setups, create a new one
      if (!currentSetups || Object.keys(setupsObj).length === 0) {
        await this.createMultiSetupContent(serviceID, network, setupID);
        return;
      }

      // If setupID is not provided and there is only one setup, use its ID
      if (!setupID && Object.keys(setupsObj).length === 1) {
        setupID = Object.keys(setupsObj)[0];
      }

      // If the setup exists, add the service to it
      if (setupsObj[setupID]) {
        let services = setupsObj[setupID]?.services;
        if (!services.includes(serviceID)) {
          services.push(serviceID);
        }
        await this.writeMultiSetup(setupsObj);
      } else {
        console.log("Setup not found!");
      }
    } catch (error) {
      console.error(`Failed to add service to setup: ${error}`);
    }
  }

  /**
   * Deletes a service from a setup.
   *
   * @param {string} serviceID - The ID of the service to be deleted.
   * @param {string} setupID - The ID of the setup from which the service will be deleted.
   * @throws Will throw an error if the reading or writing operations fail.
   */
  async deleteServiceFromSetup(serviceID, setupID) {
    try {
      let currentSetups = await this.readMultiSetup();
      let setupsObj = yaml.load(currentSetups);

      // Check if the setup exists and contains the service
      if (setupsObj[setupID] && setupsObj[setupID].services.includes(serviceID)) {
        setupsObj[setupID].services = setupsObj[setupID].services.filter((id) => id !== serviceID);

        await this.writeMultiSetup(setupsObj);
      } else {
        console.log(`Service ${serviceID} not found in setup ${setupsObj[setupID].name}`);
      }
    } catch (error) {
      console.error(`Failed to delete service from multi-setup: ${error}`);
    }
  }

  /**
   * Deletes a setup.
   *
   * @param {string} setupID - The ID of the setup to be deleted.
   * @throws Will throw an error if the reading or writing operations fail.
   */
  async deleteSetup(setupID) {
    try {
      let currentSetups = await this.readMultiSetup();
      let setupsObj = yaml.load(currentSetups);

      delete setupsObj[setupID];

      await this.writeMultiSetup(setupsObj);
    } catch (error) {
      console.error(`Failed to delete service from multi-setup: ${error}`);
    }
  }

  async getSetup(setupID) {
    let currentSetups = await this.readMultiSetup();
    let setupsObj = yaml.load(currentSetups);

    return setupsObj[setupID];
  }

  async setSetup(setupID, setup) {
    let currentSetups = await this.readMultiSetup();
    let setupsObj = yaml.load(currentSetups);

    setupsObj[setupID] = setup;

    await this.writeMultiSetup(setupsObj);
  }

  async getSetups() {
    let currentSetups = await this.readMultiSetup();
    let setupsObj = yaml.load(currentSetups);

    return setupsObj;
  }

  // to do-s for setup

  // add setup
  // import entire setup
  // export specific setup
  // import specific setup
}
