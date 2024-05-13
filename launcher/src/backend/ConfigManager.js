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
   * @param {Object|string} services - The configurations to include in the setup. If a string is provided,
   * it is treated as a single configuration ID. If an object is provided, it should map configuration IDs
   * to configuration objects.
   * @param {string} network - The network of the setup.
   * @returns {string} The ID of the created setup.
   */
  async createMultiSetupYaml(services, network) {
    try {
      // Check if the multi-setup configuration file exists
      const fileExistResult = await this.nodeConnection.sshService.exec(
        `test -f ${this.multiSetupPath} && echo "exist" || echo "notExist"`
      );

      // If the file does not exist, create it
      if (fileExistResult.stdout.includes("notExist")) {
        await this.nodeConnection.sshService.exec(`touch ${this.multiSetupPath}`);
      }

      // If a network & services are provided, create the multi-setup configuration content
      if (network && services) {
        await this.createMultiSetupContent(services, network);
      }
    } catch (error) {
      console.error(`Failed to create multi-setup configuration file in YAML format: ${error}`);
    }
  }

  /**
   * Creates the content for a multi-setup configuration.
   *
   * @param {Object|string} services - The configurations to include in the setup. If a string is provided,
   * it is treated as a single configuration ID. If an object is provided, it should map configuration IDs
   * to configuration objects.
   * @param {string} network - The network of the setup.
   * @param {string} [setupID=null] - The ID of the setup. If not provided, a new UUID will be generated.
   */
  // async createMultiSetupContent(services, network) {
  //   const commonServiceNames = [
  //     "PrometheusService",
  //     "GrafanaService",
  //     "PrometheusNodeExporterService",
  //     "NotificationService",
  //   ];
  //   const setupServices = services.filter((item) => !commonServiceNames.includes(item.service));
  //   const commonServices = services.filter((item) => commonServiceNames.includes(item.service));
  //   let setupServicesObj = {};
  //   let commonServicesObj = {};
  //   let existingSetups = await this.readMultiSetup();
  //   try {
  //     // Read the existing setups

  //     if (setupServices.length > 0) {
  //       let setupId = uuid.v4();
  //       setupServicesObj = {
  //         [setupId]: {
  //           name: "setup1",
  //           network: network,
  //           color: "default",
  //           type: "ETH",
  //           services: setupServices.map((service) => service.id),
  //         },
  //       };
  //     }
  //     if (commonServices.length > 0) {
  //       let setupId = uuid.v4();
  //       commonServicesObj = {
  //         [setupId]: {
  //           name: "commonServices",
  //           network: "default",
  //           color: "default",
  //           type: "default",
  //           services: commonServices.map((service) => service.id),
  //         },
  //       };
  //     }
  //     // let setups = { ...setupServicesObj, ...commonServicesObj };
  //     let setups = { ...existingSetups, ...setupServicesObj, ...commonServicesObj };
  //     // Write the setup to the multi-setup configuration file
  //     await this.writeMultiSetup(setups);
  //   } catch (error) {
  //     console.error(`Failed to create multi-setup configuration content: ${error}`);
  //   }
  // }
  async createMultiSetupContent(services, network) {
    let existingSetups = await this.readMultiSetup();
    let setupServicesObj = await this.createSetupContent(services, network);
    let commonServicesObj = await this.createCommonContent(services);
    let setups = { ...existingSetups, ...setupServicesObj, ...commonServicesObj };
    await this.writeMultiSetup(setups);
  }

  async createSetupContent(services, network) {
    const commonServiceNames = [
      "PrometheusService",
      "GrafanaService",
      "PrometheusNodeExporterService",
      "NotificationService",
    ];
    const setupServices = services.filter((item) => !commonServiceNames.includes(item.service));
    let setupServicesObj = {};
    if (setupServices.length > 0) {
      let setupId = uuid.v4();
      setupServicesObj = {
        [setupId]: {
          name: "setup1",
          network: network,
          color: "default",
          type: "ETH",
          services: setupServices.map((service) => service.id),
        },
      };
    }
    return setupServicesObj;
  }

  async createCommonContent(services) {
    const commonServiceNames = [
      "PrometheusService",
      "GrafanaService",
      "PrometheusNodeExporterService",
      "NotificationService",
    ];
    const commonServices = services.filter((item) => commonServiceNames.includes(item.service));
    let commonServicesObj = {};
    if (commonServices.length > 0) {
      let setupId = uuid.v4();
      commonServicesObj = {
        [setupId]: {
          name: "commonServices",
          network: "default",
          color: "default",
          type: "default",
          services: commonServices.map((service) => service.id),
        },
      };
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

  async renameSetup(setup) {
    let currentSetups = await this.readMultiSetup();
    let setupsObj = yaml.load(currentSetups);

    if (setupsObj[setup.setupId]) {
      setupsObj[setup.setupId].name = setup.setupName;
    }

    await this.writeMultiSetup(setupsObj);
  }

  /**
   * Adds a service to a setup in the multi-setup configuration.
   *
   * @param {string} serviceID - The ID of the service to add.
   * @param {string} network - The network of the service.
   * @param {string} [setupID=null] - The ID of the setup to add the service to.
   * If not provided and there is only one setup, this setup's ID will be used.
   */
  async addServiceIntoSetup(service, setupID = null) {
    try {
      let currentSetups = await this.readMultiSetup();
      let setupsObj = yaml.load(currentSetups);
      let commonSetupExist = false;
      let otherSetupExist = false;
      if (setupsObj) {
        for (let setup in setupsObj) {
          if (setupsObj[setup].name === "commonServices") commonSetupExist = true;
          if (setupsObj[setup].name !== "commonServices") otherSetupExist = true;
        }
        // console.log(setupsObj);
        // let setupNames = Object.keys(setupsObj);
        // console.log("setupnamessssssssssssssss", setupNames);
        // commonSetupExist = setupNames.some((name) => name === "commonServices");
        // otherSetupExist = setupNames.some((name) => !name !== "commonServices");
        console.log("common and other SETUPSSSSsssssssssssssss--------------------", commonSetupExist, otherSetupExist);
      }
      // If setupsObj is undefined, assign it an empty object
      if (!setupsObj) {
        setupsObj = {};
      }

      // If there is no common setup, create a new one
      if (!currentSetups || !commonSetupExist) {
        console.log("createCommonContent----------------------------------------------");
        await this.createCommonContent([service]);
        return;
      }

      if (!currentSetups || !otherSetupExist) {
        console.log("createSetupContent----------------------------------------------");
        await this.createSetupContent([service]);
        return;
      }

      // If setupID is not provided and there is only one setup, use its ID
      if (!setupID && Object.keys(setupsObj).length === 1) {
        setupID = Object.keys(setupsObj)[0];
      }

      // If the setup exists, add the service to it
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

  // to do-s for setup

  // add setup
  // export specific setup
  // import specific setup
}
