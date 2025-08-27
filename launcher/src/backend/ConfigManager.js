const log = require("electron-log");
const yaml = require("js-yaml");
const uuid = require("uuid");

export class ConfigManager {
  constructor(nodeConnection) {
    this.nodeConnection = nodeConnection;
    this.serviceManager = null;
    this.multiSetupPath = "/etc/stereum/multisetup.yaml";
    this.commonServices = ["PrometheusService", "GrafanaService", "PrometheusNodeExporterService"];
  }
  setServiceManager(serviceManager) {
    this.serviceManager = serviceManager;
  }

  /**
   * Checks if the multi-setup file exists, reads all installed services if not, and creates a multi-setup.yaml file.
   */
  async checkAndCreateMultiSetup() {
    try {
      const fileExistResult = await this.checkFileExistence();
      if (!fileExistResult || !fileExistResult.stdout) {
        throw new Error("Invalid response from checkFileExistence");
      }

      const services = await this.serviceManager.readServiceConfigurations();
      if (!Array.isArray(services)) {
        throw new Error("Invalid response from readServiceConfigurations");
      }

      if (fileExistResult.stdout.includes("notExist")) {
        if (services.length === 0) {
          await this.createMultiSetupYaml({}, "");
        } else if (services.length > 0) {
          const network = services[0]?.network;
          if (!network) {
            throw new Error("Service configuration is missing network information");
          }
          await this.createMultiSetupYaml(services, network);
        }
      }
    } catch (error) {
      console.error("Error in checkAndCreateMultiSetup:", error.message, error.stack);
    }
  }

  /**
   * Asynchronously checks if a specific file exists on a remote system using SSH.
   * Executes 'test -f' to determine file presence, echoing "exist" or "notExist".
   *
   * @returns {Promise<Object>} Resolves with command execution result, indicating file existence.
   */
  async checkFileExistence() {
    const fileExistResult = await this.nodeConnection.sshService.exec(`test -f ${this.multiSetupPath} && echo "exist" || echo "notExist"`);
    return fileExistResult;
  }

  /**
   * Creates a multi-setup configuration file in YAML format.
   *
   * @param {Object|string} services - The configurations to include in the setup. If a string is provided,
   * it is treated as a single configuration ID. If an object is provided, it should map configuration IDs
   * to configuration objects.
   * @param {string} network - The network of the setup.
   */
  async createMultiSetupYaml(services, network) {
    try {
      // Check if the multiSetup configuration file exists
      const fileExistResult = await this.checkFileExistence();

      // If the file does not exist, create it
      if (fileExistResult.stdout.includes("notExist")) {
        await this.nodeConnection.sshService.exec(`touch ${this.multiSetupPath}`);
      }

      if (!Array.isArray(services)) {
        services = [];
      }

      await this.createMultiSetupContent(services, network);
    } catch (error) {
      console.error(`Failed to create multi-setup configuration file in YAML format: ${error}`);
    }
  }

  /**
   * Creates the content for a multi-setup configuration file.
   * @param {Object|string} services - The configurations to include in the setup.
   * @param {string} network - The network of the setup.
   * @returns {Promise<void>} - does not return anything.
   */
  async createMultiSetupContent(services, network) {
    let setupServicesObj = await this.createSetupContent(services, network);
    let commonServicesObj = await this.createCommonContent(services);
    let setups = { ...setupServicesObj, ...commonServicesObj };
    await this.writeMultiSetup(setups);
  }

  /**
   * Creates the content for a setup
   *
   * @param {Array} services - The services to include in the setup.
   * @param {string} network - The network of the setup.
   * @returns {Object} - An object representing the setup configuration.
   */

  async createSetupContent(services, network) {
    let setupServicesObj = {};
    let ethServices = [];
    let opServices = [];

    // Categorize services
    services.forEach((service) => {
      if (!this.commonServices.includes(service.service)) {
        if (
          service.service === "OpGethService" ||
          service.service === "OpNodeBeaconService" ||
          service.service === "L2GethService" ||
          service.service === "OpErigonService" ||
          service.service === "OpRethService"
        ) {
          opServices.push(service.id);
        } else {
          ethServices.push(service.id);
        }
      }
    });

    // Create ETH setup if there are ETH services
    if (ethServices.length > 0) {
      let ethsetupId = uuid.v4();
      setupServicesObj[ethsetupId] = {
        name: "ethSetup1",
        network: network === "op-mainnet" ? "mainnet" : network === "op-sepolia" ? "sepolia" : network,
        color: "default",
        type: "ETH",
        services: ethServices,
      };
    }

    // Create OP setup if there are OP services
    if (opServices.length > 0) {
      let opSetupId = uuid.v4();
      setupServicesObj[opSetupId] = {
        name: "opSetup1",
        network: network,
        color: "default",
        type: "OP",
        services: opServices,
      };
    }

    return setupServicesObj;
  }

