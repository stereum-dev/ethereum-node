import { ServiceManager } from "./ServiceManager";
import YAML from "yaml"
import { StringUtils } from "./StringUtils";

const log = require("electron-log");

async function Sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class OneClickInstall {
  async prepareNode(installDir, nodeConnection) {
    this.installDir = installDir;
    this.nodeConnection = nodeConnection;
    this.serviceManager = new ServiceManager(this.nodeConnection);
    const arch = await this.nodeConnection.getCPUArchitecture();
    const settings = {
      stereum_settings: {
        settings: {
          controls_install_path: this.installDir || "/opt/stereum",
          arch: arch,
          updates: {
            lane: "stable",
            unattended: {
              install: false
            }
          }
        }
      }
    }
    await this.nodeConnection.sshService.exec(`rm -rf /etc/stereum &&\
    mkdir -p /etc/stereum/services &&\
    echo -e ${StringUtils.escapeStringForShell(YAML.stringify(settings))} > /etc/stereum/stereum.yaml`);
    await this.nodeConnection.findStereumSettings();
    return await this.nodeConnection.prepareStereumNode(
      this.nodeConnection.settings.stereum.settings.controls_install_path
    );
  }

  //this is broken
  async chooseClient(clients) {
    clients = {
      PRYSM: 24,
      LIGHTHOUSE: 24,
      NIMBUS: 24,
      TEKU: 20,
    };
    let buffer = [];
    let clientDistribution = [];
    let sum = 0;
    let range = 0;

    Object.keys(clients).forEach((key) => {
      buffer.push({ name: key, coverage: clients[key] });
    });

    buffer.forEach((client) => {
      sum += 100 / client.coverage;
    });

    buffer.forEach((client) => {
      clientDistribution.push({ name: client.name, percentage: (100 / client.coverage / sum) * 100 });
    });

    clientDistribution.forEach((client) => {
      client.min = range;
      range = range + client.percentage;
      client.max = range;
    });

    const ran = Math.random() * 100;
    const winner = clientDistribution.find((client) => client.min <= ran && client.max >= ran);
    log.info(winner, ran);
    return winner.name.toLowerCase();
  }

  clearSetup() {
    this.beaconService = undefined;
    this.validatorService = undefined;
    this.installDir = undefined;
    this.executionClient = undefined;
    this.setup = undefined;
    this.choosenClient = undefined;
    this.network = undefined;
    this.mevboost = undefined;
    this.needsKeystore = [];
    this.extraServices = [];
    this.notToStart = [];
  }

  getConfigurations() {
    let serviceList = [];
    serviceList.push(
      this.beaconService,
      this.executionClient,
    );
    if (this.mevboost) serviceList.push(this.mevboost);
    if (this.validatorService) serviceList.push(this.validatorService);
    if (this.extraServices) this.extraServices.forEach((service) => serviceList.push(service));
    serviceList.forEach((service) => {
      if (service.switchImageTag) service.switchImageTag(this.nodeConnection.settings.stereum.settings.arch)
    })
    return serviceList.map(service => service.buildConfiguration());
  }


  async createServices(constellation, checkpointURL, relayURL, selectedPreset) {
    this.needsKeystore = [];
    let args = {
      network: this.network,
      installDir: this.installDir,
      checkpointURL: checkpointURL,
      relays: relayURL
    }
    if (constellation.includes("GethService")) {
      //GethService
      this.executionClient = this.serviceManager.getService("GethService", args)
    }

    if (constellation.includes("RethService")) {
      //RethService
      this.executionClient = this.serviceManager.getService("RethService", args)
    }

    if (constellation.includes("BesuService")) {
      //BesuService
      this.executionClient = this.serviceManager.getService("BesuService", args)
    }

    if (constellation.includes("NethermindService")) {
      //NethermindService
      this.executionClient = this.serviceManager.getService("NethermindService", args)
    }

    if (constellation.includes("ErigonService")) {
      //ErigonService
      this.executionClient = this.serviceManager.getService("ErigonService", args)
    }

    if (constellation.includes("FlashbotsMevBoostService")) {
      //FlashbotsMevBoostService
      this.mevboost = this.serviceManager.getService("FlashbotsMevBoostService", args)
    }

    if (constellation.includes("LighthouseBeaconService")) {
      //LighthouseBeaconService
      this.beaconService = this.serviceManager.getService("LighthouseBeaconService", { ...args, executionClients: [this.executionClient], ...(this.mevboost && { mevboost: [this.mevboost] }) })
    }

    if (constellation.includes("LodestarBeaconService")) {
      //LodestarBeaconService
      this.beaconService = this.serviceManager.getService("LodestarBeaconService", { ...args, executionClients: [this.executionClient], ...(this.mevboost && { mevboost: [this.mevboost] }) })
    }

    if (constellation.includes("PrysmBeaconService")) {
      //PrysmBeaconService
      this.beaconService = this.serviceManager.getService("PrysmBeaconService", { ...args, executionClients: [this.executionClient], ...(this.mevboost && { mevboost: [this.mevboost] }) })
    }

    if (constellation.includes("NimbusBeaconService")) {
      //NimbusBeaconService
      this.beaconService = this.serviceManager.getService("NimbusBeaconService", { ...args, executionClients: [this.executionClient], ...(this.mevboost && { mevboost: [this.mevboost] }) })
    }

    if (constellation.includes("TekuBeaconService")) {
      //TekuBeaconService
      this.beaconService = this.serviceManager.getService("TekuBeaconService", { ...args, executionClients: [this.executionClient], ...(this.mevboost && { mevboost: [this.mevboost] }) })
    }
    let charon = undefined
    if (constellation.includes("CharonService")) {
      //SSVNetworkService
      charon = this.serviceManager.getService("CharonService", { ...args, beaconServices: [this.beaconService] })

      this.extraServices.push(charon)
      this.notToStart.push(charon.id)
    }

    if (constellation.includes("LighthouseValidatorService")) {
      //LighthouseValidatorService
      this.validatorService = this.serviceManager.getService("LighthouseValidatorService", { ...args, beaconServices: [charon ? charon : this.beaconService] })
    }

    if (constellation.includes("LodestarValidatorService")) {
      //LodestarValidatorService
      this.validatorService = this.serviceManager.getService("LodestarValidatorService", { ...args, beaconServices: [charon ? charon : this.beaconService] })
    }

    if (constellation.includes("PrysmValidatorService")) {
      //PrysmValidatorService
      this.validatorService = this.serviceManager.getService("PrysmValidatorService", { ...args, beaconServices: [charon ? charon : this.beaconService] })
    }


    if (constellation.includes("NimbusValidatorService")) {
      //NimbusBeaconService
      this.validatorService = this.serviceManager.getService("NimbusValidatorService", { ...args, beaconServices: [charon ? charon : this.beaconService] })
      this.needsKeystore.push(this.validatorService)
    }

    if (constellation.includes("TekuValidatorService")) {
      //TekuBeaconService
      this.validatorService = this.serviceManager.getService("TekuValidatorService", { ...args, beaconServices: [charon ? charon : this.beaconService] })
      this.needsKeystore.push(this.validatorService)
    }

    if (constellation.includes("SSVNetworkService")) {
      //SSVNetworkService
      this.validatorService = this.serviceManager.getService("SSVNetworkService", { ...args, beaconServices: [this.beaconService], executionClients: [this.executionClient] })
      this.needsKeystore.push(this.validatorService)
    }

    if (constellation.includes("PrometheusNodeExporterService")) {
      //PrometheusNodeExporterService
      this.extraServices.push(this.serviceManager.getService("PrometheusNodeExporterService", args))
    }

    if (constellation.includes("PrometheusService")) {
      //PrometheusService
      this.extraServices.push(this.serviceManager.getService("PrometheusService", args))
    }

    if (constellation.includes("GrafanaService")) {
      //GrafanaService
      this.extraServices.push(this.serviceManager.getService("GrafanaService", args))
    }

    if (constellation.includes("NotificationService")) {
      //NotificationService
      this.extraServices.push(this.serviceManager.getService("NotificationService", args))
    }

    if (selectedPreset == "staking") {
      switch (this.executionClient.service) {
        case "RethService":
          this.executionClient.command.push("--full");
          break;
      }
    }
    else if (selectedPreset == "archive") {
      switch (this.executionClient.service) {
        case "GethService":
          this.executionClient.command.push("--syncmode full");
          this.executionClient.command.push("--gcmode archive");
          break;
        case "RethService":
          //archvie by default
          break;
        case "ErigonService":
          //archive by default
          break;
        case "BesuService":
          this.executionClient.command[this.executionClient.command.findIndex((c) => c.includes("--sync-mode=X_SNAP"))] = "--sync-mode=FULL";
          this.executionClient.command[this.executionClient.command.findIndex((c) => c.includes("--pruning-enabled=true"))] = "--pruning-enabled=false";
          break;
        case "NethermindService":
          this.executionClient.command[this.executionClient.command.findIndex((c) => c.includes("--config"))] += "_archive";
          this.executionClient.command[this.executionClient.command.findIndex((c) => c.includes("--Pruning.Mode=Hybrid"))] = "--Pruning.Mode=None";
          break;
      }
    }

    let versions;
    try {
      versions = await this.nodeConnection.checkUpdates();
    } catch (err) {
      log.error(`Couldn't fetch versions in OneClickInstallation...
      Installing with predefined Versions
      ${err.name}: ${err.message}
      url: ${err.config.url}
      method: ${err.config.method}
      headers: ${err.config.headers}
      timeout: ${err.config.timeout}
      `);
    }
    if (versions) {
      this.executionClient.imageVersion = this.getLatestVersion(versions, this.executionClient);
      this.beaconService.imageVersion = this.getLatestVersion(versions, this.beaconService);
      if (this.mevboost) this.mevboost.imageVersion = this.getLatestVersion(versions, this.mevboost);
      if (this.validatorService) {
        this.validatorService.imageVersion = this.getLatestVersion(versions, this.validatorService);
      }
      if (this.extraServices) {
        this.extraServices.forEach((service) => {
          service.imageVersion = this.getLatestVersion(versions, service);
        });
      }
    }
  }

  getLatestVersion(versions, service) {
    let network = service.network;
    let version = service.imageVersion;
    if (versions[network] && versions[network][service.service]) {
      version = versions[network][service.service].slice(-1).pop();
    } else if (versions["mainnet"] && versions["mainnet"][service.service]) {
      version = versions["mainnet"][service.service].slice(-1).pop();
    } else if (versions["prater"] && versions["prater"][service.service]) {
      version = versions["prater"][service.service].slice(-1).pop();
    }
    return version;
  }

  async writeConfig() {
    const configs = this.getConfigurations();
    if (configs[0] !== undefined) {
      await Promise.all(
        configs.map(async (config) => {
          await this.nodeConnection.writeServiceConfiguration(config);
        })
      );
      await this.serviceManager.createKeystores(this.needsKeystore);
      return configs;
    }
  }

  async startServices() {
    const services = this.getConfigurations().filter(s => !this.notToStart.includes(s.id))
    const runRefs = [];
    if (services[0] !== undefined) {
      await Promise.all(
        services.map(async (service, index) => {
          Sleep(index * 1000).then(() => runRefs.push(this.serviceManager.manageServiceState(service.id, "started")));
        })
      );
    }
    this.clearSetup();
    return runRefs;
  }

  async getSetupConstellation(setup, network) {
    this.clearSetup();
    this.setup = setup;
    this.network = network;
    let services = ["GethService", "GrafanaService", "PrometheusNodeExporterService", "PrometheusService", "NotificationService"];

    this.choosenClient = await this.chooseClient();
    this.choosenClient = this.choosenClient.charAt(0).toUpperCase() + this.choosenClient.slice(1);

    services.push(this.choosenClient + "ValidatorService");
    services.push(this.choosenClient + "BeaconService");

    if (network === "gnosis")
      services = [
        "NethermindService",
        "LighthouseBeaconService",
        "LighthouseValidatorService",
        "GrafanaService",
        "PrometheusNodeExporterService",
        "PrometheusService",
        "NotificationService"
      ];

    switch (setup) {
      case "staking":
        break;
      case "mev boost":
        services.push("FlashbotsMevBoostService");
        break;
      case "ssv.network":
        services.push("SSVNetworkService");
        break;
      case "obol":
        services = ["GethService", "LighthouseBeaconService", "TekuValidatorService", "CharonService", "GrafanaService", "PrometheusNodeExporterService", "PrometheusService", "NotificationService"];
        break;
      case "rocketpool":
        services.push("ROCKETPOOL");
        break;
      case "stereum on arm":
        services = services.filter(s => !["GrafanaService", "PrometheusNodeExporterService", "PrometheusService", "NotificationService"].includes(s));
        break;
      case "archive":
        break;
    }
    return services;
  }
}
