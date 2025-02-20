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
    console.log("111111111------------------------------", clients);
    if (clients && clients.length > 0) {
      let client = clients[Math.floor(Math.random() * clients.length)].toLowerCase();
      console.log("2222222------------------------------", clients);
      return client.charAt(0).toUpperCase() + client.slice(1);
    }
  }

  clearSetup() {
    this.beaconService = [];
    this.validatorService = undefined;
    this.installDir = undefined;
    this.executionClient = [];
    this.setup = undefined;
    this.network = undefined;
    this.mevboost = undefined;
    this.needsKeystore = [];
    this.extraServices = [];
    this.notToStart = [];
  }

  getConfigurations() {
    let serviceList = [];
    this.beaconService.forEach((service) => {
      serviceList.push(service);
    });
    this.executionClient.forEach((client) => {
      serviceList.push(client);
    });
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
    this.executionClient = [];
    this.beaconService = [];
    let args = {
      network: this.network,
      installDir: this.installDir,
      checkpointURL: checkpointURL,
      relays: relayURL,
    };
    if (constellation.includes("GethService")) {
      //GethService
      this.executionClient.push(this.serviceManager.getService("GethService", args));
    }

    if (constellation.includes("RethService")) {
      //RethService
      this.executionClient.push(this.serviceManager.getService("RethService", args));
    }

    if (constellation.includes("BesuService")) {
      //BesuService
      this.executionClient.push(this.serviceManager.getService("BesuService", args));
    }

    if (constellation.includes("NethermindService")) {
      //NethermindService
      this.executionClient.push(this.serviceManager.getService("NethermindService", args));
    }

    if (constellation.includes("ErigonService")) {
      //ErigonService
      this.executionClient.push(this.serviceManager.getService("ErigonService", args));
    }

    if (constellation.includes("FlashbotsMevBoostService")) {
      //FlashbotsMevBoostService
      this.mevboost = this.serviceManager.getService("FlashbotsMevBoostService", args);
    }

    if (constellation.includes("LighthouseBeaconService")) {
      //LighthouseBeaconService
      this.beaconService.push(
        this.serviceManager.getService("LighthouseBeaconService", {
          ...args,
          executionClients: this.executionClient.filter(
            (client) => client.service !== "OpGethService" || client.service !== "L2GethService"
          ),
          ...(this.mevboost && { mevboost: [this.mevboost] }),
        })
      );
    }

    if (constellation.includes("LodestarBeaconService")) {
      //LodestarBeaconService
      this.beaconService.push(
        this.serviceManager.getService("LodestarBeaconService", {
          ...args,
          executionClients: this.executionClient.filter(
            (client) => client.service !== "OpGethService" || client.service !== "L2GethService"
          ),
          ...(this.mevboost && { mevboost: [this.mevboost] }),
        })
      );
    }

    if (constellation.includes("PrysmBeaconService")) {
      //PrysmBeaconService
      this.beaconService.push(
        this.serviceManager.getService("PrysmBeaconService", {
          ...args,
          executionClients: this.executionClient.filter(
            (client) => client.service !== "OpGethService" || client.service !== "L2GethService"
          ),
          ...(this.mevboost && { mevboost: [this.mevboost] }),
        })
      );
    }

    if (constellation.includes("NimbusBeaconService")) {
      //NimbusBeaconService
      this.beaconService.push(
        this.serviceManager.getService("NimbusBeaconService", {
          ...args,
          executionClients: this.executionClient.filter(
            (client) => client.service !== "OpGethService" || client.service !== "L2GethService"
          ),
          ...(this.mevboost && { mevboost: [this.mevboost] }),
        })
      );
    }

    if (constellation.includes("TekuBeaconService")) {
      //TekuBeaconService
      this.beaconService.push(
        this.serviceManager.getService("TekuBeaconService", {
          ...args,
          executionClients: this.executionClient.filter(
            (client) => client.service !== "OpGethService" || client.service !== "L2GethService"
          ),
          ...(this.mevboost && { mevboost: [this.mevboost] }),
        })
      );
    }
    let charon = undefined;
    if (constellation.includes("CharonService")) {
      //SSVNetworkService
      charon = this.serviceManager.getService("CharonService", {
        ...args,
        consensusClients: this.beaconService.filter((service) => service.service !== "OpNodeBeaconService"),
      });

      this.extraServices.push(charon);
      this.notToStart.push(charon.id);
    }

    if (constellation.includes("LighthouseValidatorService")) {
      //LighthouseValidatorService
      this.validatorService = this.serviceManager.getService("LighthouseValidatorService", {
        ...args,
        consensusClients: charon ? [charon] : this.beaconService.filter((service) => service.service !== "OpNodeBeaconService"),
      });
    }

    if (constellation.includes("LodestarValidatorService")) {
      //LodestarValidatorService
      this.validatorService = this.serviceManager.getService("LodestarValidatorService", {
        ...args,
        consensusClients: charon ? [charon] : this.beaconService.filter((service) => service.service !== "OpNodeBeaconService"),
      });
    }

    if (constellation.includes("PrysmValidatorService")) {
      //PrysmValidatorService
      this.validatorService = this.serviceManager.getService("PrysmValidatorService", {
        ...args,
        consensusClients: charon ? [charon] : this.beaconService.filter((service) => service.service !== "OpNodeBeaconService"),
      });
    }

    if (constellation.includes("NimbusValidatorService")) {
      //NimbusBeaconService
      this.validatorService = this.serviceManager.getService("NimbusValidatorService", {
        ...args,
        consensusClients: charon ? [charon] : this.beaconService.filter((service) => service.service !== "OpNodeBeaconService"),
      });
      this.needsKeystore.push(this.validatorService);
    }

    if (constellation.includes("TekuValidatorService")) {
      //TekuBeaconService
      this.validatorService = this.serviceManager.getService("TekuValidatorService", {
        ...args,
        consensusClients: charon ? [charon] : this.beaconService.filter((service) => service.service !== "OpNodeBeaconService"),
      });
      this.needsKeystore.push(this.validatorService);
    }

    if (constellation.includes("SSVNetworkService")) {
      //SSVNetworkService
      this.validatorService = this.serviceManager.getService("SSVNetworkService", {
        ...args,
        consensusClients: this.beaconService.filter((service) => service.service !== "OpNodeBeaconService"),
        executionClients: this.executionClient.filter((client) => client.service !== "OpGethService" || client.service !== "L2GethService"),
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
          consensusClients: this.beaconService.filter((service) => service.service !== "OpNodeBeaconService"),
          executionClients: this.executionClient.filter(
            (client) => client.service !== "OpGethService" || client.service !== "L2GethService"
          ),
        })
      );
    }

    if (constellation.includes("ValidatorEjectorService")) {
      //ValidatorEjectorService
      this.extraServices.push(
        this.serviceManager.getService("ValidatorEjectorService", {
          ...args,
          consensusClients: this.beaconService.filter((service) => service.service !== "OpNodeBeaconService"),
          executionClients: this.executionClient.filter(
            (client) => client.service !== "OpGethService" || client.service !== "L2GethService"
          ),
        })
      );
    }

    if (constellation.includes("LidoObolExitService")) {
      //LidoObolExitService
      this.extraServices.push(
        this.serviceManager.getService("LidoObolExitService", {
          ...args,
          consensusClients: this.beaconService
            .filter((service) => service.service !== "OpNodeBeaconService")
            .concat(this.extraServices.filter((s) => s.service === "CharonService")),
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
          consensusClients: this.beaconService.filter((service) => service.service !== "OpNodeBeaconService"),
          executionClients: this.executionClient.filter(
            (client) => client.service !== "OpGethService" || client.service !== "L2GethService"
          ),
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

    if (constellation.includes("L2GethService")) {
      //L2GethService
      this.executionClient.push(this.serviceManager.getService("L2GethService", args));
    }

    if (constellation.includes("OpGethService")) {
      //OpGethService
      this.executionClient.push(
        this.serviceManager.getService("OpGethService", {
          ...args,
          executionClients: this.executionClient.filter((client) => client.service === "L2GethService"),
        })
      );
    }

    if (constellation.includes("OpNodeBeaconService")) {
      //OpNodeBeaconService
      this.beaconService.push(
        this.serviceManager.getService("OpNodeBeaconService", {
          ...args,
          executionClients: this.executionClient.filter((client) => client.service !== "L2GethService"),
          consensusClients: this.beaconService.filter((service) => service.service !== "OpNodeBeaconService"),
        })
      );

      this.beaconService
        .filter((service) => service.service === "OpNodeBeaconService")
        .map((service) => service.id)
        .forEach((id) => {
          if (!this.notToStart.includes(id)) {
            this.notToStart.push(id);
          }
        });
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
      this.executionClient.forEach((client) => {
        client.imageVersion = this.getLatestVersion(versions, client);
      });
      this.beaconService.forEach((service) => {
        service.imageVersion = this.getLatestVersion(versions, service);
      });
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
    if (selectedPreset == "staking") {
      this.executionClient.forEach((client) => {
        switch (client.service) {
          case "RethService":
            client.command.push("--full");
            break;
        }
      });
    } else if (selectedPreset == "archive") {
      this.executionClient
        .filter((service) => service.service !== "OpGethService")
        .forEach((client) => {
          switch (client.service) {
            case "GethService":
              client.command.push("--syncmode=full");
              client.command.push("--gcmode=archive");
              break;
            case "RethService":
              // archive by default
              break;
            case "ErigonService":
              client.command = client.command.filter((c) => !c.includes("--prune"));
              break;
            case "BesuService":
              client.command[client.command.findIndex((c) => c.includes("--sync-mode=SNAP"))] = "--sync-mode=FULL";
              break;
            case "NethermindService":
              client.command[client.command.findIndex((c) => c.includes("--config"))] += "_archive";
              client.command[client.command.findIndex((c) => c.includes("--Pruning.Mode="))] = "--Pruning.Mode=None";
              client.command = client.command.filter((c) => !c.includes("--Pruning.FullPruningTrigger"));
              break;
          }
        });
      this.beaconService
        .filter((service) => service.service !== "OpNodeBeaconService")
        .forEach((service) => {
          switch (service.service) {
            case "LighthouseBeaconService":
              service.command.push("--reconstruct-historic-states", "--genesis-backfill");
              break;
            case "LodestarBeaconService":
              service.command = service.command.filter((c) => !c.includes("--checkpointSyncUrl"));
              break;
            case "NimbusBeaconService":
              if (service.command.some((c) => c.includes("--trusted-node-url="))) {
                service.command.push("--backfill=true");
              }
              service.command.push("--history=archive");
              break;
            case "PrysmBeaconService":
              if (Array.isArray(service.command)) {
                service.command.push("--slots-per-archive-point=32");
              } else {
                service.command += " --slots-per-archive-point=32";
              }
              break;
            case "TekuBeaconService":
              service.command[service.command.findIndex((c) => c.includes("--data-storage-mode"))] = "--data-storage-mode=archive";
              break;
          }
        });
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

    // const selectedCC_VC = this.chooseClient(["PRYSM", "LIGHTHOUSE", "NIMBUS", "TEKU", "LODESTAR"]);
    const selectedCC_VC = (() => {
      switch (setup) {
        case "op full node":
          return this.chooseClient([]);
        case "op node archive":
          return this.chooseClient([]);
        default:
          return this.chooseClient(["PRYSM", "LIGHTHOUSE", "NIMBUS", "TEKU", "LODESTAR"]);
      }
    })();

    services.push(selectedCC_VC + "ValidatorService");
    services.push(selectedCC_VC + "BeaconService");

    const selectedEC = (() => {
      switch (setup) {
        case "op full node":
          return this.chooseClient([]);
        case "op node archive":
          return this.chooseClient([]);
        default:
          return this.chooseClient(["GETH", "BESU", "NETHERMIND"]);
      }
    })();

    // const selectedEC =
    //   setup === "op full node"
    //     ? this.chooseClient(["GETH", "RETH", "NETHERMIND", "BESU", "ERIGON"])
    //     : this.chooseClient(["GETH", "BESU", "NETHERMIND"]);

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
        break;
      case "op full node":
        services.push("OpGethService", "OpNodeBeaconService");
        break;
      case "op and eth full node":
        services.push("OpGethService", "OpNodeBeaconService");
        break;
      case "op node archive":
        services.push("OpGethService", "OpNodeBeaconService");
        break;
      case "op and eth node archive":
        services.push("OpGethService", "OpNodeBeaconService");
        break;
    }
    return services;
  }
}