  /**
   * Creates the content for a common setup
   *
   * @param {Array} services - The services to include in the setup.
   * @returns {Promise<Object>} - An object representing the common services setup configuration.
   */
  async createCommonContent(services) {
    const commonServices = services.filter((item) => this.commonServices.includes(item.service));
    let currentSetups = await this.readMultiSetup();
    let setupsObj = yaml.load(currentSetups);

    let setupId;
    let commonServicesObj;

    // Check if a commonServices setup already exists
    for (let key in setupsObj) {
      if (setupsObj[key].name === "commonServices") {
        setupId = key;
        commonServicesObj = { [setupId]: setupsObj[key] };
        break;
      }
    }

    // If no commonServices setup exists, create a new one
    if (!commonServicesObj) {
      setupId = uuid.v4();
      commonServicesObj = {
        [setupId]: {
          name: "commonServices",
          network: "default",
          color: "default",
          type: "common",
          services: [],
        },
      };
    }

    if (commonServices.length > 0) {
      commonServicesObj[setupId].services = commonServicesObj[setupId].services.concat(commonServices.map((service) => service.id));
    }
    return commonServicesObj;
  }

  /**
   * Writes a setup to the multi-setup configuration file.
   *
   * @param {Object} setup - The setup to write to the multi-setup configuration file.
   */
  async writeMultiSetup(setup) {
    try {
      // Convert the setup object to a YAML string and escape backticks
      let setupYaml = yaml.dump(setup).replace(/`/g, "\\`");

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
   * Renames an existing setup.
   *
   * @param {Object} setup - The setup object.
   * @param {string} setup.setupId - The id of the setup to rename.
   * @param {string} setup.setupName - The new name for the setup.
   */
  async renameSetup(setup) {
    try {
      let currentSetups = await this.readMultiSetup();
      let setupsObj = yaml.load(currentSetups);

      if (setupsObj[setup.setupId]) {
        setupsObj[setup.setupId].name = setup.setupName;
      } else {
        throw new Error(`Setup with id ${setup.setupId} not found.`);
      }

      await this.writeMultiSetup(setupsObj);
    } catch (error) {
      console.error(`Failed to rename setup: ${error.message}`);
      throw error;
    }
  }

  /**
   * Adds a service to a setup in the multi-setup configuration.
   *
   * @param {string} service - The ID of the service to add.
   * @param {string} [setupID=null] - The ID of the setup to add the service to.
   */
  async addServiceIntoSetup(service, setupID) {
    try {
      let currentSetups = await this.readMultiSetup();
      let setupsObj = yaml.load(currentSetups);

      // If the setup exists, add the service into it
      if (setupsObj[setupID]) {
        let setupServices = setupsObj[setupID].services;
        if (!setupServices.includes(service.id)) {
          setupServices.push(service.id);
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
      console.error(`Failed to delete service from multiSetup: ${error}`);
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

  /**
   * retrieves a specific setup by its ID
   *
   * @param {string} setupID - The ID of the setup to retrieve.
   * @returns {Promise<Object>} A promise that resolves to the setup configuration.
   */
  async getSetup(setupID) {
    let currentSetups = await this.readMultiSetup();
    let setupsObj = yaml.load(currentSetups);

    return {
      [setupID]: setupsObj[setupID],
    };
  }

  /**
   * Creates a new setup and adds it to the multi-setup configuration.
   *
   * @param {Object} newSetup - The setup object to add.
   */
  async createSetup(newSetup) {
    let currentSetups = await this.readMultiSetup();
    let setupsObj = {};
    if (currentSetups) {
      setupsObj = yaml.load(currentSetups);
    }
    let setupId = uuid.v4();
    if (!setupsObj[setupId]) {
      setupsObj[setupId] = newSetup;
      await this.writeMultiSetup(setupsObj);
    }
  }

  async getSetups() {
    let currentSetups = await this.readMultiSetup();
    let setupsObj = yaml.load(currentSetups);

    return setupsObj;
  }

  async switchSetupNetwork(data) {
    if (typeof data.setupId !== "string" || typeof data.network !== "string") {
      console.error("Invalid parameters");
      return false;
    }

    let currentSetups = await this.readMultiSetup();
    let setupsObj = yaml.load(currentSetups);
    if (setupsObj.hasOwnProperty(data.setupId)) {
      setupsObj[data.setupId].network = data.network;
      await this.writeMultiSetup(setupsObj);
      return true;
    } else {
      throw new Error("Setup ID not found"); // Enhanced error handling
    }
  }
}
