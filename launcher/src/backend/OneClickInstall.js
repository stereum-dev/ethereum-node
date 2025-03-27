import { ServiceManager } from "./ServiceManager";
import YAML from "yaml";
import { StringUtils } from "./StringUtils";
import { ConfigManager } from "./ConfigManager";

const log = require("electron-log");

async function Sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class OneClickInstall {
  async prepareNode(installDir, nodeConnection) {
    this.installDir = installDir;
    this.nodeConnection = nodeConnection;
    this.serviceManager = new ServiceManager(this.nodeConnection);
    this.configManager = new ConfigManager(this.nodeConnection);
    const arch = await this.nodeConnection.getCPUArchitecture();
    const settings = {
      stereum_settings: {
        settings: {
          controls_install_path: this.installDir || "/opt/stereum",
          arch: arch,
          updates: {
            lane: "stable",
            unattended: {
              install: false,
            },
          },
        },
      },
    };
    await this.nodeConnection.sshService.exec(`rm -rf /etc/stereum &&\
    mkdir -p /etc/stereum/services &&\
    echo -e ${StringUtils.escapeStringForShell(YAML.stringify(settings))} > /etc/stereum/stereum.yaml`);
    await this.configManager.createMultiSetupYaml({}, "");
    await this.nodeConnection.findStereumSettings();
    return await this.nodeConnection.prepareStereumNode(this.nodeConnection.settings.stereum.settings.controls_install_path);
  }

  //this is broken
  chooseClient(clients) {
    let client = clients[Math.floor(Math.random() * clients.length)].toLowerCase();
    return client.charAt(0).toUpperCase() + client.slice(1);
  }

  clearSetup() {
    this.beaconService = undefined;
    this.validatorService = undefined;
    this.installDir = undefined;
    this.executionClient = undefined;
    this.setup = undefined;
    this.network = undefined;
    this.mevboost = undefined;
    this.needsKeystore = [];
    this.extraServices = [];
    this.notToStart = [];
  }

  getConfigurations() {
    let serviceList = [];
    serviceList.push(this.beaconService, this.executionClient);
    if (this.mevboost) serviceList.push(this.mevboost);
    if (this.validatorService) serviceList.push(this.validatorService);
    if (this.extraServices) this.extraServices.forEach((service) => serviceList.push(service));
    serviceList.forEach((service) => {
      if (service.switchImageTag) service.switchImageTag(this.nodeConnection.settings.stereum.settings.arch);
    });
    return serviceList.map((service) => service.buildConfiguration());
  }

  async createServices(constellation, checkpointURL, relayURL, selectedPreset) {
    this.needsKeystore = [];
    let args = {
      network: this.network,
      installDir: this.installDir,
      checkpointURL: checkpointURL,
      relays: relayURL,
    };
    if (constellation.includes("GethService")) {
      //GethService
      this.executionClient = this.serviceManager.getService("GethService", args);
    }

    if (constellation.includes("RethService")) {
      //RethService
      this.executionClient = this.serviceManager.getService("RethService", args);
    }

    if (constellation.includes("BesuService")) {
      //BesuService
      this.executionClient = this.serviceManager.getService("BesuService", args);
    }

    if (constellation.includes("NethermindService")) {
      //NethermindService
      this.executionClient = this.serviceManager.getService("NethermindService", args);
    }

    if (constellation.includes("ErigonService")) {
      //ErigonService
      this.executionClient = this.serviceManager.getService("ErigonService", args);
    }

    if (constellation.includes("FlashbotsMevBoostService")) {
      //FlashbotsMevBoostService
      this.mevboost = this.serviceManager.getService("FlashbotsMevBoostService", args);
    }

    if (constellation.includes("LighthouseBeaconService")) {
      //LighthouseBeaconService
      this.beaconService = this.serviceManager.getService("LighthouseBeaconService", {
        ...args,
        executionClients: [this.executionClient],
        ...(this.mevboost && { mevboost: [this.mevboost] }),
      });
    }

    if (constellation.includes("LodestarBeaconService")) {
      //LodestarBeaconService
      this.beaconService = this.serviceManager.getService("LodestarBeaconService", {
        ...args,
        executionClients: [this.executionClient],
        ...(this.mevboost && { mevboost: [this.mevboost] }),
      });
    }

    if (constellation.includes("PrysmBeaconService")) {
      //PrysmBeaconService
      this.beaconService = this.serviceManager.getService("PrysmBeaconService", {
        ...args,
        executionClients: [this.executionClient],
        ...(this.mevboost && { mevboost: [this.mevboost] }),
      });
    }

    if (constellation.includes("NimbusBeaconService")) {
      //NimbusBeaconService
      this.beaconService = this.serviceManager.getService("NimbusBeaconService", {
        ...args,
        executionClients: [this.executionClient],
        ...(this.mevboost && { mevboost: [this.mevboost] }),
      });
    }

    if (constellation.includes("TekuBeaconService")) {
      //TekuBeaconService
      this.beaconService = this.serviceManager.getService("TekuBeaconService", {
        ...args,
        executionClients: [this.executionClient],
        ...(this.mevboost && { mevboost: [this.mevboost] }),
      });
    }

    if (constellation.includes("GrandineBeaconService")) {
      //GrandineBeaconService
      this.beaconService = this.serviceManager.getService("GrandineBeaconService", {
        ...args,
        executionClients: [this.executionClient],
        ...(this.mevboost && { mevboost: [this.mevboost] }),
      });
    }

    let charon = undefined;
    if (constellation.includes("CharonService")) {
      //SSVNetworkService
      charon = this.serviceManager.getService("CharonService", { ...args, consensusClients: [this.beaconService] });

      this.extraServices.push(charon);
      this.notToStart.push(charon.id);
    }

    if (constellation.includes("LighthouseValidatorService")) {
      //LighthouseValidatorService
      this.validatorService = this.serviceManager.getService("LighthouseValidatorService", {
        ...args,
        consensusClients: [charon ? charon : this.beaconService],
      });
    }

    if (constellation.includes("LodestarValidatorService")) {
      //LodestarValidatorService
      this.validatorService = this.serviceManager.getService("LodestarValidatorService", {
        ...args,
        consensusClients: [charon ? charon : this.beaconService],
      });
    }

    if (constellation.includes("PrysmValidatorService")) {
      //PrysmValidatorService
      this.validatorService = this.serviceManager.getService("PrysmValidatorService", {
        ...args,
        consensusClients: [charon ? charon : this.beaconService],
      });
    }

    if (constellation.includes("NimbusValidatorService")) {
      //NimbusBeaconService
      this.validatorService = this.serviceManager.getService("NimbusValidatorService", {
        ...args,
        consensusClients: [charon ? charon : this.beaconService],
      });
      this.needsKeystore.push(this.validatorService);
    }

    if (constellation.includes("TekuValidatorService")) {
      //TekuBeaconService
      this.validatorService = this.serviceManager.getService("TekuValidatorService", {
        ...args,
        consensusClients: [charon ? charon : this.beaconService],
      });
      this.needsKeystore.push(this.validatorService);
    }

    if (constellation.includes("SSVNetworkService")) {
      //SSVNetworkService
      this.validatorService = this.serviceManager.getService("SSVNetworkService", {
        ...args,
        consensusClients: [this.beaconService],
        executionClients: [this.executionClient],
      });
      this.needsKeystore.push(this.validatorService);
    }

    if (constellation.includes("PrometheusNodeExporterService")) {
      //PrometheusNodeExporterService
      this.extraServices.push(this.serviceManager.getService("PrometheusNodeExporterService", args));
    }

    if (constellation.includes("PrometheusService")) {
      //PrometheusService
      this.extraServices.push(this.serviceManager.getService("PrometheusService", args));
    }

    if (constellation.includes("GrafanaService")) {
      //GrafanaService
      this.extraServices.push(this.serviceManager.getService("GrafanaService", args));
    }

    if (constellation.includes("NotificationService")) {
      //NotificationService
      this.extraServices.push(this.serviceManager.getService("NotificationService", args));
    }

    if (constellation.includes("KeysAPIService")) {
      //KeysAPIService
      this.extraServices.push(
        this.serviceManager.getService("KeysAPIService", {
          ...args,
          consensusClients: [this.beaconService],
          executionClients: [this.executionClient],
        })
      );
    }

    if (constellation.includes("ValidatorEjectorService")) {
      //ValidatorEjectorService
      this.extraServices.push(
        this.serviceManager.getService("ValidatorEjectorService", {
          ...args,
          consensusClients: [this.beaconService],
          executionClients: [this.executionClient],
        })
      );
    }

    if (constellation.includes("LidoObolExitService")) {
      //LidoObolExitService
      this.extraServices.push(
        this.serviceManager.getService("LidoObolExitService", {
          ...args,
          consensusClients: [this.beaconService].concat(this.extraServices.filter((s) => s.service === "CharonService")),
          otherServices: this.extraServices.filter((s) => s.service === "ValidatorEjectorService"),
        })
      );
    }

    if (constellation.includes("KuboIPFSService")) {
      //KuboIPFSService
      this.extraServices.push(this.serviceManager.getService("KuboIPFSService", args));
    }

    if (constellation.includes("LCOMService")) {
      //LCOMService
      this.extraServices.push(
        this.serviceManager.getService("LCOMService", {
          ...args,
          consensusClients: [this.beaconService],
          executionClients: [this.executionClient],
          otherServices: this.extraServices.filter((s) => s.service === "KuboIPFSService"),
        })
      );
    }

    if (constellation.includes("SSVDKGService")) {
      let SSVDKGService = this.serviceManager.getService("SSVDKGService", {
        ...args,
        executionClients: [this.executionClient],
        otherServices: this.validatorService === "SSVNetworkService" ? [this.validatorService] : [],
      });
      this.extraServices.push(SSVDKGService);
    }

    this.handleArchiveTags(selectedPreset);
    this.handleLidoTags(selectedPreset);

    let versions;
    try {
      versions = await this.nodeConnection.nodeUpdates.checkUpdates();
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

  handleArchiveTags(selectedPreset) {
    if (/mev boost|staking/.test(selectedPreset)) {
      switch (this.executionClient.service) {
        case "RethService":
          this.executionClient.command.push("--full");
          break;
      }
    } else if (selectedPreset == "archive") {
      switch (this.executionClient.service) {
        case "GethService":
          this.executionClient.command.push("--syncmode=full");
          this.executionClient.command.push("--gcmode=archive");
          break;
        case "RethService":
          //archvie by default
          break;
        case "ErigonService":
          this.executionClient.command[this.executionClient.command.findIndex((c) => c.includes("--prune.mode"))] = "--prune.mode=archive";
          break;
        case "BesuService":
          this.executionClient.command[this.executionClient.command.findIndex((c) => c.includes("--sync-mode=SNAP"))] = "--sync-mode=FULL";
          break;
        case "NethermindService":
          this.executionClient.command[this.executionClient.command.findIndex((c) => c.includes("--config"))] += "_archive";
          this.executionClient.command[this.executionClient.command.findIndex((c) => c.includes("--Pruning.Mode="))] =
            "--Pruning.Mode=None";
          this.executionClient.command = this.executionClient.command.filter((c) => !c.includes("--Pruning.FullPruningTrigger"));
          break;
      }
      switch (this.beaconService.service) {
        case "LighthouseBeaconService":
          this.beaconService.command.push("--reconstruct-historic-states", "--genesis-backfill");
          break;
        case "LodestarBeaconService":
          this.beaconService.command = this.beaconService.command.filter((c) => !c.includes("--checkpointSyncUrl"));
          break;
        case "NimbusBeaconService":
          if (this.beaconService.command.some((c) => c.includes("--trusted-node-url="))) {
            this.beaconService.command.push("--backfill=true");
          }
          this.beaconService.command.push("--history=archive");
          break;
        case "PrysmBeaconService":
          if (Array.isArray(this.beaconService.command)) {
            this.beaconService.command.push("--slots-per-archive-point=32");
          } else {
            this.beaconService.command += " --slots-per-archive-point=32";
          }
          break;
        case "TekuBeaconService":
          this.beaconService.command[this.beaconService.command.findIndex((c) => c.includes("--data-storage-mode"))] =
            "--data-storage-mode=archive";
          break;
        case "GrandineBeaconService":
          this.beaconService.command.push("--back-sync");
          this.beaconService.command = this.beaconService.command.filter((c) => !c.includes("--prune-storage"));
          break;
      }
    }
  }

  handleLidoTags(selectedPreset) {
    if (/lidocsm/.test(selectedPreset)) {
      const networkFeeAddress = {
        mainnet: "0x388C818CA8B9251b393131C08a736A67ccB19297",
        holesky: "0xE73a3602b99f1f913e72F8bdcBC235e206794Ac8",
      };
      const serviceFeeAddressCommand = {
        LighthouseValidatorService: "--suggested-fee-recipient=",
        LodestarValidatorService: "--suggestedFeeRecipient=",
        NimbusValidatorService: "--suggested-fee-recipient=",
        PrysmValidatorService: "--suggested-fee-recipient=",
        TekuValidatorService: "--validators-proposer-default-fee-recipient=",
      };
      this.validatorService.command[
        this.validatorService.command.findIndex((c) => c.includes(serviceFeeAddressCommand[this.validatorService.service]))
      ] = serviceFeeAddressCommand[this.validatorService.service] + networkFeeAddress[this.network];
    }
    if (this.extraServices.some((s) => s.service === "ValidatorEjectorService")) {
      const moduleIDs = {
        lidocsm: "4",
        lidossv: "2",
        lidoobol: "2",
      };
      let ejector = this.extraServices.find((s) => s.service === "ValidatorEjectorService");
      ejector.env.STAKING_MODULE_ID = moduleIDs[selectedPreset];
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
      this.configManager.createMultiSetupYaml(configs, this.network);
      await Promise.all(
        configs.map(async (config) => {
          await this.nodeConnection.writeServiceConfiguration(config);
        })
      );
      await this.serviceManager.createKeystores(this.needsKeystore);
      await this.serviceManager.prepareSSVDKG(this.extraServices.find((s) => s.service === "SSVDKGService"));
      await this.serviceManager.initKeysAPI(this.extraServices.filter((s) => s.service === "KeysAPIService"));
      return configs;
    }
  }

  async startServices() {
    const services = this.getConfigurations().filter((s) => !this.notToStart.includes(s.id));
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
    let services = ["GrafanaService", "PrometheusNodeExporterService", "PrometheusService", "NotificationService"];

    const selectedCC_VC = this.chooseClient(["PRYSM", "LIGHTHOUSE", "NIMBUS", "TEKU", "LODESTAR"]);

    services.push(selectedCC_VC + "ValidatorService");
    services.push(selectedCC_VC + "BeaconService");

    const selectedEC = this.chooseClient(["GETH", "BESU", "NETHERMIND"]);

    services.push(selectedEC + "Service");

    if (network === "gnosis")
      services = [
        "NethermindService",
        "LighthouseBeaconService",
        "LighthouseValidatorService",
        "GrafanaService",
        "PrometheusNodeExporterService",
        "PrometheusService",
        "NotificationService",
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
        services.push("FlashbotsMevBoostService", "CharonService");
        break;
      case "stereum on arm":
        services = services.filter(
          (s) => !["GrafanaService", "PrometheusNodeExporterService", "PrometheusService", "NotificationService"].includes(s)
        );
        break;
      case "archive":
        break;
      case "lidoobol":
        services.push("LidoObolExitService", "CharonService", "ValidatorEjectorService", "FlashbotsMevBoostService");
        break;
      case "lidossv":
        services.push("SSVNetworkService", "SSVDKGService", "FlashbotsMevBoostService");
        break;
      case "lidocsm":
        services.push("FlashbotsMevBoostService", "KeysAPIService", "ValidatorEjectorService", "KuboIPFSService", "LCOMService");
    }
    return services;
  }
}
